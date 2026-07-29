export type ProfessionalProfile = 'medico' | 'dentista' | 'nutricionista';

export interface Patient {
  id: string;
  name: string;
  cpf: string;
  birthDate: string;
  gender: 'M' | 'F' | 'Outro';
  phone: string;
  email: string;
  address: string;
  allergies: string[];
  continuousMeds: string[];
  notes: string;
  consentLgpd: boolean;
  consentTimestamp: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  mainComplaint: string;
  historyPresentIllness: string;
  familyHistory: string;
  vitalSigns: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    oxygenSat: string;
    weight: string;
  };
  physicalExam: string;
  icd10Code: string;
  icd10Description: string;
  diagnosis: string;
  prescriptions: PrescriptionItem[];
  attestationDays?: number;
  attestationReason?: string;
  examRequests?: string[];
  aiNotes?: string;
}

export interface PrescriptionItem {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export type ToothStatus = 'saudavel' | 'carie' | 'restaurado' | 'canal' | 'implante' | 'ausente' | 'protese';

export interface ToothData {
  toothNumber: number; // 11-18, 21-28, 31-38, 41-48, 51-55, 61-65, 71-75, 81-85
  status: ToothStatus;
  surfaces?: {
    mesial: boolean;
    distal: boolean;
    occlusal: boolean;
    buccal: boolean;
    lingual: boolean;
  };
  notes?: string;
  treatmentPlanned?: string;
  cost?: number;
}

export interface DentalRecord {
  id: string;
  patientId: string;
  date: string;
  chiefComplaint: string;
  teeth: Record<number, ToothData>;
  periodontalStatus: 'normal' | 'gingivite' | 'periodontite_leve' | 'periodontite_severa';
  proceduresDone: string[];
  prescriptions: PrescriptionItem[];
  nextAppointment?: string;
  aiNotes?: string;
}

export interface NutritionAssessment {
  id: string;
  patientId: string;
  date: string;
  weightKg: number;
  heightCm: number;
  bmi: number;
  bmiClassification: string;
  waistCm: number;
  hipCm: number;
  waistHipRatio: number;
  skinfoldsMm?: {
    triceps: number;
    subscapular: number;
    suprailiac: number;
    abdominal: number;
  };
  bodyFatPercent: number;
  muscleMassKg?: number;
  bmrKcal: number; // Taxa Metabólica Basal
  tdeeKcal: number; // Gasto Energético Total
  activityLevel: 'sedentario' | 'leve' | 'moderado' | 'intenso' | 'muito_intenso';
  nutritionalGoal: 'perda_gordura' | 'hipertrofia' | 'manutencao' | 'saude_geral';
}

export interface Meal {
  time: string;
  name: string;
  items: {
    food: string;
    quantity: string;
    caloriesKcal: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
  }[];
}

export interface MealPlan {
  id: string;
  patientId: string;
  date: string;
  title: string;
  targetCaloriesKcal: number;
  targetProteinG: number;
  targetCarbsG: number;
  targetFatG: number;
  meals: Meal[];
  recommendations: string;
}

export interface GeneratedImageRecord {
  id: string;
  prompt: string;
  imageUrl: string;
  category: string;
  createdAt: string;
  aspectRatio: string;
}

export type FinancialCategory =
  | 'consulta_medica'
  | 'procedimento_odonto'
  | 'avaliacao_nutri'
  | 'retorno'
  | 'aluguel_local'
  | 'equipamentos'
  | 'suprimentos'
  | 'sistemas_software'
  | 'impostos_taxas'
  | 'outros';

export type PaymentMethod = 'pix' | 'cartao_credito' | 'cartao_debito' | 'dinheiro' | 'convenio' | 'transferencia';

export interface FinancialTransaction {
  id: string;
  patientId?: string;
  patientName?: string;
  type: 'receita' | 'despesa';
  amount: number;
  category: FinancialCategory;
  categoryLabel: string;
  specialty: ProfessionalProfile | 'clinica_geral';
  description: string;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  status: 'concluido' | 'pendente' | 'cancelado';
  createdAt: string;
}
