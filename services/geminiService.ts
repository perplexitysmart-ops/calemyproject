import { GoogleGenAI } from "@google/genai";
import { EngagementType } from "../types";

const getSystemInstruction = (type: EngagementType) => {
  switch (type) {
    case EngagementType.HIRE:
      return "Вы опытный рекрутер и HR-консультант. Создайте краткую повестку собеседования из 3 пунктов на основе описания вакансии/роли.";
    case EngagementType.COLLABORATE:
      return "Вы менеджер по стратегическому партнерству. Создайте краткую повестку первой встречи из 3 пунктов на основе описания проекта сотрудничества.";
    case EngagementType.OUTSOURCE:
      return "Вы технический менеджер продукта. Создайте краткую повестку сбора требований из 3 пунктов на основе предоставленного объема проекта.";
    default:
      return "Вы полезный ассистент. Создайте повестку встречи.";
  }
};

export const generateAgenda = async (
  description: string,
  type: EngagementType
): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("API Key is missing");
    return "• Знакомство и обзор роли\n• Обсуждение опыта\n• Следующие шаги";
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `На основе ввода пользователя: "${description}", создай короткий, профессиональный маркированный список (максимум 3 пункта) для повестки встречи на русском языке. Верни ТОЛЬКО пункты списка, без вступительного текста.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: getSystemInstruction(type),
        temperature: 0.7,
        maxOutputTokens: 150,
      },
    });

    return response.text || "• Обсуждение целей проекта\n• Оценка сроков\n• Бюджет и ресурсы";
  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback agenda if API fails
    return "• Знакомство\n• Обсуждение задач\n• Вопросы и ответы";
  }
};