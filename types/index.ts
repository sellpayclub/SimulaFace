// User Profile
export interface Profile {
  id: string;
  nome: string | null;
  clinica: string | null;
  plano: 'free' | 'pro' | 'enterprise';
  simulacoes_restantes: number;
  stripe_customer_id: string | null;
  created_at: string;
}

// Facial Adjustment Types
export type AdjustmentArea = 
  | 'testa'
  | 'olhos'
  | 'nariz'
  | 'boca'
  | 'sulco_nasogeniano'
  | 'maca_rosto'
  | 'queixo'
  | 'mandibula'
  | 'pescoco'
  | 'bigode';

export interface AdjustmentOption {
  id: string;
  label: string;
  promptKey: string;
}

export interface FacialArea {
  id: AdjustmentArea;
  label: string;
  icon: string;
  options: AdjustmentOption[];
}

export interface AdjustmentValue {
  areaId: AdjustmentArea;
  optionId: string;
  intensity: number; // 0-100
  enabled: boolean;
}

export interface AdjustmentsState {
  [key: string]: AdjustmentValue;
}

// Simulation
export interface Simulacao {
  id: string;
  user_id: string;
  fotos_originais: string[];
  foto_resultado: string | null;
  ajustes: AdjustmentsState;
  prompt_usado: string | null;
  created_at: string;
}

// Subscription
export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string | null;
  status: 'active' | 'canceled' | 'past_due' | 'trialing' | 'unpaid';
  plano: string;
  current_period_end: string | null;
  created_at: string;
}

// Photo Capture
export interface CapturedPhoto {
  id: string;
  dataUrl: string;
  type: 'frente' | 'esquerda' | 'direita' | 'uploaded';
  timestamp: number;
}

// fal.ai Response
export interface FalImage {
  url: string;
  content_type?: string;
  file_name?: string;
  file_size?: number;
  width?: number;
  height?: number;
}

export interface FalResponse {
  images: FalImage[];
  seed: number;
  prompt: string;
}

// Gender type
export type Gender = 'masculino' | 'feminino' | null;

// Store Types
export interface SimulationStore {
  photos: CapturedPhoto[];
  adjustments: AdjustmentsState;
  resultImage: string | null;
  isProcessing: boolean;
  currentStep: 'capture' | 'adjustments' | 'processing' | 'result';
  gender: Gender;
  
  // Actions
  addPhoto: (photo: CapturedPhoto) => void;
  removePhoto: (id: string) => void;
  clearPhotos: () => void;
  setAdjustment: (key: string, value: AdjustmentValue) => void;
  clearAdjustments: () => void;
  setResultImage: (url: string | null) => void;
  setIsProcessing: (processing: boolean) => void;
  setCurrentStep: (step: SimulationStore['currentStep']) => void;
  setGender: (gender: Gender) => void;
  reset: () => void;
}

