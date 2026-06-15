"use client";

import { useEffect, useRef, useState } from "react";
import { CASE_STUDIES } from "@/data/case-studies";

type Depth = "beginner" | "intermediate" | "staff";
type Mode = "explain" | "interview";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const DEPTH_LABELS: Record<Depth, string> = {
  beginner:     "Beginner",
  intermediate: "Mid-level engineer",
  staff:        "Staff engineer",
};

const DEPTH_DESCRIPTIONS: Record<Depth, string> = {
  beginner:     "Concepts, analogies, first-principles explanations.",
  intermediate: "Implementation details, tradeoffs, architectural patterns.",
  staff:        "Production realities, failure modes, scaling decisions, organizational impact.",
};

export default function AILabPage() {
  const ref = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("explain");
  const [selectedSlug, setSelectedSlug] = useState(CASE_STUDIES[0].slug);
  const [depth, setDepth] = useState<Depth>("intermediate");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    import("gsap").then(async ({ gsap }) => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      const el = ref.current;
      if (!el) return;
      el.querySelectorAll<HTMLElement>(".lab-reveal").forEach((item) => {
        gsap.fromTo(item, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", scrollTrigger: { trigger: item, start: "top 88%", once: true } });
      });
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectedCs = CASE_STUDIES.find(cs => cs.slug === selectedSlug)!;

  const startExplain = async () => {
    setStarted(true);
    setMessages([]);
    setLoading(true);
    const prompt = `Explain the architecture and key engineering decisions of the "${selectedCs.title}" system at the ${DEPTH_LABELS[depth]} level. Context: ${selectedCs.problem} Decision made: ${selectedCs.decision}`;
    await sendMessage(prompt, []);
  };

  const startInterview = async () => {
    setStarted(true);
    setMessages([]);
    setLoading(true);
    const prompt = `You are a Principal Engineer conducting a technical interview. Start by asking ONE focused question about system design, distributed systems, or engineering tradeoffs. Begin immediately with the question — no preamble. Make it specific and thought-provoking.`;
    await sendMessage(prompt, []);
  };

  const sendMessage = async (userMessage: string, history: Message[]) => {
    const newMessages: Message[] = [...history, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setLoading(true);
    setInput("");

    try {
      const res = await fetch("/api/ai/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages,
          mode,
          depth,
          context: mode === "explain" ? { title: selectedCs.title, problem: selectedCs.problem, decision: selectedCs.decision, architecture: selectedCs.architecture } : null,
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      let assistantMessage = "";
      const decoder = new TextDecoder();
      const assistantEntry: Message = { role: "assistant", content: "" };
      setMessages(prev => [...prev, assistantEntry]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        assistantMessage += chunk;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: assistantMessage };
          return updated;
        });
      }
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Configure your Anthropic API key in `.env.local` as `ANTHROPIC_API_KEY` to activate the AI Lab." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    sendMessage(input.trim(), messages);
  };

  const reset = () => {
    setStarted(false);
    setMessages([]);
    setInput("");
  };

  return (
    <div ref={ref} style={{ paddingTop: "clamp(5rem, 10vw, 8rem)" }}>
      {/* Hero */}
      <section style={{ padding: "clamp(3rem, 8vw, 7rem) clamp(1.25rem, 4vw, 5rem)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <p className="lab-reveal" style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "clamp(1.5rem, 3vw, 2.5rem)", opacity: 0 }}>
            AI Lab
          </p>
          <h1 className="lab-reveal" style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2.5rem, 6vw, 6rem)", fontWeight: 400, lineHeight: 1.0, letterSpacing: "-0.02em", color: "var(--fg)", maxWidth: "22ch", marginBottom: "1.5rem", opacity: 0 }}>
            Ask about any system. At any depth.
          </h1>
          <p className="lab-reveal" style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-base)", color: "var(--fg-muted)", maxWidth: "52ch", lineHeight: 1.7, opacity: 0 }}>
            Two modes: an explainer that adapts to your level, and an interview simulator that acts as a Principal Engineer and asks adaptive follow-up questions.
          </p>
        </div>
      </section>

      {/* Interface */}
      <section style={{ padding: "clamp(3rem, 6vw, 5rem) clamp(1.25rem, 4vw, 5rem)" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: "clamp(2rem, 4vw, 4rem)", alignItems: "start" }}>

            {/* Config panel */}
            <div className="lab-reveal" style={{ opacity: 0 }}>
              {/* Mode selector */}
              <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1rem" }}>
                Mode
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "2rem" }}>
                {(["explain", "interview"] as Mode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); reset(); }}
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "var(--text-sm)",
                      fontWeight: mode === m ? 500 : 400,
                      color: mode === m ? "var(--bg)" : "var(--fg)",
                      background: mode === m ? "var(--fg)" : "transparent",
                      border: "1px solid var(--border-strong)",
                      padding: "0.75rem 1rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      borderRadius: "2px",
                      textAlign: "left",
                    }}
                  >
                    {m === "explain" ? "📖 Explainer" : "🎤 Interview"}
                  </button>
                ))}
              </div>

              {/* Project selector (explain only) */}
              {mode === "explain" && (
                <>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1rem" }}>
                    Project
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "2rem" }}>
                    {CASE_STUDIES.map(cs => (
                      <button
                        key={cs.slug}
                        onClick={() => { setSelectedSlug(cs.slug); reset(); }}
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "var(--text-sm)",
                          fontWeight: selectedSlug === cs.slug ? 500 : 400,
                          color: selectedSlug === cs.slug ? "var(--accent)" : "var(--fg-muted)",
                          background: selectedSlug === cs.slug ? "var(--accent-surface)" : "transparent",
                          border: "1px solid " + (selectedSlug === cs.slug ? "var(--accent)" : "var(--border)"),
                          padding: "0.6rem 1rem",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          borderRadius: "2px",
                          textAlign: "left",
                        }}
                      >
                        {cs.title}
                      </button>
                    ))}
                  </div>

                  {/* Depth */}
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1rem" }}>
                    Depth
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "2rem" }}>
                    {(Object.entries(DEPTH_LABELS) as [Depth, string][]).map(([d, label]) => (
                      <button
                        key={d}
                        onClick={() => setDepth(d)}
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "var(--text-sm)",
                          fontWeight: depth === d ? 500 : 400,
                          color: depth === d ? "var(--fg)" : "var(--fg-muted)",
                          background: "transparent",
                          border: "1px solid " + (depth === d ? "var(--border-strong)" : "var(--border)"),
                          padding: "0.6rem 1rem",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          borderRadius: "2px",
                          textAlign: "left",
                        }}
                      >
                        <div style={{ fontWeight: 500, marginBottom: "0.15rem" }}>{label}</div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--fg-dim)", fontWeight: 400 }}>{DEPTH_DESCRIPTIONS[d]}</div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* Start button */}
              {!started && (
                <button
                  onClick={mode === "explain" ? startExplain : startInterview}
                  style={{
                    width: "100%",
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--text-sm)",
                    fontWeight: 500,
                    color: "var(--bg)",
                    background: "var(--fg)",
                    border: "none",
                    padding: "0.875rem 1.5rem",
                    cursor: "pointer",
                    borderRadius: "2px",
                    transition: "opacity 0.2s ease",
                  }}
                >
                  {mode === "explain" ? `Explain ${selectedCs.title}` : "Begin interview"}
                </button>
              )}
              {started && (
                <button
                  onClick={reset}
                  style={{
                    width: "100%",
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--text-sm)",
                    color: "var(--fg-muted)",
                    background: "transparent",
                    border: "1px solid var(--border)",
                    padding: "0.875rem 1.5rem",
                    cursor: "pointer",
                    borderRadius: "2px",
                  }}
                >
                  Reset
                </button>
              )}
            </div>

            {/* Chat panel */}
            <div className="lab-reveal" style={{ opacity: 0 }}>
              {!started && !messages.length && (
                <div
                  style={{
                    height: 480,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid var(--border)",
                    borderRadius: "2px",
                    color: "var(--fg-dim)",
                    gap: "1rem",
                  }}
                >
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 3vw, 2rem)", color: "var(--fg-muted)", textAlign: "center" }}>
                    {mode === "explain" ? "Select a project and depth." : "The interviewer is ready."}
                  </div>
                  <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", textAlign: "center", maxWidth: "30ch" }}>
                    {mode === "explain" ? "Choose the level of detail that matches where you are." : "Adaptive follow-up questions. No softballs."}
                  </p>
                </div>
              )}

              {(started || messages.length > 0) && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    height: 520,
                    border: "1px solid var(--border)",
                    borderRadius: "2px",
                    overflow: "hidden",
                  }}
                >
                  {/* Messages */}
                  <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {messages.filter(m => m.role !== "user" || messages.indexOf(m) > 0).map((msg, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                          animation: "fadeIn 0.3s ease",
                        }}
                      >
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", marginBottom: "0.35rem" }}>
                          {msg.role === "user" ? "You" : "AI"}
                        </span>
                        <div
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "var(--text-sm)",
                            lineHeight: 1.7,
                            color: msg.role === "user" ? "var(--bg)" : "var(--fg)",
                            background: msg.role === "user" ? "var(--fg)" : "var(--bg-subtle)",
                            padding: "0.75rem 1rem",
                            borderRadius: "2px",
                            maxWidth: "85%",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {msg.content}
                          {loading && i === messages.length - 1 && msg.role === "assistant" && (
                            <span style={{ display: "inline-block", width: 8, height: 14, background: "var(--accent)", animation: "blink 1s step-end infinite", marginLeft: 2 }} />
                          )}
                        </div>
                      </div>
                    ))}
                    {loading && messages[messages.length - 1]?.role !== "assistant" && (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", color: "var(--fg-dim)", marginBottom: "0.35rem" }}>AI</span>
                        <div style={{ background: "var(--bg-subtle)", padding: "0.75rem 1rem", borderRadius: "2px" }}>
                          <span style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
                            {[0, 1, 2].map(i => (
                              <span key={i} style={{ display: "block", width: 5, height: 5, borderRadius: "50%", background: "var(--fg-muted)", animation: `blink 1.2s ${i * 0.2}s step-end infinite` }} />
                            ))}
                          </span>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  {mode === "interview" && (
                    <form onSubmit={handleSubmit} style={{ borderTop: "1px solid var(--border)", padding: "0.75rem 1rem", display: "flex", gap: "0.75rem" }}>
                      <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Your answer..."
                        disabled={loading}
                        style={{
                          flex: 1,
                          fontFamily: "var(--font-sans)",
                          fontSize: "var(--text-sm)",
                          color: "var(--fg)",
                          background: "transparent",
                          border: "1px solid var(--border)",
                          padding: "0.6rem 0.875rem",
                          borderRadius: "2px",
                          outline: "none",
                        }}
                      />
                      <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontSize: "var(--text-sm)",
                          fontWeight: 500,
                          color: "var(--bg)",
                          background: "var(--fg)",
                          border: "none",
                          padding: "0.6rem 1.25rem",
                          borderRadius: "2px",
                          cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                          opacity: loading || !input.trim() ? 0.5 : 1,
                          transition: "opacity 0.2s",
                        }}
                      >
                        Send
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
      `}</style>
    </div>
  );
}
