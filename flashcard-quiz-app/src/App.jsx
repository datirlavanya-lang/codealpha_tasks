import React, { useState, useEffect, useRef } from "react";

const DECKS = [
  {
    id: "webdev",
    name: "Web Dev Basics",
    cards: [
      {
        question: "What does DOM stand for?",
        answer: "Document Object Model — the tree structure the browser builds from your HTML.",
      },
      {
        question: "What's the difference between `let` and `const`?",
        answer: "`let` can be reassigned; `const` cannot be reassigned after its initial value.",
      },
      {
        question: "What does CSS `flexbox` help you do?",
        answer: "Arrange items in a row or column and distribute space between them easily.",
      },
      {
        question: "What is an API?",
        answer: "Application Programming Interface — a set way for two programs to talk to each other.",
      },
    ],
  },
  {
    id: "geography",
    name: "Geography",
    cards: [
      { question: "What is the longest river in the world?", answer: "The Nile River, at roughly 6,650 km." },
      { question: "Which is the smallest country in the world by area?", answer: "Vatican City." },
      { question: "What is the tallest mountain above sea level?", answer: "Mount Everest." },
      { question: "Which is the largest hot desert in the world?", answer: "The Sahara Desert." },
      { question: "How many continents are there?", answer: "Seven — Africa, Antarctica, Asia, Australia, Europe, North America, and South America." },
    ],
  },
  {
    id: "sports",
    name: "Sports",
    cards: [
      { question: "How many players does a soccer team have on the field at once?", answer: "11 players." },
      { question: "In which sport would you perform a slam dunk?", answer: "Basketball." },
      { question: "How often are the Summer Olympic Games held?", answer: "Every 4 years." },
      { question: "What's the maximum possible score in ten-pin bowling?", answer: "300 — a perfect game." },
      { question: "In tennis, what is a score of zero called?", answer: "Love." },
    ],
  },
  {
    id: "technology",
    name: "Technology",
    cards: [
      { question: "What does CPU stand for?", answer: "Central Processing Unit." },
      { question: "Who co-founded Apple alongside Steve Jobs?", answer: "Steve Wozniak." },
      { question: "What does HTTP stand for?", answer: "HyperText Transfer Protocol." },
      { question: "What year was the first iPhone released?", answer: "2007." },
      { question: "What does AI stand for?", answer: "Artificial Intelligence." },
    ],
  },
  {
    id: "religion",
    name: "Religion",
    cards: [
      { question: "What is the holy book of Islam called?", answer: "The Quran." },
      { question: "How many core practices make up the 'Five Pillars' of Islam?", answer: "Five." },
      { question: "What is the main scripture of Judaism called?", answer: "The Torah, part of the Tanakh." },
      { question: "In Buddhism, what is the state that ends suffering and rebirth called?", answer: "Nirvana." },
      { question: "What is the central religious text of Christianity called?", answer: "The Bible." },
    ],
  },
  {
    id: "entertainment",
    name: "Entertainment",
    cards: [
      { question: "Which streaming platform produced the series Stranger Things?", answer: "Netflix." },
      { question: "Who directed the first Jurassic Park film?", answer: "Steven Spielberg." },
      { question: "What is the top annual film industry award given by AMPAS called?", answer: "The Academy Award, or Oscar." },
      { question: "Which British band is often cited as the best-selling music act of all time?", answer: "The Beatles." },
      { question: "Which fictional school does Harry Potter attend?", answer: "Hogwarts School of Witchcraft and Wizardry." },
    ],
  },
  {
    id: "history",
    name: "History",
    cards: [
      { question: "In what year did World War II end?", answer: "1945." },
      { question: "Who was the first President of the United States?", answer: "George Washington." },
      { question: "Which ancient civilization built the pyramids of Giza?", answer: "The Ancient Egyptians." },
      { question: "Which Berlin structure fell in 1989, symbolizing the Cold War's end?", answer: "The Berlin Wall." },
      { question: "Which empire was ruled by Julius Caesar?", answer: "The Roman Empire." },
    ],
  },
];

function makeDeckState() {
  const state = {};
  DECKS.forEach((deck) => {
    state[deck.id] = deck.cards.map((c, i) => ({ id: `${deck.id}-c${i}`, ...c }));
  });
  return state;
}

export default function FlashcardApp() {
  const [deckId, setDeckId] = useState(DECKS[0].id);
  const [deckCards, setDeckCards] = useState(makeDeckState);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formQ, setFormQ] = useState("");
  const [formA, setFormA] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const qInputRef = useRef(null);

  const cards = deckCards[deckId];
  function setCards(updater) {
    setDeckCards((prev) => ({
      ...prev,
      [deckId]: typeof updater === "function" ? updater(prev[deckId]) : updater,
    }));
  }

  function selectDeck(id) {
    if (id === deckId) return;
    setDeckId(id);
    setIndex(0);
    setFlipped(false);
    setFormOpen(false);
    setEditingId(null);
    setFormError("");
  }

  const total = cards.length;
  const current = cards[index];

  // Keep index in range if cards are deleted
  useEffect(() => {
    if (index >= total && total > 0) setIndex(total - 1);
  }, [total, index]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e) {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (drawerOpen) return;
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, total, drawerOpen]);

  function goNext() {
    if (total === 0) return;
    setFlipped(false);
    setIndex((i) => (i + 1) % total);
  }
  function goPrev() {
    if (total === 0) return;
    setFlipped(false);
    setIndex((i) => (i - 1 + total) % total);
  }

  function openAddForm() {
    setEditingId(null);
    setFormQ("");
    setFormA("");
    setFormError("");
    setFormOpen(true);
    setDrawerOpen(true);
    setTimeout(() => qInputRef.current?.focus(), 50);
  }

  function openEditForm(card) {
    setEditingId(card.id);
    setFormQ(card.question);
    setFormA(card.answer);
    setFormError("");
    setFormOpen(true);
    setTimeout(() => qInputRef.current?.focus(), 50);
  }

  function cancelForm() {
    setFormOpen(false);
    setEditingId(null);
    setFormQ("");
    setFormA("");
    setFormError("");
  }

  function saveForm() {
    const q = formQ.trim();
    const a = formA.trim();
    if (!q) {
      setFormError("Add a question before saving — the answer can stay blank.");
      qInputRef.current?.focus();
      return;
    }
    setFormError("");

    if (editingId) {
      setCards((cs) => cs.map((c) => (c.id === editingId ? { ...c, question: q, answer: a } : c)));
    } else {
      const newCard = { id: "c" + Date.now(), question: q, answer: a };
      setCards((cs) => [...cs, newCard]);
      setIndex(cards.length); // jump to the new card
      setFlipped(false);
    }
    cancelForm();
  }

  function deleteCard(id) {
    setCards((cs) => cs.filter((c) => c.id !== id));
    if (editingId === id) cancelForm();
  }

  const currentDeckName = DECKS.find((d) => d.id === deckId)?.name || "";

  return (
    <div className="fc-app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@400;600;700&family=Courier+Prime:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');

        .fc-app {
          --ink: #1c2a22;
          --ink-soft: #24352a;
          --cream: #f3e9d2;
          --cream-back: #ece0c2;
          --brass: #a97d3f;
          --brass-dark: #7c5a2c;
          --stamp-red: #a3453f;
          --text-ink: #24261f;
          --muted: #7a725f;
          --line: #d8cba7;
          font-family: 'Inter', sans-serif;
          background-image:
            radial-gradient(rgba(243,233,210,0.05) 1px, transparent 1.6px),
            radial-gradient(circle at 18% 12%, rgba(255,255,255,0.06), transparent 42%),
            radial-gradient(circle at 84% 88%, rgba(255,255,255,0.05), transparent 46%),
            linear-gradient(155deg, #12211b 0%, #1c2a22 18%, #1f3a34 42%, #23302a 58%, #2c2216 76%, #3a2417 90%, #241a12 100%);
          background-size: 26px 26px, auto, auto, auto;
          color: var(--cream);
          min-height: 640px;
          width: 100%;
          padding: 2.5rem 1.25rem 3rem;
          box-sizing: border-box;
          position: relative;
          overflow: hidden;
        }
        .fc-app *, .fc-app *:before, .fc-app *:after { box-sizing: border-box; }
        .fc-app::before, .fc-app::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          filter: blur(75px);
          z-index: 0;
          pointer-events: none;
        }
        .fc-app::before {
          width: 440px;
          height: 440px;
          background: radial-gradient(circle, rgba(169,125,63,0.4), transparent 70%);
          top: -140px;
          left: -110px;
          animation: fc-drift-a 22s ease-in-out infinite;
        }
        .fc-app::after {
          width: 380px;
          height: 380px;
          background: radial-gradient(circle, rgba(163,69,63,0.26), transparent 70%);
          bottom: -150px;
          right: -90px;
          animation: fc-drift-b 26s ease-in-out infinite;
        }
        .fc-glow-teal {
          content: "";
          position: absolute;
          width: 360px;
          height: 360px;
          border-radius: 50%;
          filter: blur(80px);
          z-index: 0;
          pointer-events: none;
          background: radial-gradient(circle, rgba(74,138,143,0.32), transparent 72%);
          top: 38%;
          left: 58%;
          animation: fc-drift-c 30s ease-in-out infinite;
        }
        @keyframes fc-drift-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(45px, 30px) scale(1.08); }
        }
        @keyframes fc-drift-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-35px, -28px) scale(1.06); }
        }
        @keyframes fc-drift-c {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-50px, 40px) scale(1.12); }
        }
        @media (prefers-reduced-motion: reduce) {
          .fc-app::before, .fc-app::after, .fc-glow-teal { animation: none; }
        }
        .fc-header, .fc-main, .fc-overlay, .fc-drawer {
          position: relative;
          z-index: 1;
        }

        .fc-header {
          max-width: 640px;
          margin: 0 auto 2.25rem;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 1rem;
          border-bottom: 1px solid rgba(243,233,210,0.18);
          padding-bottom: 1rem;
        }
        .fc-tab {
          display: inline-block;
          font-family: 'Courier Prime', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink);
          background: var(--brass);
          padding: 0.2rem 0.6rem;
          border-radius: 3px;
          margin-bottom: 0.6rem;
        }
        .fc-title {
          font-family: 'Zilla Slab', serif;
          font-weight: 700;
          font-size: 1.9rem;
          margin: 0;
          letter-spacing: 0.01em;
        }
        .fc-subtitle {
          font-family: 'Courier Prime', monospace;
          font-size: 0.78rem;
          color: rgba(243,233,210,0.55);
          margin-top: 0.35rem;
        }
        .fc-manage-btn {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.85rem;
          background: transparent;
          color: var(--cream);
          border: 1px solid rgba(243,233,210,0.35);
          border-radius: 4px;
          padding: 0.55rem 1rem;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
          white-space: nowrap;
        }
        .fc-manage-btn:hover { background: rgba(243,233,210,0.08); border-color: rgba(243,233,210,0.6); }
        .fc-manage-btn:focus-visible, .fc-app button:focus-visible, .fc-app input:focus-visible, .fc-app textarea:focus-visible {
          outline: 2px solid var(--brass);
          outline-offset: 2px;
        }

        .fc-deck-tabs {
          max-width: 640px;
          margin: 0 auto 1.75rem;
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          position: relative;
          z-index: 1;
        }
        .fc-deck-tab {
          font-family: 'Courier Prime', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          background: rgba(243,233,210,0.05);
          color: rgba(243,233,210,0.65);
          border: 1px solid rgba(243,233,210,0.2);
          border-radius: 999px;
          padding: 0.4rem 0.85rem;
          cursor: pointer;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
        }
        .fc-deck-tab:hover { background: rgba(243,233,210,0.1); color: var(--cream); }
        .fc-deck-tab.active {
          background: var(--brass);
          border-color: var(--brass);
          color: var(--ink);
          font-weight: 700;
        }

        .fc-main {
          max-width: 640px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .fc-empty {
          text-align: center;
          padding: 3.5rem 1rem;
          color: rgba(243,233,210,0.7);
          font-family: 'Courier Prime', monospace;
        }
        .fc-empty-cta {
          margin-top: 1.25rem;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          background: var(--brass);
          color: var(--ink);
          border: none;
          border-radius: 5px;
          padding: 0.7rem 1.3rem;
          cursor: pointer;
        }

        .fc-stage {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          justify-content: center;
        }
        .fc-scene {
          perspective: 1800px;
          width: 100%;
          max-width: 460px;
          height: 300px;
          position: relative;
        }
        .fc-stack-shadow {
          position: absolute;
          inset: 10px -6px -10px 6px;
          background: var(--cream-back);
          border-radius: 10px;
          opacity: 0.35;
          transform: rotate(1.5deg);
        }
        .fc-stack-shadow.two {
          inset: 6px -3px -6px 3px;
          opacity: 0.5;
          transform: rotate(-1deg);
        }
        .fc-flip {
          position: relative;
          width: 100%;
          height: 100%;
          transition: transform 0.55s cubic-bezier(.4,.2,.2,1);
          transform-style: preserve-3d;
          cursor: pointer;
        }
        .fc-flip.is-flipped { transform: rotateY(180deg); }
        @media (prefers-reduced-motion: reduce) {
          .fc-flip { transition: none; }
        }

        .fc-face {
          position: absolute;
          inset: 0;
          backface-visibility: hidden;
          border-radius: 10px;
          padding: 2rem 1.9rem;
          display: flex;
          flex-direction: column;
          box-shadow: 0 18px 34px rgba(0,0,0,0.35);
        }
        .fc-face-front {
          background: var(--cream);
          color: var(--text-ink);
          background-image: repeating-linear-gradient(rgba(36,38,31,0.05) 0px, rgba(36,38,31,0.05) 1px, transparent 1px, transparent 34px);
        }
        .fc-face-back {
          background: var(--cream-back);
          color: var(--text-ink);
          transform: rotateY(180deg);
        }
        .fc-eyebrow {
          font-family: 'Courier Prime', monospace;
          font-size: 0.68rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--muted);
          margin-bottom: 0.8rem;
        }
        .fc-face-text {
          font-family: 'Zilla Slab', serif;
          font-size: 1.35rem;
          line-height: 1.4;
          font-weight: 600;
          flex: 1;
          overflow-y: auto;
        }
        .fc-face-back .fc-face-text {
          font-family: 'Courier Prime', monospace;
          font-weight: 400;
          font-size: 1.05rem;
        }
        .fc-hint {
          font-family: 'Courier Prime', monospace;
          font-size: 0.68rem;
          color: var(--muted);
          text-align: right;
          margin-top: 0.5rem;
        }

        .fc-controls {
          margin-top: 1.75rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          width: 100%;
        }
        .fc-controls-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          flex-wrap: wrap;
          width: 100%;
        }
        .fc-nav-btn {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 0.92rem;
          background: rgba(243,233,210,0.08);
          color: var(--cream);
          border: 1.5px solid rgba(243,233,210,0.45);
          border-radius: 7px;
          padding: 0.8rem 1.3rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          transition: background 0.15s, transform 0.1s, border-color 0.15s;
        }
        .fc-nav-btn:hover:not(:disabled) { background: rgba(243,233,210,0.16); border-color: var(--cream); }
        .fc-nav-btn:active:not(:disabled) { transform: scale(0.97); }
        .fc-nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }
        .fc-flip-btn {
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 0.98rem;
          background: var(--brass);
          color: var(--ink);
          border: none;
          border-radius: 7px;
          padding: 0.85rem 1.9rem;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(169,125,63,0.35);
          transition: transform 0.1s, background 0.15s;
        }
        .fc-flip-btn:hover { background: #bd8f52; }
        .fc-flip-btn:active { transform: scale(0.97); }

        .fc-stamp {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          font-family: 'Courier Prime', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.08em;
          color: var(--stamp-red);
          border: 1.5px solid var(--stamp-red);
          border-radius: 999px;
          padding: 0.3rem 0.8rem;
          transform: rotate(-2deg);
          opacity: 0.85;
        }

        /* Drawer */
        .fc-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.45);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.25s;
          z-index: 5;
        }
        .fc-overlay.open { opacity: 1; pointer-events: auto; }

        .fc-drawer {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(360px, 88%);
          background: var(--ink-soft);
          border-left: 1px solid rgba(243,233,210,0.15);
          transform: translateX(100%);
          transition: transform 0.3s ease;
          z-index: 6;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          overflow-y: auto;
        }
        .fc-drawer.open { transform: translateX(0); }
        @media (prefers-reduced-motion: reduce) {
          .fc-drawer, .fc-overlay { transition: none; }
        }

        .fc-drawer-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }
        .fc-drawer-title {
          font-family: 'Zilla Slab', serif;
          font-size: 1.15rem;
          font-weight: 700;
          margin: 0;
        }
        .fc-close {
          background: none;
          border: none;
          color: var(--cream);
          font-size: 1.3rem;
          cursor: pointer;
          line-height: 1;
          padding: 0.2rem 0.4rem;
        }

        .fc-list {
          list-style: none;
          margin: 0 0 1.25rem;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .fc-list-item {
          background: rgba(243,233,210,0.06);
          border: 1px solid rgba(243,233,210,0.12);
          border-radius: 6px;
          padding: 0.65rem 0.75rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.6rem;
        }
        .fc-list-q {
          font-family: 'Inter', sans-serif;
          font-size: 0.85rem;
          line-height: 1.35;
        }
        .fc-list-actions {
          display: flex;
          gap: 0.3rem;
          flex: 0 0 auto;
        }
        .fc-icon-btn {
          background: none;
          border: 1px solid rgba(243,233,210,0.25);
          color: var(--cream);
          border-radius: 4px;
          width: 26px;
          height: 26px;
          font-size: 0.75rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fc-icon-btn:hover { background: rgba(243,233,210,0.12); }
        .fc-icon-btn.danger:hover { border-color: var(--stamp-red); color: var(--stamp-red); }

        .fc-add-toggle {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.85rem;
          background: transparent;
          border: 1px dashed rgba(243,233,210,0.4);
          color: var(--cream);
          border-radius: 6px;
          padding: 0.6rem;
          cursor: pointer;
          margin-top: auto;
        }
        .fc-add-toggle:hover { background: rgba(243,233,210,0.06); }

        .fc-form {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          background: rgba(0,0,0,0.15);
          border-radius: 8px;
          padding: 1rem;
          margin-top: 0.75rem;
        }
        .fc-form label {
          font-family: 'Courier Prime', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(243,233,210,0.6);
        }
        .fc-form input, .fc-form textarea {
          font-family: 'Inter', sans-serif;
          font-size: 0.88rem;
          background: var(--cream);
          color: var(--text-ink);
          border: none;
          border-radius: 5px;
          padding: 0.55rem 0.65rem;
          resize: vertical;
        }
        .fc-form-error {
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          color: #ffb4ae;
          background: rgba(163,69,63,0.18);
          border: 1px solid rgba(163,69,63,0.5);
          border-radius: 5px;
          padding: 0.5rem 0.65rem;
        }
        .fc-form-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.3rem;
        }
        .fc-save-btn {
          flex: 1;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 0.85rem;
          background: var(--brass);
          color: var(--ink);
          border: none;
          border-radius: 5px;
          padding: 0.6rem;
          cursor: pointer;
        }
        .fc-cancel-btn {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.85rem;
          background: none;
          color: rgba(243,233,210,0.7);
          border: 1px solid rgba(243,233,210,0.25);
          border-radius: 5px;
          padding: 0.6rem 0.9rem;
          cursor: pointer;
        }

        @media (max-width: 480px) {
          .fc-title { font-size: 1.5rem; }
          .fc-scene { height: 270px; }
          .fc-face { padding: 1.4rem; }
        }
      `}</style>

      <div className="fc-glow-teal" />

      <div className="fc-header">
        <div>
          <span className="fc-tab">Study Catalog</span>
          <h1 className="fc-title">Flashcard Quiz</h1>
          <div className="fc-subtitle">
            {currentDeckName} — {total > 0 ? `Card ${index + 1} of ${total}` : "No cards filed yet"}
          </div>
        </div>
        <button className="fc-manage-btn" onClick={() => setDrawerOpen(true)}>
          Manage Deck
        </button>
      </div>

      <div className="fc-deck-tabs">
        {DECKS.map((d) => (
          <button
            key={d.id}
            className={`fc-deck-tab ${d.id === deckId ? "active" : ""}`}
            onClick={() => selectDeck(d.id)}
          >
            {d.name}
          </button>
        ))}
      </div>

      <div className="fc-main">
        {total === 0 ? (
          <div className="fc-empty">
            <p>Your catalog drawer is empty.</p>
            <button className="fc-empty-cta" onClick={openAddForm}>
              + Add your first card
            </button>
          </div>
        ) : (
          <>
            <div className="fc-stage">
              <div className="fc-scene">
                <div className="fc-stack-shadow two" />
                <div className="fc-stack-shadow" />
                <div
                  className={`fc-flip ${flipped ? "is-flipped" : ""}`}
                  onClick={() => setFlipped((f) => !f)}
                  role="button"
                  tabIndex={0}
                  aria-label="Flip card"
                >
                  <div className="fc-face fc-face-front">
                    <div className="fc-eyebrow">Question</div>
                    <div className="fc-face-text">{current.question}</div>
                    <div className="fc-hint">tap card to flip</div>
                  </div>
                  <div className="fc-face fc-face-back">
                    <div className="fc-eyebrow">Answer</div>
                    <div className="fc-face-text">
                      {current.answer || "No answer added yet — open Manage Deck to edit this card."}
                    </div>
                    <div className="fc-hint">tap to flip back</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="fc-controls">
              <div className="fc-controls-row">
                <button className="fc-nav-btn" onClick={goPrev} disabled={total < 2}>
                  ‹ Previous
                </button>
                <button className="fc-flip-btn" onClick={() => setFlipped((f) => !f)}>
                  {flipped ? "Show Question" : "Show Answer"}
                </button>
                <button className="fc-nav-btn" onClick={goNext} disabled={total < 2}>
                  Next ›
                </button>
              </div>
              <span className="fc-stamp">● reviewed {index + 1} / {total}</span>
            </div>
          </>
        )}
      </div>

      <div className={`fc-overlay ${drawerOpen ? "open" : ""}`} onClick={() => { setDrawerOpen(false); cancelForm(); }} />
      <div className={`fc-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="fc-drawer-head">
          <h2 className="fc-drawer-title">Manage: {currentDeckName}</h2>
          <button className="fc-close" onClick={() => { setDrawerOpen(false); cancelForm(); }} aria-label="Close">
            ×
          </button>
        </div>

        <ul className="fc-list">
          {cards.map((c) => (
            <li className="fc-list-item" key={c.id}>
              <span className="fc-list-q">{c.question}</span>
              <span className="fc-list-actions">
                <button className="fc-icon-btn" onClick={() => openEditForm(c)} aria-label="Edit card">✎</button>
                <button className="fc-icon-btn danger" onClick={() => deleteCard(c.id)} aria-label="Delete card">✕</button>
              </span>
            </li>
          ))}
          {cards.length === 0 && (
            <li style={{ fontFamily: "'Courier Prime', monospace", fontSize: "0.8rem", color: "rgba(243,233,210,0.5)" }}>
              No cards yet.
            </li>
          )}
        </ul>

        {!formOpen && (
          <button className="fc-add-toggle" onClick={openAddForm}>
            + Add new card
          </button>
        )}
        {formOpen && editingId && (
          <button className="fc-add-toggle" onClick={openAddForm}>
            + Add a different new card
          </button>
        )}

        {formOpen && (
          <div className="fc-form">
            <label htmlFor="fc-q">Question</label>
            <textarea
              id="fc-q"
              ref={qInputRef}
              rows={2}
              value={formQ}
              onChange={(e) => setFormQ(e.target.value)}
            />
            <label htmlFor="fc-a">Answer (optional — add it now or later)</label>
            <textarea
              id="fc-a"
              rows={3}
              value={formA}
              onChange={(e) => setFormA(e.target.value)}
              placeholder="You can leave this blank and fill it in later"
            />
            {formError && <div className="fc-form-error">{formError}</div>}
            <div className="fc-form-actions">
              <button type="button" className="fc-save-btn" onClick={saveForm}>
                {editingId ? "Save Changes" : "Add Card"}
              </button>
              <button type="button" className="fc-cancel-btn" onClick={cancelForm}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
