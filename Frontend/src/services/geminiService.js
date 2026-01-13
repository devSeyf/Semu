import productsData from "../data/products.json";

/**
 * AI Assistant Service (Ollama Version)
 * Aim: Analyze product origins and suggest Turkish alternatives using local AI.
 * Features: Connects to local Llama3 and falls back to JSON database.
 */
export const getAIResponse = async (userInput, imageFile = null) => {
  const normalizedInput = (userInput || "").toLowerCase();

  try {
    // 1. Call your Local Backend (which talks to Ollama)
    const response = await fetch('http://localhost:5000/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: userInput })
    });

    if (!response.ok) throw new Error("Local AI Backend not responding");

    const data = await response.json();
    return data.text;

  } catch (error) {
    // 2. FALLBACK: Local JSON Database matching if Ollama fails
    console.error("AI Service failed, searching local JSON database...", error);
    
    const matchedProduct = productsData.find(p => 
      p.foreign_brands.some(brand => normalizedInput.includes(brand.toLowerCase())) ||
      normalizedInput.includes(p.category.toLowerCase())
    );

    if (matchedProduct) {
      return formatLocalResponse(matchedProduct);
    }

    return "Urun veritabanimizda bulunamadi ancak yerli uretimi desteklemeye devam edin.";
  }
};

/**
 * Helper: Format local database response nicely
 * Used when AI is offline
 */
const formatLocalResponse = (product) => {
  return `[Yerel Veri] ${product.foreign_brands.join(", ")} markalari boykot listesindedir.\n\n` +
         `Yerli Alternatifler: ${product.turkish_alternatives.join(", ")}.\n\n` +
         `Oneri: ${product.advice}`;
};
