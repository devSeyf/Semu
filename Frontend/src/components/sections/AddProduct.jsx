import React, { useState } from 'react';
import { Camera, Send, MapPin, Package } from 'lucide-react';

const AddProduct = () => {
  const [formData, setFormData] = useState({ name: '', origin: 'Türkiye', image: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Logic to send to MongoDB via backend
    alert("Ürün başarıyla gönderildi. İncelemeden sonra eklenecektir.");
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto bg-zinc-900/50 backdrop-blur-xl p-10 rounded-[35px] border border-zinc-800 shadow-2xl">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Package className="text-primary" /> Yeni Ürün Ekle
        </h2>
        <p className="text-zinc-500 mb-8">Veritabanımıza katkıda bulunarak yerli üretimi destekleyin.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-zinc-400 text-sm ml-2">Ürün Adı</label>
            <input 
              className="w-full bg-black/50 border border-zinc-700 p-5 rounded-2xl text-white outline-none focus:border-primary transition-all"
              placeholder="Örn: Coca Cola veya Torku"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-zinc-400 text-sm ml-2">Menşei</label>
            <select 
              className="w-full bg-black/50 border border-zinc-700 p-5 rounded-2xl text-white outline-none focus:border-primary appearance-none"
              onChange={(e) => setFormData({...formData, origin: e.target.value})}
            >
              <option value="Türkiye">Türkiye</option>
              <option value="Global">Global / Diğer</option>
            </select>
          </div>

          <div className="border-2 border-dashed border-zinc-700 p-12 text-center rounded-2xl group hover:border-primary transition-all cursor-pointer bg-black/20">
            <Camera className="mx-auto text-zinc-600 group-hover:text-primary mb-3" size={32} />
            <p className="text-zinc-500 text-sm">Ürün fotoğrafını buraya sürükleyin veya tıklayın</p>
          </div>

          <button className="w-full bg-primary hover:bg-emerald-500 text-black font-bold py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-primary/20">
            <Send size={20} /> Bilgileri Gönder
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
