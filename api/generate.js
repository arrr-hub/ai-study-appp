import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  try {
    const { type, name, level, subjects, weakness, time, topic, questionDetail } = req.body;
    let prompt = "";

    if(type==="plan"){
      prompt = `
Create a highly personalized study plan for a student.
Name: ${name}
Level/Year: ${level}
Subjects: ${subjects}
Weakness: ${weakness}
Time Available: ${time}
Topic: ${topic || "Any topic"}
Include:
- Step-by-step tasks
- Daily reminders
- Mini quizzes
- Suggested free online resources
- Motivational tips
Make it actionable and engaging.
`;
    }

    if(type==="quiz"){
      prompt = `Generate a 5-question quiz with answers for the topic: ${topic || "general"} at student level ${level || "general"}.`;
    }

    if(type==="question"){
      prompt = `Explain this clearly step by step: ${questionDetail}`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages:[{ role:"user", content: prompt }]
    });

    res.status(200).json({ text: completion.choices[0].message.content });
  } catch(err){
    console.error(err);
    res.status(500).json({ text: "Error generating response. Make sure OPENAI_API_KEY is set and redeploy the app." });
  }
}
