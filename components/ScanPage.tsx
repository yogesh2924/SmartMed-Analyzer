
import React, { useState, useCallback } from 'react';
import { ScanMode, MedicineInfo } from '../types';
import { analyzePrescription, recognizeMedicine } from '../services/geminiService';
import Spinner from './Spinner';
import MedicineCard from './MedicineCard';

interface ScanPageProps {
  mode: ScanMode;
}

const ScanPage: React.FC<ScanPageProps> = ({ mode }) => {
  const [results, setResults] = useState<MedicineInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setResults([]);
    setFileName(file.name);

    try {
      let analysisResult: MedicineInfo[];
      if (mode === 'prescription') {
        analysisResult = await analyzePrescription(file);
      } else {
        analysisResult = await recognizeMedicine(file);
      }
      
      if (analysisResult.length === 0) {
          setError("Sorry, we couldn't find any medicine information in the image. Please try again with a clearer picture.");
      } else {
          setResults(analysisResult);
      }

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [mode]);

  const config = {
    prescription: {
      emoji: '📄',
      title: 'Analyze Prescription',
      description: "Upload a photo of your prescription to get started. For best results, use a clear image with good lighting.",
      buttonText: 'Upload Prescription Image'
    },
    medicine: {
      emoji: '📷',
      title: 'Identify Medicine',
      description: "Take a picture of a medicine strip or bottle. Make sure the name is clearly visible.",
      buttonText: 'Scan Your Medicine'
    }
  };

  const { emoji, title, description, buttonText } = config[mode];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8 bg-white p-6 rounded-2xl shadow-md">
        <span className="text-6xl">{emoji}</span>
        <h2 className="text-4xl font-bold text-brand-dark mt-2">{title}</h2>
        <p className="text-lg text-gray-600 mt-2">{description}</p>
      </div>

      <div className="flex flex-col items-center mb-8">
        <label className="bg-brand-blue hover:bg-blue-800 text-white font-bold text-2xl py-6 px-10 rounded-full cursor-pointer shadow-lg transform transition-transform hover:scale-105">
          <span>{buttonText}</span>
          <input 
            type="file" 
            accept="image/*" 
            capture="environment" 
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        {fileName && !isLoading && <p className="mt-4 text-gray-600">File: {fileName}</p>}
      </div>

      {isLoading && (
        <div className="text-center">
            <Spinner />
            <p className="text-xl font-semibold text-brand-dark mt-4 animate-pulse">Analyzing your image... please wait.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md">
          <p className="font-bold text-xl">Oh no!</p>
          <p className="text-lg">{error}</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-6">
           <h3 className="text-3xl font-bold text-center text-brand-dark">Here's what we found: ✅</h3>
          {results.map((med, index) => (
            <MedicineCard key={index} medicine={med} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ScanPage;
