const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

// API endpoint for AI chat
app.post('/api/ask', async (req, res) => {
  try {
    const { prompt } = req.body;

    // Connect to local Ollama (Llama3)
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: "llama3",
      prompt: prompt,
      stream: false,
      // Instruction for the AI to speak Turkish only
      system: "Sen bir boykot danışmanısın. Sadece Türkçe cevap ver. Ürünlerin boykot durumunu açıkla ve yerli Türk markalarını öner."
    });

    // Send AI response to Frontend
    res.json({ text: response.data.response });
  } catch (error) {
    // Log error for debugging
    console.error("Ollama connection error:", error.message);
    res.status(500).json({ error: "Yerel yapay zeka bağlantısı kurulamadı." });
  }
});

 
const PORT = 5000;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
