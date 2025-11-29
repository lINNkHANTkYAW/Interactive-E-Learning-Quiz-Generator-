import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuestionType } from "../types";

const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });

// We strictly define the output schema to ensure reliable JSON parsing
const questionSchema = {
  type: Type.OBJECT,
  properties: {
    text: { type: Type.STRING, description: "The question text" },
    type: { type: Type.STRING, description: "MCQ, TRUE_FALSE, or SHORT_ANSWER" },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Array of 4 options for MCQ. Empty for others."
    },
    correctAnswer: { type: Type.STRING, description: "The correct answer text" },
    explanation: { type: Type.STRING, description: "Explanation for why the answer is correct" },
    points: { type: Type.INTEGER, description: "Point value, typically 10-20" }
  },
  required: ["text", "type", "correctAnswer", "explanation", "points"]
};

const quizSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    description: { type: Type.STRING },
    questions: {
      type: Type.ARRAY,
      items: questionSchema
    }
  },
  required: ["title", "description", "questions"]
};

export const generateQuizAI = async (
  topic: string,
  difficulty: string,
  count: number
): Promise<{ title: string; description: string; questions: Partial<Question>[] }> => {
  
  const model = "gemini-2.5-flash";
  const systemInstruction = `You are an expert educational content creator. Create a fun, engaging quiz for students.
  Difficulty: ${difficulty}.
  Topic: ${topic}.
  Generate ${count} questions.
  Mix Multiple Choice (MCQ) and True/False questions.
  For MCQ, provide exactly 4 options.
  Ensure the tone is encouraging and educational.`;

  try {
    const response = await genAI.models.generateContent({
      model,
      contents: `Generate a quiz about ${topic}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        temperature: 0.7
      }
    });

    if (!response.text) {
      throw new Error("No response from AI");
    }

    const data = JSON.parse(response.text);
    return data;
  } catch (error) {
    console.error("Quiz generation failed:", error);
    throw error;
  }
};