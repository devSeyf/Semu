const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // To handle image data

app.post('/api/ask', async (req, res) => {
  try {
    const { prompt, image } = req.body;

// Add these options to speed up and stabilize local AI
const requestData = {
  model: "llava",
  prompt: prompt,
  stream: true,
  options: {
    num_predict: 100, // Strict short response
    temperature: 0.0, // No creative "hallucinations"
    num_thread: 4     // Use more CPU cores for speed
  }
};

    if (image) {
      requestData.images = [image];
    }

    const response = await axios.post('http://localhost:11434/api/generate', requestData);
    res.json({ text: response.data.response });

  } catch (error) {
    console.error("AI Error:", error.message);
    res.status(500).json({ error: "Sistem su an mesgul." });
  }
}); 

app.listen(5000, () => console.log('Backend server running on port 5000'));
