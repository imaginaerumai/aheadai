# Prompt Templates

## Why Templates Matter

You don't write code from scratch every time - you have patterns, snippets, boilerplate. Prompts should be the same way. A good template eliminates 80% of the thinking and gets you to a usable response faster.

## Template 1: New Feature Implementation

```
Project: [framework, language, key libraries]
Existing code context: [paste relevant files or describe architecture]

I need to implement: [feature description]

Requirements:
- [requirement 1]
- [requirement 2]
- [requirement 3]

Constraints:
- [no external libraries / must use X / performance target]
- [coding style: strict types, no any, functional approach, etc.]

Output: [full file / just the function / diff from existing]
```

## Template 2: Code Review

```
Review this code for:
1. Bugs or logical errors
2. Performance issues
3. Security concerns
4. Readability improvements

Context: [what the code does, where it runs]

[paste code]

For each issue found, explain:
- What's wrong
- Why it matters
- The fix (show code)
```

## Template 3: Debugging

```
Bug: [describe the symptom]
Expected: [what should happen]
Actual: [what actually happens]

Environment: [framework, version, OS, browser]

Code: [paste relevant code]

My hypothesis: [what you think is causing it]

What I've tried:
- [attempt 1 and result]
- [attempt 2 and result]
```

## Template 4: Refactoring

```
I want to refactor this code.

Goals:
- [reduce complexity / improve testability / extract reusable parts]

Constraints:
- Don't change the external API/interface
- Keep all existing tests passing
- [any other constraints]

Current code:
[paste]

Show me the refactored version with a brief explanation of each change.
```

## Template 5: Learning a New API/Library

```
I need to use [library/API name] for [specific task].

My stack: [framework, language]

Show me:
1. Minimal working example of [specific use case]
2. Error handling for the most common failure modes
3. TypeScript types for the response/return values

Don't explain the basics of the library - just show me what I need for this specific task.
```

## Using Templates Effectively

These aren't rigid forms. They're starting points. The key principles:

- **Context first** - always tell the AI what you're working with
- **Specific outcomes** - say exactly what you want back
- **Constraints upfront** - prevent responses you'll just reject
- **One task per prompt** - don't combine "build this AND review that"

Copy these into a note app or your IDE snippets. Adapt them as you learn what works for your specific workflow.
