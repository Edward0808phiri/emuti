const API_KEY = "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";

export const sendMessageToGPT = async (message) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",  // your app URL (important for OpenRouter)
        "X-Title": "EMUTI Health Chatbot",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // You can also try 'mistralai/mistral-7b-instruct'
        messages: [
          { role: "system", content: "You are EMUTI, a helpful and friendly AI health assistant that answers responsibly." },
          { role: "user", content: message },
        ],
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HTTP error:", errorText);
      return "⚠️ Something went wrong with the API request.";
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content;

    return reply ? reply.trim() : "⚠️ No response received from EMUTI.";
  } catch (error) {
    console.error("Fetch error:", error);
    return "⚠️ Network error. Please check your connection.";
  }
};
