import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[1000] w-full py-5 transition-all duration-300 ${
      isScrolled ? 'bg-black/40 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
    }`}>
      <div className="max-w-[1320px] mx-auto px-6 flex items-center justify-between">
        
        {/* Logo Semu */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <ShieldCheck className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-3xl font-black text-white tracking-tighter">SEMU</span>
        </div>

        {/* Desktop Navigation: Only About and Contact */}
        <div className="hidden md:flex items-center gap-12">
          <button onClick={() => navigate('/')} className="text-white/70 hover:text-white font-medium transition-all text-lg">About</button>
          <button onClick={() => navigate('/')} className="text-white/70 hover:text-white font-medium transition-all text-lg">Contact</button>
          
          <button 
            onClick={() => navigate('/add-product')}
            className="px-8 py-3.5 bg-white text-black font-extrabold rounded-2xl hover:bg-zinc-200 transition-all shadow-2xl shadow-white/5"
          >
            Ürün Ekle
          </button>
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white">
          {isMenuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-zinc-900 border-b border-zinc-800 p-8 space-y-6 animate-fadeIn">
          <button onClick={() => { navigate('/'); setIsMenuOpen(false); }} className="block w-full text-left text-white text-xl">About</button>
          <button onClick={() => { navigate('/'); setIsMenuOpen(false); }} className="block w-full text-left text-white text-xl">Contact</button>
          <button onClick={() => { navigate('/add-product'); setIsMenuOpen(false); }} className="w-full bg-primary text-black font-bold py-4 rounded-2xl">Ürün Ekle</button>
        </div>
      )}
    </nav>
  );
}
