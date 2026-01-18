import React, { useState, useEffect } from 'react';
import { getAIResponse } from '../../services/aiService';
import productsData from "../../data/products.json";
import { Eye, Search, Image as ImageIcon, X, MapPin } from 'lucide-react';

const Scanner = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (input.trim() || selectedImage) setResponse("");
    const results = productsData.filter(p => 
      p.foreign_brands.some(b => b.toLowerCase().includes(input.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(input.toLowerCase()))
    );
    // Grid 7 rows x 3 columns = 21 products
    setFilteredProducts(input.trim() ? results.slice(0, 21) : productsData.slice(0, 21));
  }, [input, selectedImage]);

  const handleAskAI = async () => {
    setResponse("");
    setIsLoading(true);
    try {
      const aiText = await getAIResponse(input, selectedImage);
      setResponse(aiText);
    } catch (error) { setResponse("Bağlantı hatası."); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-32 pb-20 relative overflow-hidden">
      {/* Background World Map */}


 {/* World Map SVG Background - Guaranteed to work */}
<div className="absolute top-0 left-0 w-full h-[600px] opacity-[0.05] pointer-events-none grayscale invert flex items-center justify-center overflow-hidden">
  <svg viewBox="0 0 2000 1000" className="w-full h-full object-cover">
    <path fill="currentColor" d="M300,400 Q400,300 500,400 T700,400 T900,300 T1100,400" />
    <image 
      href="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg" 
      width="2000" height="1000" 
    />
  </svg>
</div>

      <div className="text-center mb-16 relative z-10">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">Yerli Ürün <span className="text-primary">Danışmanı</span></h2>
        <p className="text-zinc-500 text-lg">Hızlı arama yapın veya AI ile analiz edin</p>
      </div>

      {/* Input UI */}
      <div className="bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 backdrop-blur-md mb-20">
        <textarea 
          disabled={!!selectedImage}
          className="w-full bg-black/40 border border-zinc-800 rounded-2xl p-5 text-white outline-none focus:border-primary transition-all resize-none mb-4"
          rows="2"
          placeholder={selectedImage ? "Görüntü analiz edilecek..." : "Marka adı arayın..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex flex-wrap gap-4">
          <label className="flex-1 cursor-pointer bg-zinc-800/40 py-4 px-6 rounded-xl border border-dashed border-zinc-700 text-center text-white">
            {selectedImage ? selectedImage.name : "Fotoğraf Yükle"}
            <input type="file" className="hidden" onChange={(e) => setSelectedImage(e.target.files[0])} />
          </label>
          <button onClick={handleAskAI} disabled={isLoading} className="bg-primary px-10 py-4 rounded-xl text-black font-bold">
            {isLoading ? "Analiz..." : "Sorgula"}
          </button>
        </div>
      </div>

      {/* AI Result Area */}
      {response && (
        <div className="mb-12 p-8 bg-zinc-900 border-l-4 border-primary rounded-r-2xl animate-fadeIn">
          <h3 className="text-primary font-bold mb-4">AI Sonucu</h3>
          <div className="result-text text-zinc-300 whitespace-pre-line">{response}</div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProducts.map((product, idx) => (
          <div key={idx} className="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 hover:border-primary transition-all group cursor-pointer" onClick={() => setSelectedProduct(product)}>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-xl font-bold text-white group-hover:text-primary">{product.foreign_brands[0]}</h4>
                <p className="text-zinc-500 text-sm mt-1">{product.category}</p>
              </div>
              <span className="text-[10px] font-bold bg-zinc-800 px-2 py-1 rounded text-zinc-400">
                {product.origin === "Türkiye" ? "TÜRKİYE" : "GLOBAL"}
              </span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50 text-zinc-400 text-sm group-hover:text-white">
              <span className="flex items-center gap-2"><Eye size={16}/> Detaylar</span>
              <span className="text-primary flex items-center gap-1 font-bold"><div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div> İncelendi</span>
            </div>
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-[2000] p-6 backdrop-blur-sm">
          <div className="bg-zinc-900 p-10 rounded-[40px] border border-zinc-800 max-w-lg w-full relative">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-6 right-6 text-zinc-500"><X/></button>
            <h2 className="text-3xl font-bold text-white mb-2">{selectedProduct.foreign_brands[0]}</h2>
            <div className="bg-black/40 p-5 rounded-2xl mb-6 flex items-center gap-3 border border-zinc-800">
              <MapPin className="text-primary" />
              <div><p className="text-zinc-500 text-xs">Üretim Yeri</p><p className="text-white font-bold">{selectedProduct.origin}</p></div>
            </div>
            <p className="text-primary font-bold mb-2">Bilgi:</p>
            <p className="text-zinc-300 text-lg leading-relaxed">{selectedProduct.advice}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scanner;
