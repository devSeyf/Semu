import { GoogleGenerativeAI } from "@google/generative-ai";
import productsData from "../data/products.json";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const getAIResponse = async (userInput, imageFile = null) => {
  // 1. Search locally first (Fast & Free)
  const normalizedInput = userInput.toLowerCase();
  const matchedProduct = productsData.find(p => 
    normalizedInput.includes(p.category.toLowerCase()) || 
    p.foreign_brands.some(brand => normalizedInput.includes(brand.toLowerCase()))
  );

  // 2. Prepare a context-specific prompt
  const contextPrompt = matchedProduct 
    ? `Urun bilgisi: ${JSON.stringify(matchedProduct)}. Bu urunu ve yerli alternatiflerini acikla.`
    : `Kullanici sorusu: ${userInput}. Yerli urunler hakkinda bilgi ver.`;

  // 3. Simple Model Name (Fix for 404)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  try {
    const promptParts = [contextPrompt];

    if (imageFile) {
      const base64Data = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.readAsDataURL(imageFile);
      });
      promptParts.push({ inlineData: { data: base64Data, mimeType: imageFile.type } });
    }

    const result = await model.generateContent(promptParts);
    return result.response.text();
  } catch (error) {
    console.error("AI Error:", error);
    return "Sistem su an mesgul. Lutfen tekrar deneyiniz.";
  }
};
