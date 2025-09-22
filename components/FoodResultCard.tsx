
import React from 'react';
import { FoodNutrition } from '../types';
import { useTextToSpeech } from '../hooks/useTextToSpeech';

interface FoodResultCardProps {
  foodName: string;
  nutrition: FoodNutrition;
}

const NutritionInfo: React.FC<{ label: string; value: number; unit: string; color: string }> = ({ label, value, unit, color }) => (
    <div className={`flex-1 p-4 rounded-lg text-center ${color}`}>
        <p className="text-lg font-semibold text-gray-700">{label}</p>
        <p className="text-3xl font-bold text-brand-dark">{value}{unit}</p>
    </div>
);


const FoodResultCard: React.FC<FoodResultCardProps> = ({ foodName, nutrition }) => {
  const { isSpeaking, speak } = useTextToSpeech();
  const { sugar, fat, protein, notes } = nutrition;

  const generateSpokenText = () => {
    return `This is ${foodName}. It contains ${sugar} grams of sugar, ${fat} grams of fat, and ${protein} grams of protein. ${notes || ''}`;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center gap-4 border-l-8 border-brand-green">
        <div className="text-center">
            <p className="text-xl text-gray-600">We identified:</p>
            <h3 className="text-4xl font-bold text-brand-dark capitalize">{foodName}</h3>
        </div>

        <div className="w-full flex flex-col md:flex-row gap-4 mt-4">
            <NutritionInfo label="Sugar" value={sugar} unit="g" color="bg-blue-100" />
            <NutritionInfo label="Fat" value={fat} unit="g" color="bg-yellow-100" />
            <NutritionInfo label="Protein" value={protein} unit="g" color="bg-green-100" />
        </div>
        
        {notes && <p className="text-lg text-gray-700 mt-4 text-center">{notes}</p>}

        <button 
          onClick={() => speak(generateSpokenText())}
          className={`mt-4 flex items-center justify-center w-20 h-20 rounded-full text-white text-4xl shadow-lg transform transition-transform hover:scale-110 ${isSpeaking ? 'bg-red-500' : 'bg-brand-blue'}`}
          aria-label={isSpeaking ? 'Stop speaking' : 'Read result aloud'}
        >
          {isSpeaking ? '⏹️' : '🔊'}
        </button>
    </div>
  );
};

export default FoodResultCard;
