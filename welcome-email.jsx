import { Resend } from "resend";
import fs from "fs";
import path from "path";
import React from "react";
import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Section,
    Text,
    Button,
    Link,
} from "@react-email/components";


export default function WelcomeEmail({ name }) {
    return (
        <Html>
            <Head />
            <Preview>
                Welcome to Debugging Disciples, {name}! Let’s grow in faith and tech.
            </Preview>

            <Body style={main}>
                <Container style={container}>
                    {/* Header */}
                    <Section style={header}>
                        <Text style={logo}>Debugging Disciples</Text>
                    </Section>

                    {/* Main Card */}
                    <Section style={card}>
                        <Text style={greeting}>🎉 Welcome, {name}!</Text>

                        <Text style={paragraph}>
                            You’ve officially joined <strong>Debugging Disciples</strong> and
                            we’re genuinely excited to have you here.
                        </Text>

                        <Text style={paragraph}>
                            This community exists at the intersection of faith, technology,
                            and purpose. Whether you’re navigating college, your career,
                            building projects, or growing in your walk with God, you’re not
                            meant to do it alone.
                        </Text>

                        <Text style={sectionTitle}>📖 What We’re Doing Right Now</Text>

                        <Text style={paragraph}>
                            We’re currently studying <strong>1 Samuel</strong> together,
                            walking through David’s story and what it teaches us about
                            obedience, leadership, and trusting God in every season.
                        </Text>

                        <Text style={paragraph}>
                            We meet Sundays at <strong>5pm EST</strong>. You’re always welcome
                            to jump in.
                        </Text>

                        <Text style={sectionTitle}>💬 Channels You’ll Love</Text>

                        <Text style={paragraph}>
                            • <strong>#introductions</strong> – Tell us who you are and what
                            you’re building
                            <br />
                            • <strong>#wins</strong> – Share what God is doing in your life
                            <br />
                            • <strong>#faith-circle</strong> – Deeper conversations and
                            encouragement
                            <br />
                            • <strong>#prayer-requests</strong> – Ask for prayer or pray for
                            others
                            <br />
                            • <strong>#career</strong> – Opportunities and info sessions
                        </Text>

                        <Text style={sectionTitle}>🤖 Built by Builders, for Builders</Text>

                        <Text style={paragraph}>
                            We even have our own internal SlackBot. Try commands like:
                            <br />
                            <br />
                            -pray4me: [request]
                            <br />
                            "prayer requests"
                            <br />
                            -bible: [Book] [Chapter]:[Verse(s)]
                            <br />
                            -explain: [topic]
                        </Text>

                        <Text style={sectionTitle}>🚀 Want to Build With Us?</Text>

                        <Text style={paragraph}>
                            If you enjoy building meaningful projects, we have an open
                            community project you can contribute to:
                        </Text>

                        <Section style={buttonContainer}>
                            <a
                                style={button}
                                href="https://www.github.com/Debugging-Disciples/PurePath-App"
                                target="_blank"
                            >
                                Contribute to PurePath
                            </a>
                        </Section>

                        <Text style={sectionTitle}>🌍 Stay Connected</Text>

                        <Text style={paragraph}>
                            Follow us on LinkedIn to stay updated on community highlights,
                            career opportunities, and upcoming collaborations.
                        </Text>

                        <Section style={buttonContainer}>
                            <a
                                href="https://www.linkedin.com/company/debuggingdisciples"
                                target="_blank"
                                style={buttonSecondary}
                            >
                                Follow Us on LinkedIn
                            </a>
                        </Section>

                        <Text style={paragraph}>
                            Or explore everything happening in the community:
                        </Text>

                        <Section style={buttonContainer}>
                            <a
                                href="https://www.debuggingdisciples.org/"
                                target="_blank"
                                style={button}

                            >
                                Explore Our Community
                            </a>
                        </Section>

                        <Text style={closing}>
                            We’re really glad you’re here, {name}. Introduce yourself and
                            let’s grow together in faith and excellence.
                        </Text>

                        <Text style={team}>Debugging Disciples Team</Text>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerText}>
                            © 2026 Debugging Disciples. All rights reserved.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
}

/* Styles */

const main = {
    backgroundColor: "#f6f9fc",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
    padding: "40px 0",
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "0",
    borderRadius: "8px",
    maxWidth: "600px",
    overflow: "hidden",
};

const header = {
    backgroundColor: "#0f172a",
    padding: "20px",
    textAlign: "center",
};

const logo = {
    color: "#ffffff",
    fontSize: "20px",
    fontWeight: "bold",
};

const card = {
    padding: "32px",
};

const greeting = {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "16px",
};

const sectionTitle = {
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "24px",
    marginBottom: "8px",
};

const paragraph = {
    fontSize: "14px",
    lineHeight: "22px",
    color: "#374151",
    marginBottom: "16px",
};

const buttonContainer = {
    textAlign: "center",
    margin: "20px 0",
};

const button = {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    padding: "12px 20px",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "14px",
};

const buttonSecondary = {
    backgroundColor: "#0a66c2",
    color: "#ffffff",
    padding: "12px 20px",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "14px",
};

const closing = {
    marginTop: "24px",
    fontSize: "14px",
};

const team = {
    marginTop: "8px",
    fontWeight: "bold",
};

const footer = {
    padding: "20px",
    textAlign: "center",
};

const footerText = {
    fontSize: "12px",
    color: "#9ca3af",
};