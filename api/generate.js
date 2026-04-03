import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  try {
    const { type, name, level, subjects, weakness, time, topic, questionDetail } = req.body;

    let prompt = "";

    if(type === "plan") {
      prompt = `
Create a highly personalized study plan for a student.
Name: ${name}
Level/Year: ${level}
Subjects: ${subjects}
Weakness: ${weakness}
Time Available: ${time}
Specific Topic: ${topic || "Any relevant topic"}
Make it structured, include step-by-step tasks, daily reminders, suggested free online resources, and mini-quiz questions to check understanding.
`;
    }

    if(type === "quiz") {
      prompt = `Create a short quiz for the topic: ${topic || "general"} with 5 questions and answers, suitable for a student at level ${level}.`;
    }

    if(type === "question") {
      prompt = `Explain this question or topic clearly and step-by-step: ${questionDetail}`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    res.status(200).json({ text: completion.choices[0].message.content });

  } catch (err) {
    console.error(err);
    res.status(500).json({ text: "Error generating response. Check your API key and deployment." });
  }
}
