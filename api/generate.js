import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { level, topics, questions } = req.body;
  if (!level || !topics) return res.status(400).json({ error: "Missing level or topics" });

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an elite study assistant. Generate highly engaging, addictive study plans, mini quizzes, mock tests, suggested free online resources, and adaptive guidance for each student." },
        { role: "user", content: `Student level: ${level}, Topics: ${topics}, Questions: ${questions}` }
      ],
      max_tokens: 2000
    });

    const plan = completion.choices[0].message.content;
    res.status(200).json({ plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generating study plan' });
  }
}
