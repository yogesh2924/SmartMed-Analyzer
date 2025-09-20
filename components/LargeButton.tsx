
import React from 'react';
import { LargeButtonProps } from '../types';

const LargeButton: React.FC<LargeButtonProps> = ({ onClick, emoji, title, description, className }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-6 md:p-8 rounded-2xl shadow-lg border-4 border-transparent transition-all transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-opacity-75 ${className}`}
    >
      <div className="flex items-center">
        <span className="text-6xl md:text-7xl mr-6">{emoji}</span>
        <div>
          <h3 className="text-2xl md:text-3xl font-bold">{title}</h3>
          <p className="text-md md:text-lg mt-1">{description}</p>
        </div>
      </div>
    </button>
  );
};

export default LargeButton;
