import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

const leftNav = [
  { label: 'Why Us', href: '#why-us' },
  { label: 'Our Vision', href: '#our-vision' },
  { label: 'Franchise Models', href: '#models' },
  
];
const rightNav = [
  { label: 'Support', href: '#support' },
  { label: 'Success Stories', href: '#stories' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openForm = () => {
    window.dispatchEvent(new CustomEvent('openFranchiseForm'));
    setOpen(false);
  };

  return (
    <header
      data-testid="global-header"
      className={`
        fixed top-0 inset-x-0 z-[1000] h-24
        bg-cream-100/95 backdrop-blur-lg border-b border-warm-gold/20
        transition-all duration-300
        ${scrolled ? 'shadow-lg shadow-black/10 bg-cream-100/98' : ''}
      `}
    >
      <div className="container-x">
        {/* Desktop */}
        <div className="hidden lg:grid grid-cols-3 items-center h-20">
          {/* Left */}
          <nav className="flex items-center gap-8 justify-start">
            {leftNav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="relative text-deep-brown/80 hover:text-warm-gold font-medium text-lg
                           transition-all duration-300 ease-out group py-2 px-3 rounded-lg
                           hover:bg-warm-gold/5 active:bg-warm-gold/10
                           before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 
                           before:bg-warm-gold before:transition-all before:duration-300 before:ease-out
                           hover:before:w-full
                           after:absolute after:inset-0 after:rounded-lg after:bg-warm-gold/5 after:scale-0 
                           hover:after:scale-100 after:transition-transform after:duration-300 after:ease-out after:-z-10"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Center brand */}
          <a href="/" className="justify-self-center flex items-center gap-4 group">
            <div className="w-30 h-30 flex items-center justify-center relative">
              <img src="/logo.png" alt="Halfbilliondollar Logo" className="w-24 h-24 object-contain
                                                                          transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 rounded-full bg-warm-gold/10 scale-0 group-hover:scale-100
                              transition-all duration-300 blur-sm"></div>
            </div>
            <div className="text-2xl font-bold text-deep-brown leading-tight tracking-wide">
              <span>Half Billion Dollar</span>
            </div>
          </a>

          {/* Right */}
          <nav className="flex items-center gap-8 justify-end">
            {rightNav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="relative text-deep-brown/80 hover:text-warm-gold font-medium text-lg
                           transition-all duration-300 ease-out group py-2 px-3 rounded-lg
                           hover:bg-warm-gold/5 active:bg-warm-gold/10
                           before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 
                           before:bg-warm-gold before:transition-all before:duration-300 before:ease-out
                           hover:before:w-full
                           after:absolute after:inset-0 after:rounded-lg after:bg-warm-gold/5 after:scale-0 
                           hover:after:scale-100 after:transition-transform after:duration-300 after:ease-out after:-z-10"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Mobile */}
        <div className="lg:hidden grid grid-cols-3 items-center h-20">
          <button
            className="justify-self-start p-2 rounded-lg text-deep-brown hover:bg-warm-gold/10 transition ml-[-0.25rem]"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <a href="/" className="justify-self-center flex items-center gap-3">
            <img src="/logo.png" alt="Halfbilliondollar" className="h-12 w-12 object-contain" />
            <div className="text-lg font-bold text-deep-brown">
              <span>Halfbillion Dollar</span>
            </div>
          </a>

          <div />
        </div>

        {open && (
          <div className="lg:hidden border-t border-warm-gold/20 bg-cream-100/95 backdrop-blur-lg">
            <div className="py-4 flex flex-col gap-2">
              {[...leftNav, ...rightNav].map((item) => (
                item.href.startsWith('/') ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className="py-3 px-4 text-deep-brown/80 hover:text-warm-gold hover:bg-warm-gold/10 
                               transition-all duration-300 font-medium rounded-lg text-base"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="py-3 px-4 text-deep-brown/80 hover:text-warm-gold hover:bg-warm-gold/10 
                               transition-all duration-300 font-medium rounded-lg text-base"
                  >
                    {item.label}
                  </a>
                )
              ))}
            </div>
          </div>
        )}
      </div>

            {/* CTA Section below header */}
<div className="absolute top-full left-0 right-0 bg-gradient-to-r from-warm-gold/10 via-cream-100/50 to-warm-gold/10 
                border-b border-warm-gold/20 py-3">
  <div className="container-x">
    <div className="flex items-center justify-between">
      {/* Empty space for balance */}
      <div className="flex-1"></div>
      
      {/* Centered Partners info */}
      <div className="flex items-center gap-6 text-deep-brown/70 text-sm justify-center flex-1">
        <span className="flex items-center gap-1">
          <span>👥</span> 500+ Partners
        </span>
        <span className="flex items-center gap-1">
          <span>⭐</span> 4.9/5 Rating
        </span>
        <span className="flex items-center gap-1">
          <span>🏛️</span> Govt. Approved
        </span>
      </div>
      
      {/* CTA button on extreme right */}
      <div className="flex justify-end flex-1">
        <button
          onClick={openForm}
          className="group relative bg-gradient-to-r from-warm-gold via-yellow-500 to-warm-gold 
                     hover:from-yellow-500 hover:via-warm-gold hover:to-yellow-500
                     text-deep-brown px-6 py-2 rounded-full font-semibold text-sm overflow-hidden
                     transition-all duration-300 ease-out transform hover:scale-105 active:scale-95
                     shadow-md shadow-warm-gold/20 hover:shadow-xl hover:shadow-warm-gold/50
                     flex items-center gap-2
                     before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent 
                     before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300
                     after:absolute after:inset-0 after:rounded-full after:shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]
                     hover:after:shadow-[inset_0_1px_0_rgba(255,255,255,0.4)] after:transition-all after:duration-300
                     focus:outline-none focus:ring-4 focus:ring-warm-gold/30"
        >
          <span className="relative z-10">Start Your Coffee Empire</span>
          <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform duration-300 ease-out" />
        </button>
      </div>
    </div>
  </div>
</div>
    </header>
  );
}