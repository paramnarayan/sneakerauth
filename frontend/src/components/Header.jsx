import React from 'react';

const Header = ({ title, subtitle }) => {
  return (
    <header className="mb-10 w-full hw-accel animate-in slide-in-from-top-6 duration-700">
      <h2 className="text-3xl font-bold tracking-[0.15em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white via-luxury-light to-white mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
        {title}
      </h2>
      <div className="h-[1px] w-24 bg-gradient-to-r from-cyber-cyan to-transparent mb-4"></div>
      <p className="text-gray-400 text-sm max-w-2xl leading-relaxed font-light tracking-wide">
        {subtitle}
      </p>
    </header>
  );
};

export default Header;
