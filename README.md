
# Debugging Disciples SlackBot

This Slack app is designed for faith-based communities, providing interactive spiritual support and Bible study tools directly in Slack. Built with Node.js, Firebase, and Gemini AI.

## Features

- **Prayer Requests**
	- Send a prayer request with `pray4me: <your request>` (e.g., `pray4me: My dog is sick`).
	- Your request is saved to Firestore and can be retrieved with `prayer requests`.

- **Bible Verse Lookup**
	- Get any Bible passage with `bible: <reference>` (e.g., `bible: John 3:16-17`).
	- The bot fetches the passage and displays it, with buttons to switch between translations (ASV, BBE, KJV).

- **Bible Q&A (Gemini AI)**
	- Ask Bible questions with `explain: <your question>` (e.g., `explain: Why is Jesus God according to John`).
	- Gemini AI answers with a concise, scripture-based response (max 400 characters), and the Q&A is saved to Firestore.

- **Interactive Buttons**
	- Many responses include interactive Slack buttons for translation switching or engagement.

## Setup

1. Clone the repo and install dependencies:
	 ```bash
	 npm install
	 ```
2. Set up your `.env` file with Slack and Gemini API keys.
3. Configure Firebase in `firebase.js`.
4. Start the bot:
	 ```bash
	 npm run start
	 ```

## Usage

Invite the bot to your Slack channel and use the commands above. All features work in both desktop and mobile Slack (ensure exact command format for best results).

## Tech Stack

- Node.js, Slack Bolt, Firebase Firestore, Gemini AI, Bible-API

---
For questions or contributions, open an issue or PR!