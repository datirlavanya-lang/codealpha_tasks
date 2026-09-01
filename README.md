# Frontend Mini Projects

A small collection of frontend projects built with React, focused on clean UI/UX,
custom design (no default templates), and practical component patterns like state
management, forms, and animation.

## Projects

### 1. Flashcard Quiz App
`/flashcard-quiz-app`

A study flashcard app with 7 topic decks (Web Dev, Geography, Sports, Technology,
Religion, Entertainment, History). Flip cards to reveal answers, navigate with
Previous/Next, and add, edit, or delete cards per deck.

**Features**
- Flip animation between question and answer
- Previous / Next navigation with progress tracking
- Add, edit, and delete cards without affecting other cards or decks
- 7 switchable topic decks, each with independent card sets
- Fully keyboard accessible, responsive layout

**Tech:** React, custom CSS (no UI library)

### 2. Random Quote Generator
`/random-quote-app`

A minimal quote app styled as a tear-off desk calendar page. Shows a random quote
on load, with a "New Quote" button that reveals a different quote each time.

**Features**
- Random quote on load and on each button click (never repeats the same quote twice in a row)
- "New Quote" button with a tearing-page animation
- Copy-to-clipboard button for the current quote
- Clean, minimal, mobile-first UI

**Tech:** React, custom CSS (no UI library)

## Running locally

Each project is independent. Pick a folder and run:

```bash
cd flashcard-quiz-app   # or random-quote-app
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

## Deployment

Both are standard Vite + React projects and deploy as-is to Vercel, Netlify, or
GitHub Pages.

## Author

Built by Lavanya Datir as part of learning frontend development with React.
