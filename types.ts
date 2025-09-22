
export type Page = 'home' | 'scan' | 'about';
export type ScanMode = 'prescription' | 'medicine' | 'food';

export interface MedicineInfo {
  name: string;
  dosage: string;
  frequency: number;
  timing: ('morning' | 'afternoon' | 'night')[];
}

export type ScannedMedicine = Pick<MedicineInfo, 'name' | 'dosage'>;

export interface LargeButtonProps {
  onClick: () => void;
  emoji: string;
  title: string;
  description: string;
  className?: string;
}

// New types for Food Scanner
// FIX: Define HealthCondition and Suitability types used in foodLogic.ts and HealthConditionSelector.tsx.
export type HealthCondition = 'diabetes' | 'hypertension' | 'high-cholesterol' | 'none';
export type Suitability = 'safe' | 'moderate' | 'avoid';

export interface FoodNutrition {
  sugar: number;
  fat: number;
  protein: number;
  // FIX: Add salt property for hypertension check in foodLogic.ts.
  salt: number;
  notes?: string;
}