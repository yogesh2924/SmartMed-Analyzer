
import React from 'react';
import { MedicineInfo } from '../types';

interface PrescriptionViewProps {
  prescription: MedicineInfo[];
}

const PrescriptionView: React.FC<PrescriptionViewProps> = ({ prescription }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8 bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold text-brand-dark mb-4 text-center">Your Current Prescription</h2>
      <div className="space-y-4">
        {prescription.map((med, index) => (
          <div key={index} className="p-4 rounded-lg bg-gray-50 border-l-4 border-brand-blue">
            <p className="text-xl font-bold text-brand-dark">{med.name}</p>
            <p className="text-lg text-gray-700">{med.dosage}</p>
            <p className="text-md text-gray-600">Take {med.frequency} time(s) a day: {med.timing.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrescriptionView;
