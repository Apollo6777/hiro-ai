
export default async (req) => {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store"
  };

  const json = (data, status = 200) =>
    new Response(JSON.stringify(data), { status, headers });

  if (req.method !== "POST") {
    return json({ error: "Método não permitido." }, 405);
  }

  try {
    const apiKey = Netlify.env.get("GEMINI_API_KEY");

    if (!apiKey) {
      return json({ error: "A chave da IA não foi configurada no Netlify." }, 500);
    }

    const body = await req.json();
    const message = typeof body.message === "string"
      ? body.message.trim()
      : "";

    if (!message) {
      return json({ error: "Digite uma pergunta." }, 400);
    }

    const payload = {
      model: "gemini-3.8-flash",
      input: message,
      system_instruction:
        "Seu nome é HIRO. Você é uma inteligência artificial útil, educada e direta. Responda em português brasileiro. Explique com clareza e não invente informações.",
      generation_config: {
        max_output_tokens: 700
      }
    };

    if (typeof body.previousInteractionId === "string") {
      payload.previous_interaction_id = body.previousInteractionId;
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/interactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify(payload)
      }
    );

    const data = await response.json();

    if (!response.ok) {
  return json({
    error: "Erro do Gemini",
    details: data.error?.message || JSON.stringify(data)
  }, 502);
}

    if (!data.output_text) {
      return json({ error: "A IA não retornou uma resposta." }, 502);
    }

    return json({
      answer: data.output_text,
      interactionId: data.id || null
    });

  } catch (error) {
    return json({ error: "Não foi possível conectar à HIRO." }, 500);
  }
};

export const config = {
  path: "/api/chat"
};
