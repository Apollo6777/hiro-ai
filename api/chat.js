
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "A HIRO ainda não foi conectada à inteligência artificial."
    });
  }

  const message =
    typeof req.body?.message === "string"
      ? req.body.message.trim()
      : "";

  const previousInteractionId =
    typeof req.body?.previousInteractionId === "string"
      ? req.body.previousInteractionId
      : null;

  if (!message) {
    return res.status(400).json({ error: "Digite uma pergunta." });
  }

  const payload = {
    model: "gemini-3.8-flash",
    input: message,
    system_instruction:
      "Seu nome é HIRO. Você é uma inteligência artificial útil, inteligente, educada e direta. Responda em português brasileiro. Explique assuntos com clareza e exemplos simples. Não invente informações. Seja respeitosa e segura.",
    generation_config: {
      max_output_tokens: 700
    }
  };

  if (previousInteractionId) {
    payload.previous_interaction_id = previousInteractionId;
  }

  try {
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
      return res.status(502).json({
        error: "Falha na conexão com a inteligência artificial."
      });
    }

    if (!data.output_text) {
      return res.status(502).json({
        error: "A IA não retornou uma resposta."
      });
    }

    return res.status(200).json({
      answer: data.output_text,
      interactionId: data.id || null
    });

  } catch (error) {
    return res.status(500).json({
      error: "Não foi possível conectar à HIRO."
    });
  }
}
