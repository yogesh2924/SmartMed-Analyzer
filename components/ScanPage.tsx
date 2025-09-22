import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ScanMode, MedicineInfo, FoodNutrition, ScannedMedicine } from '../types';
import { analyzePrescription, recognizeMedicine, recognizeFood } from '../services/geminiService';
import { foodDatabase } from '../data/foodData';
import Spinner from './Spinner';
import FoodResultCard from './FoodResultCard';

interface ScanPageProps {
  mode: ScanMode;
  prescription: MedicineInfo[] | null;
  onPrescriptionScanned: (prescription: MedicineInfo[]) => void;
  onNavigateHome: () => void;
}

interface FoodResultState {
  name: string;
  nutrition: FoodNutrition;
}

interface VerificationResultState {
    isMatch: boolean;
    message: string;
}

const ScanPage: React.FC<ScanPageProps> = ({ mode, prescription, onPrescriptionScanned, onNavigateHome }) => {
  const [foodResult, setFoodResult] = useState<FoodResultState | null>(null);
  const [verificationResult, setVerificationResult] = useState<VerificationResultState | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const processImage = useCallback(async (file: File) => {
    if (!file) return;

    setIsLoading(true);
    setError(null);
    setFoodResult(null);
    setVerificationResult(null);
    setFileName(file.name);

    try {
      if (mode === 'prescription') {
        const analysisResult = await analyzePrescription(file);
        if (analysisResult.length > 0) {
            onPrescriptionScanned(analysisResult);
        } else {
            setError("Sorry, we couldn't find any medicine information in the image. Please try again with a clearer picture.");
        }
      } else if (mode === 'medicine') {
        if (!prescription) {
            setError("Please scan a prescription first before verifying medicine.");
            setIsLoading(false);
            return;
        }
        const recognitionResult: ScannedMedicine[] = await recognizeMedicine(file);
        if (recognitionResult.length > 0) {
            const scannedMed = recognitionResult[0];
            const isMatch = prescription.some(pMed => 
                pMed.name.toLowerCase().includes(scannedMed.name.toLowerCase())
            );
            if(isMatch) {
                setVerificationResult({ isMatch: true, message: `✅ Verified! "${scannedMed.name}" is on your prescription.` });
            } else {
                setVerificationResult({ isMatch: false, message: `❌ Mismatch! "${scannedMed.name}" was not found on your prescription. Please double-check.` });
            }
        } else {
            setError("Sorry, we couldn't recognize the medicine in the image. Please try again.");
        }
      } else if (mode === 'food') {
        const foodRecognitionResult = await recognizeFood(file);
        if (foodRecognitionResult && foodRecognitionResult.foodName) {
            const foodName = foodRecognitionResult.foodName;
            const nutritionData = foodDatabase[foodName];
            if (nutritionData) {
                setFoodResult({ name: foodName, nutrition: nutritionData });
            } else {
                setError(`We recognized "${foodName}", but it's not in our nutrition database yet.`);
            }
        } else {
            setError("Sorry, we couldn't recognize the food in the image. Please try a different angle or a clearer picture.");
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [mode, prescription, onPrescriptionScanned]);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImage(file);
    }
  }, [processImage]);

  const openCamera = useCallback(async () => {
    setError(null);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOpen(true);
      } catch (err) {
        console.error("Camera access denied:", err);
        setError("Could not access the camera. Please ensure you have granted permission in your browser settings. As an alternative, you can take a photo with your device's camera app and then use the 'Upload from Gallery' option.");
      }
    } else {
      setError("Your browser does not support camera access. Please take a photo with your device's camera app and use the 'Upload from Gallery' option.");
    }
  }, []);

  const closeCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsCameraOpen(false);
    setStream(null);
  }, [stream]);

  const handleCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        canvas.toBlob((blob) => {
          if (blob) {
            const capturedFile = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            processImage(capturedFile);
          }
        }, 'image/jpeg');
      }
    }
    closeCamera();
  }, [processImage, closeCamera]);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const config = {
    prescription: {
      emoji: '📄',
      title: 'Analyze Prescription',
      description: "Upload or take a photo of your prescription. For best results, use a clear image with good lighting.",
      uploadButtonText: 'Upload from Gallery',
      takePhotoButtonText: 'Take a Photo'
    },
    medicine: {
      emoji: '💊',
      title: 'Verify Medicine',
      description: "Take a picture of a medicine to check it against your prescription. Make sure the name is clearly visible.",
      uploadButtonText: 'Upload from Gallery',
      takePhotoButtonText: 'Use Camera'
    },
    food: {
        emoji: '🥗',
        title: 'Check Your Food',
        description: "Scan your food to see its nutritional info. Make sure the food item is clearly visible.",
        uploadButtonText: 'Upload Food Photo',
        takePhotoButtonText: 'Scan with Camera'
    }
  };

  const currentConfig = config[mode] || config.prescription;

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onNavigateHome} className="mb-4 text-brand-blue font-semibold hover:underline">← Back to Home</button>
      <div className="text-center mb-8 bg-white p-6 rounded-2xl shadow-md">
        <span className="text-6xl">{currentConfig.emoji}</span>
        <h2 className="text-4xl font-bold text-brand-dark mt-2">{currentConfig.title}</h2>
        <p className="text-lg text-gray-600 mt-2">{currentConfig.description}</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
        <label className="bg-brand-blue hover:bg-blue-800 text-white font-bold text-xl py-4 px-8 rounded-full cursor-pointer shadow-lg transform transition-transform hover:scale-105 w-full md:w-auto text-center">
          <span>{currentConfig.uploadButtonText}</span>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
        <button 
          onClick={openCamera}
          className="bg-brand-green hover:bg-green-800 text-white font-bold text-xl py-4 px-8 rounded-full cursor-pointer shadow-lg transform transition-transform hover:scale-105 w-full md:w-auto"
        >
          {currentConfig.takePhotoButtonText}
        </button>
      </div>
      {fileName && !isLoading && <p className="text-center mb-4 text-gray-600">File: {fileName}</p>}

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
      
      {verificationResult && (
        <div className={`p-6 rounded-2xl shadow-lg text-center ${verificationResult.isMatch ? 'bg-green-100 border-l-8 border-green-500' : 'bg-red-100 border-l-8 border-red-500'}`}>
            <p className="text-2xl font-bold">{verificationResult.message}</p>
        </div>
      )}

      {foodResult && (
        <div>
            <h3 className="text-3xl font-bold text-center text-brand-dark mb-4">Here's your food analysis:</h3>
            <FoodResultCard foodName={foodResult.name} nutrition={foodResult.nutrition} />
        </div>
      )}
      
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 p-4">
          <video ref={videoRef} autoPlay playsInline className="w-full max-w-3xl h-auto rounded-2xl border-4 border-white" />
          <canvas ref={canvasRef} className="hidden" />
          <div className="absolute bottom-8 flex items-center gap-8">
            <button
              onClick={handleCapture}
              className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl transform transition-transform hover:scale-110"
              aria-label="Capture photo"
            >
              <div className="w-20 h-20 bg-white rounded-full border-4 border-brand-blue"></div>
            </button>
            <button
              onClick={closeCamera}
              className="absolute -right-24 text-white text-lg bg-red-600 hover:bg-red-700 rounded-full px-4 py-2"
              aria-label="Close camera"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScanPage;