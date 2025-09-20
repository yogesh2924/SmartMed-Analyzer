
import React from 'react';
import { ScanMode } from '../types';
import LargeButton from './LargeButton';

interface HomePageProps {
  onStartScan: (mode: ScanMode) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartScan }) => {
  return (
    <div className="text-center flex flex-col items-center">
      <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
        Welcome! 👋
      </h2>
      <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl">
        Let's make understanding your medicines simple. Choose an option below to get started.
      </p>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <LargeButton 
          onClick={() => onStartScan('prescription')}
          emoji="📄"
          title="Scan Prescription"
          description="Upload a photo of your doctor's prescription."
          className="bg-brand-green text-white focus:ring-brand-green"
        />
        <LargeButton 
          onClick={() => onStartScan('medicine')}
          emoji="📷"
          title="Scan Medicine"
          description="Take a picture of your medicine strip or bottle."
          className="bg-brand-yellow text-brand-dark focus:ring-brand-yellow"
        />
      </div>
    </div>
  );
};

export default HomePage;
