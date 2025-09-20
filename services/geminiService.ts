
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { MedicineInfo } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const medicineSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: 'Name of the medicine.' },
        dosage: { type: Type.STRING, description: 'Dosage strength, e.g., "500 mg".' },
        frequency: { type: Type.INTEGER, description: 'Number of times to take per day.' },
        timing: { 
            type: Type.ARRAY, 
            description: 'Timings to take the medicine.',
            items: { 
                type: Type.STRING,
                enum: ['morning', 'afternoon', 'night']
            }
        },
    }
};

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

export const analyzePrescription = async (file: File): Promise<MedicineInfo[]> => {
    const imagePart = await fileToGenerativePart(file);
    
    const prompt = `
        You are an expert OCR system for medical prescriptions. Analyze the provided image of a prescription.
        Extract all medications listed. For each medication, identify its name, dosage (including units like 'mg'), 
        frequency (how many times a day, e.g., 1, 2, 3), and timing (determine if it is for morning, afternoon, or night based on instructions).
        Ignore any non-medication text. Provide the output as a JSON array of objects. If no medicines are found, return an empty array.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: medicineSchema
                },
            },
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error analyzing prescription:", error);
        throw new Error("Failed to analyze prescription. The AI model could not process the image.");
    }
};


export const recognizeMedicine = async (file: File): Promise<MedicineInfo[]> => {
    const imagePart = await fileToGenerativePart(file);
    
    const prompt = `
        You are an expert at identifying common medicines. Analyze the provided image of a medicine strip or bottle. 
        Identify the medicine from the following list: Paracetamol (Dolo-650), Metformin (Glycomet 500), Amlodipine (Amlopres 5), 
        Atorvastatin (Atorva 10), Omeprazole (Omez 20), Cetirizine (Cetzine 10), Amoxicillin (Mox 500), Aspirin (Ecosprin 75).
        Extract the medicine name, its dosage, a recommended frequency of 1, and a recommended timing of 'morning'. 
        Provide the output as a JSON array containing a single object. If you cannot identify the medicine from the list, return an empty array.
    `;
    
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: medicineSchema
                },
            },
        });
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error recognizing medicine:", error);
        throw new Error("Failed to recognize medicine. The AI model could not identify the item.");
    }
};
