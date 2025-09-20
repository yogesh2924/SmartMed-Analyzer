
export type Page = 'home' | 'scan' | 'about';
export type ScanMode = 'prescription' | 'medicine';

export interface MedicineInfo {
  name: string;
  dosage: string;
  frequency: number;
  timing: ('morning' | 'afternoon' | 'night')[];
}

export interface LargeButtonProps {
  onClick: () => void;
  emoji: string;
  title: string;
  description: string;
  className?: string;
}
