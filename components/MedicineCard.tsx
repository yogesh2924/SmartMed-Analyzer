
import React from 'react';
import { MedicineInfo } from '../types';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface MedicineCardProps {
  medicine: MedicineInfo;
}

const TimingIcon: React.FC<{ timing: 'morning' | 'afternoon' | 'night' }> = ({ timing }) => {
  const icons = {
    morning: { emoji: '☀️', label: 'Morning' },
    afternoon: { emoji: '🌤️', label: 'Afternoon' },
    night: { emoji: '🌙', label: 'Night' },
  };
  const { emoji, label } = icons[timing];
  return (
    <div className="flex flex-col items-center justify-center bg-blue-100 rounded-lg p-2 text-center">
      <span className="text-3xl">{emoji}</span>
      <span className="text-sm font-semibold text-brand-dark">{label}</span>
    </div>
  );
};

const MedicineCard: React.FC<MedicineCardProps> = ({ medicine }) => {
  const { isSpeaking, speak } = useTextToSpeech();

  const generateSpokenText = () => {
    const { name, dosage, frequency, timing } = medicine;
    const timesPerDay = frequency === 1 ? 'once a day' : `${frequency} times a day`;
    const timingText = timing.length > 0 ? `in the ${timing.join(' and ')}` : '';
    return `This is ${name}, ${dosage}. Take ${timesPerDay}, ${timingText}.`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row items-start gap-6 border-l-8 border-brand-green">
      <div className="flex-grow">
        <h3 className="text-3xl font-bold text-brand-dark">{medicine.name}</h3>
        <p className="text-xl text-gray-600 mt-1">{medicine.dosage}</p>
        <p className="text-lg text-gray-500 mt-2">Take {medicine.frequency} time(s) a day.</p>
        
        <div className="mt-4">
          <h4 className="font-semibold text-gray-700 mb-2">Suggested Times:</h4>
          <div className="grid grid-cols-3 gap-2">
            {medicine.timing.includes('morning') && <TimingIcon timing="morning" />}
            {medicine.timing.includes('afternoon') && <TimingIcon timing="afternoon" />}
            {medicine.timing.includes('night') && <TimingIcon timing="night" />}
          </div>
        </div>
      </div>
      <div className="w-full md:w-auto flex justify-center mt-4 md:mt-0">
        <button 
          onClick={() => speak(generateSpokenText())}
          className={`flex items-center justify-center w-24 h-24 rounded-full text-white text-4xl shadow-lg transform transition-transform hover:scale-110 ${isSpeaking ? 'bg-red-500' : 'bg-brand-blue'}`}
        >
          {isSpeaking ? '⏹️' : '🔊'}
        </button>
      </div>
    </div>
  );
};

export default MedicineCard;
