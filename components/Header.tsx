
import React from 'react';
import { Page } from '../types';

interface HeaderProps {
  onNavigate: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  return (
    <header className="bg-brand-blue shadow-md text-white">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
          <span className="text-3xl mr-2">💊</span>
          <h1 className="text-xl md:text-2xl font-bold">MediVoice Senior</h1>
        </div>
        <nav className="flex items-center space-x-4 md:space-x-6 text-lg">
          <button onClick={() => onNavigate('home')} className="hover:text-brand-yellow transition-colors font-semibold">🏠 Home</button>
          <button onClick={() => onNavigate('about')} className="hover:text-brand-yellow transition-colors font-semibold">ℹ️ About</button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
