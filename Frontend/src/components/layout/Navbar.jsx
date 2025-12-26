import React, { useState, useEffect } from 'react';
import { Code, Menu, X } from 'lucide-react';
import { NAV_LINKS, PERSONAL_INFO } from '../../utils/constants';
import { scrollToSection, useScrollspy } from '../../hooks/useScrollSpy';

export default function Navbar() {
const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const activeSection = useScrollSpy(NAV_LINKS.map(link => link.id));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    scrollToSection(sectionId);
    setIsMenuOpen(false);
  };

    return (
 
  <nav
    className={`fixed top-0 left-0 right-0 z-1000 w-full py-4 transition-all duration-300 ${isScrolled 
      ? 'bg-black/30 backdrop-blur-lg' 
      : 'bg-transparent'
    }`}
    style={{ transform: 'translate3d(0, 0, 0)' }}
  >
    <div className="">
      <div className="">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Code className="w-6 h-6 text-primary" />
          
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className=""
            aria-label="home"
          >
            {PERSONAL_INFO.name.split(' ')[0]}
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavClick(link.id)}
              className={`text-base font-medium transition-all duration-300 ${activeSection === link.id
                ? 'text-white'
                : 'text-white/70 hover:text-white'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="">
          <button
            onClick={() => handleNavClick('contact')}
            className=""
          >
            Hire Me
          </button>
        </div>

      </div>
    </div>
  </nav>
);

    
}



 





