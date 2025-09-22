
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { MedicineInfo, ScannedMedicine } from '../types';
import { recognizableFoods } from '../data/foodData';

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

const scannedMedicineSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING, description: 'Name of the medicine.' },
        dosage: { type: Type.STRING, description: 'Dosage strength, e.g., "500 mg".' },
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


export const recognizeMedicine = async (file: File): Promise<ScannedMedicine[]> => {
    const imagePart = await fileToGenerativePart(file);
    
    const prompt = `
        You are an expert at identifying medicines from images. Analyze the provided image of a medicine strip or bottle.
        Extract the medicine name and its dosage.
        Provide the output as a JSON array containing a single object. If you cannot identify the medicine, return an empty array.
    `;
    
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: scannedMedicineSchema
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

export const recognizeFood = async (file: File): Promise<{ foodName: string } | null> => {
    const imagePart = await fileToGenerativePart(file);

    const prompt = `
        You are an expert at identifying common food items from an image.
        Analyze the provided image and identify the main food item.
        The food must be one of the following: ${recognizableFoods.join(', ')}.
        If you recognize a food from the list, respond with its name in lowercase.
        For example, if you see an Apple, respond with "apple".
        Provide the output as a JSON object with a single key "foodName".
        If you cannot confidently identify a food from the list, return a JSON object with "foodName" as null.
    `;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, { text: prompt }] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        foodName: { 
                            type: Type.STRING,
                            nullable: true,
                            description: `The name of the identified food item from the provided list, or null if not identifiable. Must be lowercase.`
                        }
                    },
                },
            },
        });
        const jsonStr = response.text.trim();
        const result = JSON.parse(jsonStr);
        if (result && (typeof result.foodName === 'string' || result.foodName === null)) {
            return result.foodName ? { foodName: result.foodName.toLowerCase() } : null;
        }
        return null;
    } catch (error) {
        console.error("Error recognizing food:", error);
        throw new Error("Failed to recognize food. The AI model could not identify the item.");
    }
};
