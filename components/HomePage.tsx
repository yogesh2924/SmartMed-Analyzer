
import React from 'react';
import { ScanMode, MedicineInfo } from '../types';
import LargeButton from './LargeButton';
import PrescriptionView from './PrescriptionView';

interface HomePageProps {
  onStartScan: (mode: ScanMode) => void;
  prescription: MedicineInfo[] | null;
}

const HomePage: React.FC<HomePageProps> = ({ onStartScan, prescription }) => {
  return (
    <div className="text-center flex flex-col items-center">
      <h2 className="text-4xl md:text-5xl font-bold text-brand-dark mb-4">
        Welcome! 👋
      </h2>
      <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl">
        Your simple health assistant. Let's get started.
      </p>

      {prescription && (
        <PrescriptionView prescription={prescription} />
      )}

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {!prescription ? (
          <div className="md:col-span-2">
            <LargeButton 
              onClick={() => onStartScan('prescription')}
              emoji="📄"
              title="Scan Your Prescription"
              description="Upload a photo to get started."
              className="bg-brand-green text-white focus:ring-brand-green"
            />
          </div>
        ) : (
          <>
            <LargeButton 
              onClick={() => onStartScan('medicine')}
              emoji="💊"
              title="Verify Your Medicine"
              description="Check a medicine against your prescription."
              className="bg-brand-yellow text-brand-dark focus:ring-brand-yellow"
            />
             <LargeButton 
              onClick={() => onStartScan('prescription')}
              emoji="🔄"
              title="Scan New Prescription"
              description="Replace the current one with a new photo."
              className="bg-brand-blue text-white focus:ring-brand-blue"
            />
          </>
        )}
        <div className={prescription ? "md:col-span-2" : ""}>
          <LargeButton 
            onClick={() => onStartScan('food')}
            emoji="🥗"
            title="Check Your Food"
            description="Scan food for nutritional information."
            className="bg-orange-500 text-white focus:ring-orange-500"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
