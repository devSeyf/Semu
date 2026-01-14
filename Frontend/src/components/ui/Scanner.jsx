import React, { useState, useEffect } from 'react';
import { getAIResponse } from '../../services/aiService';
import productsData from "../../data/products.json";  
import { Eye, Search, Image as ImageIcon, X } from 'lucide-react';

const Scanner = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // 1. Initial Feed: Show some products by default
  useEffect(() => {
    setFilteredProducts(productsData.slice(0, 6));
  }, []);

  // 2. Real-time Search Logic (Local Database)
  useEffect(() => {
    if (input.trim().length > 1 && !selectedImage) {
      const results = productsData.filter(p => 
        p.foreign_brands.some(b => b.toLowerCase().includes(input.toLowerCase())) ||
        p.category.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredProducts(results.slice(0, 9));
    } else if (!input.trim() && !selectedImage) {
      setFilteredProducts(productsData.slice(0, 6));
    }
  }, [input, selectedImage]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
      setInput(""); // Clear text if image is selected
    }
  };

  const clearImage = () => setSelectedImage(null);

  const handleAskAI = async () => {
    if (!input.trim() && !selectedImage) return;
    setIsLoading(true);
    setResponse("");
    try {
      const aiText = await getAIResponse(input, selectedImage);
      setResponse(aiText);
    } catch (error) {
      setResponse("Bir hata oluştu. Lütfen tekrar deneyiniz.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 font-display pb-20">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Yerli Ürün <span className="text-primary">Danışmanı</span>
        </h2>
        <p className="text-zinc-400 text-lg">Hızlı arama yapın veya AI ile analiz edin</p>
      </div>

      {/* Simplified Input Container */}
      <div className="bg-zinc-900/80 p-6 rounded-3xl border border-zinc-800 shadow-2xl mb-12">
        <div className="relative mb-4">
          <textarea 
            disabled={!!selectedImage}
            className={`w-full bg-black/50 border border-zinc-700 rounded-2xl p-5 text-white focus:border-primary outline-none transition-all resize-none ${selectedImage ? 'opacity-30' : ''}`}
            rows="2"
            placeholder={selectedImage ? "Resim seçiliyken yazı yazılamaz..." : "Marka adı veya kategori arayın..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          {!selectedImage && <Search className="absolute right-5 top-5 text-zinc-500" />}
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className={`flex-1 min-w-[200px] relative cursor-pointer bg-zinc-800/50 hover:bg-zinc-700/50 text-white py-4 px-6 rounded-2xl border-2 border-dashed border-zinc-700 text-center transition-all ${input.trim() ? 'opacity-30 pointer-events-none' : ''}`}>
            {selectedImage ? (
              <div className="flex items-center justify-center gap-2">
                <span className="text-primary truncate max-w-[150px]">{selectedImage.name}</span>
                <X size={18} className="text-red-500" onClick={(e) => { e.preventDefault(); clearImage(); }} />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <ImageIcon size={20} className="text-zinc-400" />
                <span>Fotoğraf Yükle</span>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={input.trim().length > 0} />
          </label>

          <button 
            onClick={handleAskAI}
            disabled={isLoading || (!input.trim() && !selectedImage)}
            className="bg-primary hover:scale-105 active:scale-95 text-black font-bold py-4 px-12 rounded-2xl transition-all disabled:opacity-20"
          >
            {isLoading ? "Analiz Ediliyor..." : "Sorgula"}
          </button>
        </div>
      </div>

      {/* AI Analysis Result */}
      {response && (
        <div className="mb-12 p-8 bg-zinc-900/90 border-l-4 border-primary rounded-2xl animate-fadeIn shadow-xl">
          <h3 className="text-primary font-bold mb-4 text-xl">AI Analiz Sonucu</h3>
          <div className="result-text text-zinc-300 whitespace-pre-line">{response}</div>
        </div>
      )}

      {/* Product Grid Section (Your Requested UI) */}
      <div className="mt-10">
        <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <Search className="text-primary" /> {input.trim() ? "Arama Sonuçları" : "Önerilen Ürünler"}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, idx) => (
            <div key={idx} className="bg-zinc-900/40 p-6 rounded-2xl border border-zinc-800 hover:border-primary/50 transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h4 className="text-xl font-bold text-white group-hover:text-primary transition-colors">
                    {product.foreign_brands[0]}
                  </h4>
                  <p className="text-zinc-500 text-sm mt-1">{product.category}</p>
                </div>
                <span className="text-[10px] uppercase tracking-widest bg-zinc-800 px-2 py-1 rounded text-zinc-400">
                  {product.origin || "TR/Foreign"}
                </span>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800/50">
                <button className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm transition-all">
                  <Eye size={16} /> Detaylar
                </button>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-xs text-primary font-medium">İncelendi</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Scanner;
