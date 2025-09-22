
import React from 'react';
import { HealthCondition } from '../types';

interface HealthConditionSelectorProps {
  selectedCondition: HealthCondition;
  onSelect: (condition: HealthCondition) => void;
}

const conditions: { id: HealthCondition; label: string; emoji: string; color: string }[] = [
  { id: 'diabetes', label: 'Diabetes', emoji: '🍬', color: 'bg-blue-500' },
  { id: 'hypertension', label: 'Hypertension', emoji: '🧂', color: 'bg-indigo-500' },
  { id: 'high-cholesterol', label: 'High Cholesterol', emoji: '🍔', color: 'bg-purple-500' },
  { id: 'none', label: 'No Condition', emoji: '😊', color: 'bg-gray-500' },
];

const HealthConditionSelector: React.FC<HealthConditionSelectorProps> = ({ selectedCondition, onSelect }) => {
  return (
    <div className="mb-8 p-6 bg-white rounded-2xl shadow-md">
      <h3 className="text-2xl font-bold text-center text-brand-dark mb-4">First, select a health condition:</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {conditions.map(({ id, label, emoji, color }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`p-4 rounded-xl flex items-center gap-4 text-left text-white text-xl font-semibold transition-all transform hover:scale-105 ${color} ${selectedCondition === id ? 'ring-4 ring-brand-yellow ring-offset-2' : ''}`}
          >
            <span className="text-4xl">{emoji}</span>
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default HealthConditionSelector;
