import { FoodNutrition } from '../types';

// FIX: Added salt property to food items to support hypertension checks.
export const foodDatabase: { [key: string]: FoodNutrition } = {
  "apple": { sugar: 19, fat: 0.3, protein: 0.5, salt: 0, notes: "Apples are a good source of fiber and vitamin C." },
  "banana": { sugar: 28, fat: 0.4, protein: 1.3, salt: 0, notes: "Bananas are rich in potassium." },
  "biscuit": { sugar: 5, fat: 4, protein: 1, salt: 0.5, notes: "Often high in refined flour and sugar. Per single biscuit." },
  "chips": { sugar: 0.5, fat: 10, protein: 2, salt: 4, notes: "Typically high in fat and salt. Per small bag." },
  "milk": { sugar: 12, fat: 8, protein: 8, salt: 0.2, notes: "A good source of calcium and protein. Per cup." }
};


export const recognizableFoods = Object.keys(foodDatabase);