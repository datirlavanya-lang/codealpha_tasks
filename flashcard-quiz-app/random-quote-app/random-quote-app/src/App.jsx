import React, { useState, useRef } from "react";

const QUOTES = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "Whether you think you can or you think you can't, you're right.", author: "Henry Ford" },
  { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { text: "Do not go where the path may lead; go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson" },
  { text: "What lies behind us and what lies before us are tiny matters compared to what lies within us.", author: "Ralph Waldo Emerson" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "You miss 100% of the shots you don't take.", author: "Wayne Gretzky" },
  { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
  { text: "The best way to predict the future is to create it.", author: "Abraham Lincoln" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
  { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
  { text: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "You are never too old to set another goal or to dream a new dream.", author: "C.S. Lewis" },
  { text: "Keep your face always toward the sunshine, and shadows will fall behind you.", author: "Walt Whitman" },
  { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
];

function randomIndex(exclude) {
  if (QUOTES.length === 1) return 0;
  let i = Math.floor(Math.random() * QUOTES.length);
  while (i === exclude) i = Math.floor(Math.random() * QUOTES.length);
  return i;
}

export default function RandomQuoteApp() {
  const [index, setIndex] = useState(() => randomIndex(-1));
  const [phase, setPhase] = useState("idle"); // idle | tearing | entering
  const [copied, setCopied] = useState(false);
  const timeouts = useRef([]);

  const quote = QUOTES[index];

  function clearTimers() {
    timeouts.current.forEach((t) => clearTimeout(t));
    timeouts.current = [];
  }

  function newQuote() {
    if (phase !== "idle") return;
    setPhase("tearing");
    const t1 = setTimeout(() => {
      setIndex((i) => randomIndex(i));
      setPhase("entering");
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setPhase("idle"));
      });
    }, 340);
    timeouts.current.push(t1);
  }

  function copyQuote() {
    const text = `"${quote.text}" — ${quote.author}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => showCopied())
        .catch(() => {});
    } else {
      showCopied();
    }
  }

  function showCopied() {
    setCopied(true);
    const t = setTimeout(() => setCopied(false), 1500);
    timeouts.current.push(t);
  }

  React.useEffect(() => clearTimers, []);

  return (
    <div className="rq-app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,600;1,500;1,600&family=Inter:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');

        .rq-app {
          --desk-a: #16292a;
          --desk-b: #1f3a3a;
          --paper: #fbf8f1;
          --paper-shadow: #ece5d3;
          --ink: #262420;
          --muted: #8b8577;
          --red: #b23a2e;
          --red-dark: #8f2e24;
          font-family: 'Inter', sans-serif;
          min-height: 680px;
          width: 100%;
          box-sizing: border-box;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.25rem;
          overflow: hidden;
          background-image:
            radial-gradient(circle at 22% 20%, rgba(255,255,255,0.05), transparent 45%),
            radial-gradient(circle at 80% 85%, rgba(0,0,0,0.18), transparent 50%),
            linear-gradient(160deg, var(--desk-b) 0%, var(--desk-a) 100%);
        }
        .rq-app *, .rq-app *:before, .rq-app *:after { box-sizing: border-box; }

        .rq-app::before, .rq-app::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          z-index: 0;
          pointer-events: none;
          opacity: 0.35;
        }
        .rq-app::before {
          width: 380px; height: 380px;
          background: radial-gradient(circle, rgba(178,58,46,0.5), transparent 70%);
          top: -100px; right: -80px;
        }
        .rq-app::after {
          width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(255,255,255,0.12), transparent 70%);
          bottom: -100px; left: -80px;
        }

        .rq-stack {
          position: relative;
          width: 100%;
          max-width: 360px;
          z-index: 1;
        }
        .rq-shadow-page {
          position: absolute;
          left: 10px;
          right: 10px;
          bottom: -10px;
          height: 100%;
          background: var(--paper-shadow);
          border-radius: 4px;
          transform: rotate(1.2deg);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .rq-shadow-page.two {
          left: 18px;
          right: 18px;
          bottom: -18px;
          transform: rotate(-1.5deg);
          opacity: 0.7;
        }

        .rq-page {
          position: relative;
          background: var(--paper);
          border-radius: 4px 4px 10px 10px;
          box-shadow: 0 24px 48px rgba(0,0,0,0.38);
          padding: 2.6rem 2rem 1.6rem;
          display: flex;
          flex-direction: column;
          min-height: 480px;
          transition: transform 0.34s cubic-bezier(.5,0,.4,1), opacity 0.34s ease;
          clip-path: polygon(
            0% 0%, 100% 0%, 100% 97%,
            96% 100%, 90% 97%, 84% 100%, 78% 97%, 72% 100%, 66% 97%,
            60% 100%, 54% 97%, 48% 100%, 42% 97%, 36% 100%, 30% 97%,
            24% 100%, 18% 97%, 12% 100%, 6% 97%, 0% 100%
          );
        }
        .rq-page.tearing {
          transform: translateY(-46px) rotate(-4deg);
          opacity: 0;
        }
        .rq-page.entering {
          transform: translateY(14px) scale(0.97);
          opacity: 0;
        }
        @media (prefers-reduced-motion: reduce) {
          .rq-page { transition: none; }
        }

        .rq-holes {
          position: absolute;
          top: 14px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 90px;
        }
        .rq-hole {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--desk-a);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.4);
        }

        .rq-mark {
          font-family: 'Fraunces', serif;
          font-weight: 600;
          font-size: 3.4rem;
          color: var(--red);
          opacity: 0.22;
          line-height: 1;
          margin-top: 0.6rem;
          margin-bottom: -1.2rem;
        }

        .rq-quote {
          font-family: 'Fraunces', serif;
          font-style: italic;
          font-weight: 500;
          font-size: 1.5rem;
          line-height: 1.42;
          color: var(--ink);
          text-align: center;
          margin: 0 auto;
          max-width: 27ch;
        }

        .rq-author {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--red-dark);
          text-align: center;
          margin-top: 1.1rem;
        }
        .rq-author::before { content: "— "; }

        .rq-spacer { flex: 1; }

        .rq-perforation {
          border-top: 2px dashed rgba(38,36,32,0.18);
          margin: 1.6rem 0 1.25rem;
        }

        .rq-controls {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.65rem;
        }

        .rq-copy-btn {
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          font-size: 0.82rem;
          background: transparent;
          color: var(--muted);
          border: 1.5px solid rgba(38,36,32,0.18);
          border-radius: 7px;
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
        }
        .rq-copy-btn:hover { border-color: var(--red); color: var(--red-dark); background: rgba(178,58,46,0.06); }

        .rq-new-btn {
          flex: 1;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          background: var(--red);
          color: var(--paper);
          border: none;
          border-radius: 7px;
          padding: 0.85rem 1.2rem;
          cursor: pointer;
          box-shadow: 0 8px 18px rgba(178,58,46,0.35);
          transition: background 0.15s, transform 0.1s;
        }
        .rq-new-btn:hover { background: var(--red-dark); }
        .rq-new-btn:active { transform: scale(0.98); }

        .rq-copy-btn:focus-visible, .rq-new-btn:focus-visible {
          outline: 2px solid var(--red);
          outline-offset: 2px;
        }

        .rq-toast {
          position: absolute;
          top: -0.6rem;
          left: 50%;
          transform: translate(-50%, -100%);
          background: var(--ink);
          color: var(--paper);
          font-family: 'Inter', sans-serif;
          font-size: 0.78rem;
          font-weight: 600;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          opacity: 0;
          transition: opacity 0.2s, transform 0.2s;
          pointer-events: none;
          white-space: nowrap;
        }
        .rq-toast.show {
          opacity: 1;
          transform: translate(-50%, -130%);
        }

        @media (max-width: 400px) {
          .rq-quote { font-size: 1.3rem; }
          .rq-page { padding: 2.2rem 1.5rem 1.4rem; min-height: 440px; }
        }
      `}</style>

      <div className="rq-stack">
        <div className="rq-shadow-page two" />
        <div className="rq-shadow-page" />
        <div className={`rq-page ${phase === "tearing" ? "tearing" : ""} ${phase === "entering" ? "entering" : ""}`}>
          <div className="rq-holes">
            <span className="rq-hole" />
            <span className="rq-hole" />
          </div>

          <div className="rq-mark" aria-hidden="true">“</div>
          <div aria-live="polite">
            <p className="rq-quote">{quote.text}</p>
            <p className="rq-author">{quote.author}</p>
          </div>

          <div className="rq-spacer" />

          <div className="rq-perforation" />

          <div className="rq-controls" style={{ position: "relative" }}>
            <span className={`rq-toast ${copied ? "show" : ""}`}>Copied to clipboard</span>
            <button className="rq-copy-btn" onClick={copyQuote} aria-label="Copy quote">
              Copy
            </button>
            <button className="rq-new-btn" onClick={newQuote}>
              New Quote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
