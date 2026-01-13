import React, { useState } from 'react';
import { getAIResponse } from '../../services/geminiService';

const Scanner = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Handle the file selection from user input
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  // Main logic to communicate with the Gemini Service
  const handleAskAI = async () => {
    if (!input.trim() && !selectedImage) return;

    setIsLoading(true);
    setResponse("");
    
    try {
      // Sending both text and image to the service
      const aiText = await getAIResponse(input, selectedImage);
      setResponse(aiText);
    } catch (error) {
      setResponse("Bir hata olustu. Lutfen tekrar deneyiniz.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 font-display">
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Yerli Urun <span className="text-primary">Danismani</span>
        </h2>
        <p className="text-zinc-400 text-lg">Marka adini yaziniz veya urun fotografini yukleyiniz</p>
      </div>

      <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 backdrop-blur-sm">
        <textarea 
          className="w-full bg-black border border-zinc-700 rounded-xl p-4 text-white focus:border-primary outline-none transition-all resize-none mb-4"
          rows="3"
          placeholder="Ornek: Bu marka boykot listesinde mi? Alternatifleri nelerdir?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex flex-wrap items-center gap-4">
          {/* Custom styled file upload button using your theme colors */}
          <label className="flex-1 min-w-[200px] cursor-pointer bg-zinc-800 hover:bg-zinc-700 text-white py-3 px-6 rounded-xl border border-dashed border-zinc-600 text-center transition-all">
            <span className="text-sm">{selectedImage ? selectedImage.name : "Dosya Sec"}</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>

          <button 
            onClick={handleAskAI}
            disabled={isLoading}
            className="bg-primary hover:bg-emerald-500 text-black font-bold py-3 px-10 rounded-xl transition-all disabled:opacity-50"
          >
            {isLoading ? "Analiz Ediliyor..." : "Sorgula"}
          </button>
        </div>
      </div>

      {/* Result display area with your primary theme border */}
      {response && (
        <div className="mt-10 p-8 bg-zinc-900 border-l-4 border-primary rounded-r-2xl animate-fadeIn">
          <h3 className="text-primary font-bold mb-4 text-xl">Analiz Sonucu</h3>
          <p className="text-zinc-300 leading-relaxed text-lg whitespace-pre-line">
            {response}
          </p>
        </div>
      )}
    </div>
  );
};

export default Scanner;
