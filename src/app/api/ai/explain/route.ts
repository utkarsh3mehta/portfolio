import { NextRequest } from "next/server";

export const runtime = "edge";

const SYSTEM_EXPLAIN = `You are a technical advisor explaining complex software engineering systems with precision and depth.
You adapt your explanations based on the depth level:
- beginner: Use analogies, avoid jargon, explain WHY before HOW
- intermediate: Discuss implementation patterns, tradeoffs, architectural decisions
- staff: Cover production realities, failure modes, organizational impact, scaling decisions, monitoring strategies

Be direct. Don't add unnecessary preamble. Focus on architectural insight, not feature lists.`;

const SYSTEM_INTERVIEW = `You are a Principal Engineer at a top-tier technology company conducting a technical interview.
Your approach:
- Ask one specific, probing question at a time
- Follow up on answers to dig deeper — push candidates on their reasoning
- Challenge assumptions — "Why not just use X?"
- Focus on distributed systems, system design, architectural tradeoffs, production operations
- Evaluate how candidates handle ambiguity and constraints
- Don't accept vague answers — ask for specifics
- Be direct and professional. No softballs.
Start with a single focused question. After each response, ask one follow-up question that challenges or deepens the answer.`;

export async function POST(req: NextRequest) {
  const { messages, mode, depth, context } = await req.json();

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      "Set ANTHROPIC_API_KEY in .env.local to enable the AI Lab.",
      { status: 200 }
    );
  }

  const systemPrompt = mode === "explain"
    ? `${SYSTEM_EXPLAIN}\n\nDepth level: ${depth}${context ? `\n\nSystem context:\nProject: ${context.title}\nProblem: ${context.problem}\nDecision: ${context.decision}` : ""}`
    : SYSTEM_INTERVIEW;

  /* Build Anthropic messages format */
  const anthropicMessages = messages
    .filter((m: { role: string; content: string }) => m.content.trim())
    .map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages: anthropicMessages,
      stream: true,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    return new Response(`API error: ${err}`, { status: 500 });
  }

  /* Stream SSE response back as plain text chunks */
  const encoder = new TextEncoder();
  const stream = new TransformStream({
    async transform(chunk, controller) {
      const text = new TextDecoder().decode(chunk);
      const lines = text.split("\n");
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const data = line.slice(6);
          if (data === "[DONE]") return;
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === "content_block_delta" && parsed.delta?.type === "text_delta") {
              controller.enqueue(encoder.encode(parsed.delta.text));
            }
          } catch {
            /* Skip malformed chunks */
          }
        }
      }
    },
  });

  response.body!.pipeTo(stream.writable);

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
