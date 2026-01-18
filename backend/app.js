const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.post('/api/ask', async (req, res) => {
  try {
    const { prompt, image } = req.body;

    const requestData = {
      model: "llava",
      // التعليمات البرمجية الصادرة للذكاء الاصطناعي
      prompt: `Sen profesyonel bir boykot rehberisin. Bu ürünü analiz et. Sadece şu formatta cevap ver:
      1. Menşei: [Ülke]
      2. Durum: [Boykot mu?]
      3. Yerli Alternatifler: [3 Marka]
      
      Gereksiz cümle kurma. Ürün: ${prompt}`,
      stream: false, // لضمان وصول الإجابة كاملة وبسرعة
      options: {
        num_predict: 80,
        temperature: 0.0,
        num_thread: 4
      }
    };

    if (image) requestData.images = [image];

    const response = await axios.post('http://localhost:11434/api/generate', requestData);
    res.json({ text: response.data.response });

  } catch (error) {
    console.error("AI Error:", error.message);
    res.status(500).json({ error: "Sistem meşgul." });
  }
});

app.listen(5000, () => console.log('Backend running on port 5000'));
