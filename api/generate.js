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
        { role: "system", content: "You are a helpful study assistant. Generate personalized study plans, mini quizzes, and suggest free online resources." },
        { role: "user", content: `Student level: ${level}, Topics: ${topics}, Questions: ${questions}` }
      ],
      max_tokens: 1000
    });

    const plan = completion.choices[0].message.content;
    res.status(200).json({ plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error generating study plan' });
  }
}
