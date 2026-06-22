# Tool Setup

## The AI Development Stack

Not all AI tools are created equal. Here's what you actually need, what's optional, and what's a waste of money.

### Must-Have Tools

| Tool | What It Does | Cost |
|------|-------------|------|
| Cursor IDE | AI-native code editor (fork of VS Code) | Free tier / $20/mo |
| Claude (Pro) | Best reasoning model for complex tasks | $20/mo |
| GitHub Copilot | Inline code completion | $10/mo |

### Nice to Have

| Tool | What It Does | When to Use |
|------|-------------|-------------|
| ChatGPT Plus | Good for general questions, browsing | Research, non-code tasks |
| Perplexity | AI-powered search with sources | Finding documentation, APIs |
| v0 by Vercel | UI component generation | Frontend prototyping |

### Skip These (For Now)

- AI coding agents that run autonomously (not mature enough)
- Prompt marketplace subscriptions (you'll write better prompts yourself)
- Multiple IDE AI extensions at once (they conflict)

## Installation Walkthrough

### Step 1: Install Cursor

Download from cursor.sh. It's a VS Code fork, so all your extensions and settings carry over.

![full](./screenshots/02-tool-setup/cursor-download.png)

### Step 2: Configure AI Settings

Open Settings > AI and configure:

- Model: Claude Sonnet (best balance of speed and quality)
- Context: Enable workspace indexing
- Auto-complete: Set to "eager" mode

![](./screenshots/02-tool-setup/cursor-settings.png)

### Step 3: Set Up Claude

Create an account at claude.ai. The Pro plan ($20/mo) gives you access to Claude Opus for complex reasoning tasks.

> Tip: Use Claude for planning and architecture, Cursor for implementation. They complement each other perfectly.

## Verifying Your Setup

Run this quick test to confirm everything works:

1. Open Cursor
2. Create a new file `test.ts`
3. Type a comment describing a function and let Copilot complete it
4. Open the AI chat (Cmd+L) and ask it to improve the function

If all three respond, you're ready for the next chapter.
