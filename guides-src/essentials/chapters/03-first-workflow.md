# Your First AI Workflow

## The Problem With Copy-Paste

Most developers use AI like this:

1. Ask ChatGPT a question
2. Copy the response
3. Paste it into their code
4. Wonder why it doesn't work
5. Ask again with the error message

This is the slow, frustrating way. Here's the fast way.

## The Build-Refine-Verify Loop

The most effective AI workflow has three phases:

### Phase 1: Build

Give the AI context and a clear task. Not "make me a login page" but:

```
I'm building a Next.js 16 app with Tailwind CSS v4.
I need a login page with:
- Email + password fields
- Form validation (email format, password min 8 chars)
- Submit button with loading state
- Error message display
- Responsive (mobile-first)

Use server actions for form handling.
No external form libraries.
```

The more specific you are, the less back-and-forth you need.

### Phase 2: Refine

The first output is rarely perfect. Don't start over. Refine:

```
Good start. Three changes:
1. The error state should clear when the user starts typing again
2. Add a "show password" toggle
3. The loading spinner should be inside the button, not replacing it
```

### Phase 3: Verify

Before you accept AI-generated code:

- Read it. Do you understand every line?
- Test it. Does it handle edge cases?
- Check types. Are there any `any` types or unsafe casts?

> Never ship code you don't understand. AI is a tool, not a replacement for thinking.

## Worked Example 1: Building a REST API Endpoint

Let's walk through a real example using this workflow.

**The task:** Create a `POST /api/contacts` endpoint that validates input, saves to a database, and returns the new contact.

### Step 1: Context + Task (Build)

In Cursor, open the AI chat and provide:

```
Project context:
- Next.js 16 App Router
- Prisma ORM with PostgreSQL
- TypeScript strict mode

Task:
Create POST /api/contacts that:
- Accepts: { name: string, email: string, company?: string }
- Validates: name required (2-100 chars), email valid format, company optional (max 200 chars)
- Creates record in Prisma `Contact` model
- Returns 201 with the new contact
- Returns 400 with specific validation errors
- Returns 500 on DB errors (don't expose internals)
```

![full](./screenshots/03-first-prompt/cursor-prompt-example.png)

### Step 2: Review + Refine

The AI generates the endpoint. You review and notice:

- It used `try/catch` but the error handling is too generic
- Missing rate limiting consideration
- No input sanitization (trim whitespace)

So you refine:

```
Good. Three improvements:
1. Trim whitespace from name and email before validation
2. Add a comment noting where rate limiting should go (don't implement, just mark it)
3. Make the validation error response include field-specific errors like: { errors: { email: "Invalid format", name: "Required" } }
```

### Step 3: Verify

Read the final output. Check:
- Types are correct (no `any`)
- Validation logic matches your spec
- Error responses are consistent
- No secrets or config values are hardcoded

## Worked Example 2: Debugging with AI

You have a bug. Your React component re-renders infinitely.

**Wrong approach:**
```
My component re-renders infinitely. Fix it.
```

**Right approach:**
```
This React component re-renders infinitely. Here's the code:

[paste component]

The console shows the useEffect running repeatedly.
The dependency array includes `data` which is an object returned from a custom hook.

I suspect the object reference changes on every render, triggering the effect.
Confirm if that's the cause and show me the fix.
```

The difference: you gave context, your hypothesis, and asked for confirmation. This gets you a precise answer in one shot instead of a 5-message back-and-forth.

## Key Takeaways

1. **Be specific** - vague prompts get vague answers
2. **Provide context** - framework, language, constraints, existing code
3. **Refine, don't restart** - iterate on good output instead of starting fresh
4. **Verify everything** - read, understand, test before shipping
5. **Include your hypothesis** - when debugging, say what you think is wrong
