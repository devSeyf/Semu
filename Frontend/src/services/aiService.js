import productsData from "../data/products.json";

export const getAIResponse = async (userInput, imageFile = null) => {
  const normalizedInput = (userInput || "").toLowerCase();

  try {
    let base64Image = null;
    if (imageFile) {
      // Converting image to Base64 for Ollama
      base64Image = await convertFileToBase64(imageFile);
    }

    // Calling your Local Backend
    const response = await fetch('http://localhost:5000/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        prompt: userInput,
        image: base64Image 
      })
    });

    if (!response.ok) throw new Error("Backend connection failed");

    const data = await response.json();
    return data.text;

  } catch (error) {
    // FALLBACK: If AI fails, search in the 550 products list
    console.error("AI failed, checking local JSON...", error);
    
    const matchedProduct = productsData.find(p => 
      p.foreign_brands.some(brand => normalizedInput.includes(brand.toLowerCase())) ||
      (p.category && normalizedInput.includes(p.category.toLowerCase()))
    );

    if (matchedProduct) {
      return `[Yerel Veri] ${matchedProduct.foreign_brands.join(", ")} boykot listesindedir.\n\n` +
             `Alternatifler: ${matchedProduct.turkish_alternatives.join(", ")}.\n\n` +
             `Tavsiye: ${matchedProduct.advice}`;
    }

    return "Üzgünüz, yerel AI şu an çevrimdışı ve ürün veritabanında bulunamadı.";
  }
};

// Helper to convert image files
const convertFileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
