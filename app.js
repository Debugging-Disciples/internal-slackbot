import https from "https";
import { query, where, getDocs, orderBy } from "firebase/firestore";
import { App } from "@slack/bolt";
import { db } from "./firebase.js";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { render } from "@react-email/render";
import React from "react";
import WelcomeEmail from "./welcome-email.jsx";
const translations = [
  {
    title: "American Standard Version",
    abbreviation: "asv",
  },
  {
    title: "Bible in Basic English",
    abbreviation: "bbe",
  },
  {
    title: "King James Version",
    abbreviation: "kjv",
  },
];
// Initializes your app with your bot token and app token
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

// Listens to incoming messages that contain "hello"
app.message("hello", async ({ message, say }) => {
  console.log("Message received:", message);
  await say({
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Hey there <@${message.user}>!`,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Click Me",
          },
          action_id: "button_click",
        },
      },
    ],
    text: `Hey there <@${message.user}>!`,
  });
});

app.message(/^prayer\s*requests$/i, async ({ message, say }) => {
  try {
    const q = query(
      collection(db, "prayer-requests"),
      where("user", "==", message.user),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      await say("You have no prayer requests.");
      return;
    }
    let response = "*Your Prayer Requests:*\n";
    Array.from(querySnapshot.docs).forEach((doc, idx) => {
      const data = doc.data();
      const date = data.timestamp?.toDate?.().toLocaleString?.() || "";
      response += `*${idx + 1}.* _${date}_\n> ${data.text}\n`;
    });
    await say(response);
  } catch (error) {
    console.error("Error fetching prayer requests:", error);
    await say("Sorry, there was an error fetching your prayer requests.");
  }
});

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-2.5-flash-lite";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent`;

app.message(/^explain:\s*(.+)/i, async ({ message, context, say }) => {
  const userQuestion = context.matches[1]?.trim();
  if (!userQuestion) {
    await say('Please provide a question after "explain:".');
    return;
  }
  if (!GEMINI_API_KEY) {
    await say("Gemini API key is not configured.");
    return;
  }

  const prompt =
    "You are a Bible expert. Only answer questions about the Bible. " +
    "Give a very short answer and include scripture(s) (max 400 characters total length).\n" +
    `Question: ${userQuestion}`;

  // body for Gemini v1 generateContent
  const body = JSON.stringify({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });

  // GEMINI_API_URL should now look like:
  // `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent`
  const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let fallbackText = "Sorry, there was an error getting an explanation.";

  try {
    const answer = await new Promise((resolve) => {
      const req = https.request(url, options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => {
          try {
            const result = JSON.parse(data);

            // handle error payloads gracefully
            if (result.error) {
              console.error("Gemini API error payload:", result.error);
              return resolve(null);
            }

            const text =
              result.candidates?.[0]?.content?.parts?.[0]?.text ??
              result.candidates?.[0]?.output_text;
            resolve(text || null);
          } catch (e) {
            console.error("Gemini parse error:", e, data);
            resolve(null);
          }
        });
      });

      req.on("error", (err) => {
        console.error("Gemini API error:", err);
        resolve(null);
      });

      req.write(body);
      req.end();
    });

    if (answer) {
      await say(answer);
      // Save to Firestore Questions collection
      try {
        await addDoc(collection(db, "Questions"), {
          user: message.user,
          question: userQuestion,
          response: answer,
          timestamp: Timestamp.now(),
        });
      } catch (err) {
        console.error("Error saving question to Firestore:", err);
      }
    } else {
      await say("No answer received from Gemini.");
    }
  } catch (error) {
    console.error("Gemini API error:", error);
    await say(fallbackText);
  }
});

app.event("team_join", async ({ event, client }) => {
  try {
    await client.chat.postMessage({
      channel: "C06LD5BGUP7",
      text: `Everyone welcome <@${event.user.id}> to the community! 🎉`,
    });

    const userInfo = await client.users.info({
      user: event.user.id,
    });

    const email = userInfo.user.profile.email;
    const firstName = userInfo.user.profile.first_name || "there";
    const html = await render(React.createElement(WelcomeEmail, { name: firstName }));

    const resend = new Resend(process.env.RESEND_API_KEY);

    if (email) {
      await resend.emails.send({
        from: "Debugging Disciples <info@debuggingdisciples.org>",
        to: email,
        subject: "Welcome to Debugging Disciples 🙌",
        html: html,
      });
    }
  } catch (error) {
    console.error("Error sending welcome message on team_join:", error);
  }
});

app.message(/^bible:\s*(.+)/i, async ({ message, context, say }) => {
  const verse = context.matches[1]?.trim();

  if (!verse) {
    await say(
      'Please provide a verse after "bible:". For example: bible: John 3:16'
    );
    return;
  }
  const translation = "asv";
  await sendBibleVerses({ verse, translation, say });
});

async function sendBibleVerses({
  verse,
  translation,
  say,
  client,
  channel,
  messageTs,
}) {
  const url = `https://bible-api.com/${encodeURIComponent(
    verse
  )}?translation=${translation}`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      await say("Sorry, I could not fetch that verse.");
      return;
    }
    const data = await res.json();

    if (
      !data.verses ||
      !Array.isArray(data.verses) ||
      data.verses.length === 0
    ) {
      await say("No verses found for that reference.");
      return;
    }
    // Use the verses array as specified
    const first = data.verses[0];
    const last = data.verses[data.verses.length - 1];
    let verseRange = first.verse;
    if (data.verses.length > 1) {
      verseRange = `${first.verse}-${last.verse}`;
    }
    const title = `*${first.book_name} ${first.chapter
      }:${verseRange} (${translation.toUpperCase()})*`;
    const versesText = data.verses
      .map((v) => `*${v.verse}*: ${v.text.trim()}`)
      .join("\n");
    // Build translation buttons
    const buttons = translations.map((t) => ({
      type: "button",
      text: {
        type: "plain_text",
        text: t.title,
      },
      value: JSON.stringify({ verse, translation: t.abbreviation }),
      action_id: `bible_translation_${t.abbreviation}`,
    }));
    const blocks = [
      {
        type: "section",
        text: { type: "mrkdwn", text: `${title}\n${versesText}` },
      },
      { type: "actions", elements: buttons },
    ];
    // Only use client/chat.update for button actions, otherwise always use say
    if (client && channel && messageTs) {
      await client.chat.update({
        channel,
        ts: messageTs,
        blocks,
        text: `${title}\n${versesText}`,
      });
    } else {
      await say({ blocks, text: `${title}\n${versesText}` });
    }
  } catch (error) {
    console.error("Error fetching Bible verse:", error);
    await say("Sorry, there was an error fetching the Bible verse.");
  }
}

// Add action listeners for translation buttons
translations.forEach((t) => {
  app.action(
    `bible_translation_${t.abbreviation}`,
    async ({ body, ack, client }) => {
      await ack();
      const { verse, translation } = JSON.parse(body.actions[0].value);
      await sendBibleVerses({
        verse,
        translation,
        client,
        channel: body.channel.id,
        messageTs: body.message.ts,
      });
    }
  );
});

// Listen for messages starting with "pray4me:"
app.message(/^pray4me:\s*(.+)/i, async ({ message, context, say }) => {
  const prayerText = context.matches[1]?.trim();
  if (!prayerText) {
    await say('Please provide a prayer request after "pray4me:".');
    return;
  }
  try {
    await addDoc(collection(db, "prayer-requests"), {
      user: message.user,
      text: prayerText,
      timestamp: Timestamp.now(),
    });
    await say("🙏 Your prayer request has been received.");
  } catch (error) {
    console.error("Error adding prayer request:", error);
    await say("Sorry, there was an error saving your prayer request.");
  }
});

app.action("button_click", async ({ body, ack, say }) => {
  // Acknowledge the action
  await ack();
  await say(`<@${body.user.id}> clicked the button`);
});

(async () => {
  // Start your app
  await app.start();

  app.logger.info("⚡️ Bolt app is running!");
})();
