
import { FoodNutrition, HealthCondition, Suitability } from '../types';

interface SuitabilityResult {
    suitability: Suitability;
    message: string;
    reason: string;
}

// Thresholds for health conditions
const thresholds = {
    diabetes: { sugar: { moderate: 10, avoid: 20 } },
    hypertension: { salt: { moderate: 3, avoid: 5 } },
    'high-cholesterol': { fat: { moderate: 10, avoid: 20 } },
};

export const checkFoodSuitability = (food: FoodNutrition, condition: HealthCondition): SuitabilityResult => {
    if (condition === 'none') {
        return { 
            suitability: 'safe', 
            message: 'Safe to eat!',
            reason: food.notes || 'This seems like a healthy choice.'
        };
    }
    
    let issue = '';
    let level: 'moderate' | 'avoid' | 'safe' = 'safe';
    
    if (condition === 'diabetes') {
        if (food.sugar > thresholds.diabetes.sugar.avoid) level = 'avoid';
        else if (food.sugar > thresholds.diabetes.sugar.moderate) level = 'moderate';
        issue = 'sugar';
    } else if (condition === 'hypertension') {
        if (food.salt > thresholds.hypertension.salt.avoid) level = 'avoid';
        else if (food.salt > thresholds.hypertension.salt.moderate) level = 'moderate';
        issue = 'salt';
    } else if (condition === 'high-cholesterol') {
        if (food.fat > thresholds['high-cholesterol'].fat.avoid) level = 'avoid';
        else if (food.fat > thresholds['high-cholesterol'].fat.moderate) level = 'moderate';
        issue = 'fat';
    }

    if (level === 'safe') {
        return {
            suitability: 'safe',
            message: 'Safe to eat!',
            reason: `This food is suitable for your condition. ${food.notes || ''}`
        };
    }
    if (level === 'moderate') {
        return {
            suitability: 'moderate',
            message: 'Eat in moderation.',
            reason: `This food has a moderate amount of ${issue}. Occasional consumption should be okay.`
        };
    }
    // level === 'avoid'
    return {
        suitability: 'avoid',
        message: 'Not recommended.',
        reason: `This food is very high in ${issue}, which is not suitable for your condition.`
    };
};
