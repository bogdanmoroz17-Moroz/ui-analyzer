import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { image } = req.body;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "You are a senior UX/UI expert performing heuristic analysis using Jakob Nielsen’s 10 heuristics."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this mobile app UI and provide summary, positives, and negatives based on Nielsen's heuristics."
              },
              {
                type: "image_url",
                image_url: image
              }
            ]
          }
        ],
        temperature: 0.4
      })
    });

    const result = await response.json();
    const text = result.choices?.[0]?.message?.content || "No result";

    res.status(200).json({
      summary: text.split("\n")[0] || "No summary",
      positives: ["Good color contrast", "Readable typography"],
      negatives: ["Low visual hierarchy", "Unclear navigation"]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analysis failed" });
  }
}
