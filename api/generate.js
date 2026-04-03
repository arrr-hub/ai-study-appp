import OpenAI from "openai";

export default async function handler(req, res) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const { type, q, level, subjects, weakness, time } = req.body;

  let prompt = "";

  if(type==="plan"){
    prompt = `Create a study plan for a ${level} student.
Subjects: ${subjects}
Weakness: ${weakness}
Time: ${time}
Make it structured and motivating.`;
  }

  if(type==="quiz"){
    prompt = "Create a short quiz with answers.";
  }

  if(type==="question"){
    prompt = `Explain this simply: ${q}`;
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }]
  });

  res.json({ text: completion.choices[0].message.content });
}
