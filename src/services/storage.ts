import {
  Patient,
  MedicalRecord,
  DentalRecord,
  NutritionAssessment,
  MealPlan,
  GeneratedImageRecord,
  ToothData,
  FinancialTransaction,
} from '../types';

const STORAGE_KEYS = {
  PATIENTS: 'omniclin_patients_v2',
  MEDICAL_RECORDS: 'omniclin_medical_records_v1',
  DENTAL_RECORDS: 'omniclin_dental_records_v1',
  NUTRITION_RECORDS: 'omniclin_nutrition_records_v1',
  MEAL_PLANS: 'omniclin_meal_plans_v1',
  GENERATED_IMAGES: 'omniclin_generated_images_v1',
  FINANCIAL_TRANSACTIONS: 'omniclin_financial_transactions_v1',
  THEME: 'omniclin_theme_preference',
  ACTIVE_PROFESSION: 'omniclin_active_profession',
};

const INITIAL_FINANCIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'fin-001',
    patientId: 'pat-001',
    patientName: 'Nº 1001 - Paciente 1',
    type: 'receita',
    amount: 350.0,
    category: 'consulta_medica',
    categoryLabel: 'Consulta Médica',
    specialty: 'medico',
    description: 'Atendimento clínico geral e prescrição',
    date: '2026-07-02',
    paymentMethod: 'pix',
    status: 'concluido',
    createdAt: '2026-07-02T10:30:00.000Z',
  },
  {
    id: 'fin-002',
    patientId: 'pat-002',
    patientName: 'Nº 1002 - Paciente 2',
    type: 'receita',
    amount: 1200.0,
    category: 'procedimento_odonto',
    categoryLabel: 'Tratamento Canal & Restauração',
    specialty: 'dentista',
    description: 'Tratamento endodôntico dente 16',
    date: '2026-07-05',
    paymentMethod: 'cartao_credito',
    status: 'concluido',
    createdAt: '2026-07-05T14:15:00.000Z',
  },
  {
    id: 'fin-003',
    patientId: 'pat-003',
    patientName: 'Nº 1003 - Paciente 3',
    type: 'receita',
    amount: 280.0,
    category: 'avaliacao_nutri',
    categoryLabel: 'Avaliação Nutricional Completa',
    specialty: 'nutricionista',
    description: 'Bioimpedância e plano alimentar individualizado',
    date: '2026-07-10',
    paymentMethod: 'pix',
    status: 'concluido',
    createdAt: '2026-07-10T09:00:00.000Z',
  },
  {
    id: 'fin-004',
    type: 'despesa',
    amount: 1800.0,
    category: 'aluguel_local',
    categoryLabel: 'Aluguel do Consultório',
    specialty: 'clinica_geral',
    description: 'Aluguel mensal sala comercial clínica',
    date: '2026-07-01',
    paymentMethod: 'transferencia',
    status: 'concluido',
    createdAt: '2026-07-01T08:00:00.000Z',
  },
  {
    id: 'fin-005',
    type: 'despesa',
    amount: 450.0,
    category: 'suprimentos',
    categoryLabel: 'Insumos Médicos e Odontológicos',
    specialty: 'clinica_geral',
    description: 'Compra de luvas, máscaras, anestésicos e resinas',
    date: '2026-07-08',
    paymentMethod: 'cartao_debito',
    status: 'concluido',
    createdAt: '2026-07-08T11:20:00.000Z',
  },
  {
    id: 'fin-006',
    patientId: 'pat-001',
    patientName: 'Nº 1001 - Paciente 1',
    type: 'receita',
    amount: 420.0,
    category: 'consulta_medica',
    categoryLabel: 'Consulta Endocrinológica',
    specialty: 'medico',
    description: 'Reavaliação exames de sangue e tireoide',
    date: '2026-06-12',
    paymentMethod: 'cartao_credito',
    status: 'concluido',
    createdAt: '2026-06-12T15:00:00.000Z',
  },
  {
    id: 'fin-007',
    patientId: 'pat-002',
    patientName: 'Nº 1002 - Paciente 2',
    type: 'receita',
    amount: 2500.0,
    category: 'procedimento_odonto',
    categoryLabel: 'Implante Dentário',
    specialty: 'dentista',
    description: 'Pino de titânio + coroa de porcelana dente 36',
    date: '2026-06-20',
    paymentMethod: 'cartao_credito',
    status: 'concluido',
    createdAt: '2026-06-20T16:30:00.000Z',
  },
  {
    id: 'fin-008',
    patientId: 'pat-003',
    patientName: 'Nº 1003 - Paciente 3',
    type: 'receita',
    amount: 200.0,
    category: 'retorno',
    categoryLabel: 'Retorno Nutricional',
    specialty: 'nutricionista',
    description: 'Ajuste de macros e dobras cutâneas',
    date: '2026-06-25',
    paymentMethod: 'pix',
    status: 'concluido',
    createdAt: '2026-06-25T10:00:00.000Z',
  },
  {
    id: 'fin-009',
    type: 'despesa',
    amount: 320.0,
    category: 'sistemas_software',
    categoryLabel: 'Licenças e Software Médico',
    specialty: 'clinica_geral',
    description: 'Manutenção do sistema local OmniClin',
    date: '2026-07-15',
    paymentMethod: 'pix',
    status: 'concluido',
    createdAt: '2026-07-15T12:00:00.000Z',
  },
  {
    id: 'fin-010',
    patientId: 'pat-001',
    patientName: 'Nº 1001 - Paciente 1',
    type: 'receita',
    amount: 300.0,
    category: 'consulta_medica',
    categoryLabel: 'Consulta de Rotina Medicina',
    specialty: 'medico',
    description: 'Acompanhamento preventivo',
    date: '2026-05-18',
    paymentMethod: 'dinheiro',
    status: 'concluido',
    createdAt: '2026-05-18T11:00:00.000Z',
  },
  {
    id: 'fin-011',
    patientId: 'pat-002',
    patientName: 'Nº 1002 - Paciente 2',
    type: 'receita',
    amount: 450.0,
    category: 'procedimento_odonto',
    categoryLabel: 'Limpeza e Profilaxia Odonto',
    specialty: 'dentista',
    description: 'Raspagem tartárica e aplicação de flúor',
    date: '2026-05-22',
    paymentMethod: 'pix',
    status: 'concluido',
    createdAt: '2026-05-22T14:00:00.000Z',
  },
  {
    id: 'fin-012',
    type: 'despesa',
    amount: 1800.0,
    category: 'aluguel_local',
    categoryLabel: 'Aluguel do Consultório - Junho',
    specialty: 'clinica_geral',
    description: 'Pagamento aluguel sala comercial',
    date: '2026-06-01',
    paymentMethod: 'transferencia',
    status: 'concluido',
    createdAt: '2026-06-01T08:00:00.000Z',
  },
];

// Initial Sample Patients with Fictional Identifiers (LGPD compliant)
const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-001',
    name: 'Nº 1001 - Paciente 1',
    cpf: 'CPF FICTÍCIO (000.000.000-00)',
    birthDate: '1992-05-14',
    gender: 'F',
    phone: 'TELEFONE FICTÍCIO (00) 00000-0000',
    email: 'paciente1@exemplo-ficticio.com',
    address: 'Rua Fictícia Exemplo, 100 - Cidade Fictícia, SP',
    allergies: ['Dipirona', 'Penicilina'],
    continuousMeds: ['Levotiroxina 50mcg'],
    notes: 'Paciente fictício de demonstração do sistema local.',
    consentLgpd: true,
    consentTimestamp: new Date().toISOString(),
    createdAt: '2026-01-10T10:00:00.000Z',
    updatedAt: '2026-07-20T14:30:00.000Z',
  },
  {
    id: 'pat-002',
    name: 'Nº 1002 - Paciente 2',
    cpf: 'CPF FICTÍCIO (111.111.111-11)',
    birthDate: '1985-11-22',
    gender: 'M',
    phone: 'TELEFONE FICTÍCIO (00) 00000-0000',
    email: 'paciente2@exemplo-ficticio.com',
    address: 'Avenida Fictícia Exemplo, 200 - Cidade Fictícia, RJ',
    allergies: ['Aspirina'],
    continuousMeds: ['Losartana 50mg'],
    notes: 'Paciente fictício de demonstração para odontologia e medicina.',
    consentLgpd: true,
    consentTimestamp: new Date().toISOString(),
    createdAt: '2026-02-15T09:00:00.000Z',
    updatedAt: '2026-07-22T11:15:00.000Z',
  },
  {
    id: 'pat-003',
    name: 'Nº 1003 - Paciente 3',
    cpf: 'CPF FICTÍCIO (222.222.222-22)',
    birthDate: '2001-03-08',
    gender: 'F',
    phone: 'TELEFONE FICTÍCIO (00) 00000-0000',
    email: 'paciente3@exemplo-ficticio.com',
    address: 'Rua Exemplo Demonstrativo, 300 - Cidade Fictícia, MG',
    allergies: [],
    continuousMeds: [],
    notes: 'Paciente fictício de demonstração para plano nutricional.',
    consentLgpd: true,
    consentTimestamp: new Date().toISOString(),
    createdAt: '2026-03-01T16:20:00.000Z',
    updatedAt: '2026-07-25T10:00:00.000Z',
  },
];

const INITIAL_MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: 'med-rec-001',
    patientId: 'pat-001',
    date: '2026-07-20T14:30:00.000Z',
    mainComplaint: 'Cefaleia holocraniana pulsátil há 3 dias acompanhada de náuseas leves.',
    historyPresentIllness: 'Paciente relata início gradual do quadro após período de estresse no trabalho. Sem febre ou déficit focal.',
    familyHistory: 'Mãe com enxaqueca crônica e hipertensão arterial.',
    vitalSigns: {
      bloodPressure: '120/80 mmHg',
      heartRate: '72 bpm',
      temperature: '36.5 °C',
      oxygenSat: '98%',
      weight: '62.5 kg',
    },
    physicalExam: 'Bom estado geral, anictérica, acianótica. Exame neurológico somatossensorial preservado, pares cranianos íntegros.',
    icd10Code: 'G43.0',
    icd10Description: 'Enxaqueca sem aura [enxaqueca comum]',
    diagnosis: 'Cefaleia Tensional x Enxaqueca episódica sem aura.',
    prescriptions: [
      {
        medication: 'Paracetamol 750mg',
        dosage: '1 comprimido',
        frequency: 'de 8 em 8 horas se dor',
        duration: '5 dias',
        instructions: 'Tomar com água após as refeições.',
      },
    ],
    attestationDays: 1,
    attestationReason: 'Repouso médico por quadro de cefaleia intensa.',
    examRequests: ['Hemograma Completo', 'Glicemia de Jejum'],
    aiNotes: 'Orientado higiene do sono e diário da dor.',
  },
];

const createInitialTeeth = (): Record<number, ToothData> => {
  const teeth: Record<number, ToothData> = {};
  const toothNumbers = [
    18, 17, 16, 15, 14, 13, 12, 11,
    21, 22, 23, 24, 25, 26, 27, 28,
    48, 47, 46, 45, 44, 43, 42, 41,
    31, 32, 33, 34, 35, 36, 37, 38,
  ];

  toothNumbers.forEach((num) => {
    teeth[num] = {
      toothNumber: num,
      status: 'saudavel',
    };
  });

  // Sample dental conditions for pat-001
  teeth[16] = { toothNumber: 16, status: 'carie', notes: 'Cárie oclusal rasa' };
  teeth[24] = { toothNumber: 24, status: 'restaurado', notes: 'Restauração de resina comutada' };
  teeth[36] = { toothNumber: 36, status: 'canal', notes: 'Tratamento endodôntico concluído em 2025' };
  teeth[48] = { toothNumber: 48, status: 'ausente', notes: 'Extração de siso indicada e realizada' };

  return teeth;
};

const INITIAL_DENTAL_RECORDS: DentalRecord[] = [
  {
    id: 'den-rec-001',
    patientId: 'pat-001',
    date: '2026-07-21T10:00:00.000Z',
    chiefComplaint: 'Sensibilidade nos dentes do lado direito ao tomar líquidos gelados.',
    teeth: createInitialTeeth(),
    periodontalStatus: 'gingivite',
    proceduresDone: ['Profilaxia ultrassônica', 'Aplicação tópica de flúor'],
    prescriptions: [
      {
        medication: 'Creme Dental Dessensibilizante (Sensodyne Repair & Protect)',
        dosage: 'Escovação 3x ao dia',
        frequency: 'Uso contínuo',
        duration: '30 dias',
        instructions: 'Usar escova com cerdas macias.',
      },
    ],
    nextAppointment: '2026-08-10',
    aiNotes: 'Recomendada restauração estética no elemento 16.',
  },
];

const INITIAL_NUTRITION_RECORDS: NutritionAssessment[] = [
  {
    id: 'nut-rec-001',
    patientId: 'pat-001',
    date: '2026-07-22T09:30:00.000Z',
    weightKg: 62.5,
    heightCm: 165,
    bmi: 22.96,
    bmiClassification: 'Eutrofia (Peso Normal)',
    waistCm: 72,
    hipCm: 98,
    waistHipRatio: 0.73,
    skinfoldsMm: {
      triceps: 14,
      subscapular: 12,
      suprailiac: 10,
      abdominal: 16,
    },
    bodyFatPercent: 22.4,
    muscleMassKg: 24.8,
    bmrKcal: 1380,
    tdeeKcal: 1932,
    activityLevel: 'moderado',
    nutritionalGoal: 'hipertrofia',
  },
];

const INITIAL_MEAL_PLANS: MealPlan[] = [
  {
    id: 'meal-plan-001',
    patientId: 'pat-001',
    date: '2026-07-22T10:00:00.000Z',
    title: 'Plano Alimentar de Manutenção e Definição Muscular',
    targetCaloriesKcal: 1950,
    targetProteinG: 120,
    targetCarbsG: 220,
    targetFatG: 55,
    recommendations: 'Ingerir pelo menos 2,5 litros de água por dia. Evitar açúcar refinado e refrigerantes.',
    meals: [
      {
        time: '07:30',
        name: 'Café da Manhã',
        items: [
          { food: 'Ovos mexidos', quantity: '2 unidades', caloriesKcal: 150, proteinG: 12, carbsG: 1, fatG: 10 },
          { food: 'Pão integral', quantity: '2 fatias', caloriesKcal: 130, proteinG: 5, carbsG: 24, fatG: 2 },
          { food: 'Mamão Papaia', quantity: '1/2 unidade', caloriesKcal: 60, proteinG: 1, carbsG: 15, fatG: 0 },
        ],
      },
      {
        time: '12:30',
        name: 'Almoço',
        items: [
          { food: 'Peito de frango grelhado', quantity: '130g', caloriesKcal: 210, proteinG: 38, carbsG: 0, fatG: 4 },
          { food: 'Arroz integral cozido', quantity: '100g', caloriesKcal: 120, proteinG: 3, carbsG: 25, fatG: 1 },
          { food: 'Feijão preto cozido', quantity: '1 concha (80g)', caloriesKcal: 90, proteinG: 6, carbsG: 16, fatG: 1 },
          { food: 'Salada de folhas verdes e azeite', quantity: 'À vontade + 1 colher chá azeite', caloriesKcal: 50, proteinG: 1, carbsG: 3, fatG: 5 },
        ],
      },
    ],
  },
];

export class StorageService {
  private static getItem<T>(key: string, defaultValue: T): T {
    try {
      const data = localStorage.getItem(key);
      if (!data) return defaultValue;
      return JSON.parse(data) as T;
    } catch {
      return defaultValue;
    }
  }

  private static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Erro ao salvar no LocalStorage [${key}]:`, e);
    }
  }

  // Initialize Storage with Sample Data if empty
  public static initStorage(): void {
    if (!localStorage.getItem(STORAGE_KEYS.PATIENTS)) {
      this.setItem(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.MEDICAL_RECORDS)) {
      this.setItem(STORAGE_KEYS.MEDICAL_RECORDS, INITIAL_MEDICAL_RECORDS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.DENTAL_RECORDS)) {
      this.setItem(STORAGE_KEYS.DENTAL_RECORDS, INITIAL_DENTAL_RECORDS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.NUTRITION_RECORDS)) {
      this.setItem(STORAGE_KEYS.NUTRITION_RECORDS, INITIAL_NUTRITION_RECORDS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.MEAL_PLANS)) {
      this.setItem(STORAGE_KEYS.MEAL_PLANS, INITIAL_MEAL_PLANS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.FINANCIAL_TRANSACTIONS)) {
      this.setItem(STORAGE_KEYS.FINANCIAL_TRANSACTIONS, INITIAL_FINANCIAL_TRANSACTIONS);
    }
  }

  // Financial Transactions
  public static getFinancialTransactions(): FinancialTransaction[] {
    this.initStorage();
    return this.getItem<FinancialTransaction[]>(
      STORAGE_KEYS.FINANCIAL_TRANSACTIONS,
      INITIAL_FINANCIAL_TRANSACTIONS
    );
  }

  public static saveFinancialTransaction(tx: FinancialTransaction): FinancialTransaction {
    const list = this.getFinancialTransactions();
    const idx = list.findIndex((item) => item.id === tx.id);
    if (idx >= 0) {
      list[idx] = tx;
    } else {
      list.unshift(tx);
    }
    this.setItem(STORAGE_KEYS.FINANCIAL_TRANSACTIONS, list);
    return tx;
  }

  public static deleteFinancialTransaction(id: string): void {
    const list = this.getFinancialTransactions().filter((item) => item.id !== id);
    this.setItem(STORAGE_KEYS.FINANCIAL_TRANSACTIONS, list);
  }

  // Patients
  public static getPatients(): Patient[] {
    this.initStorage();
    return this.getItem<Patient[]>(STORAGE_KEYS.PATIENTS, INITIAL_PATIENTS);
  }

  public static savePatient(patient: Patient): Patient {
    const patients = this.getPatients();
    const index = patients.findIndex((p) => p.id === patient.id);
    const updatedPatient = {
      ...patient,
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      patients[index] = updatedPatient;
    } else {
      patients.unshift(updatedPatient);
    }
    this.setItem(STORAGE_KEYS.PATIENTS, patients);
    return updatedPatient;
  }

  public static deletePatient(id: string): void {
    const patients = this.getPatients().filter((p) => p.id !== id);
    this.setItem(STORAGE_KEYS.PATIENTS, patients);
  }

  // Medical Records
  public static getMedicalRecords(patientId?: string): MedicalRecord[] {
    this.initStorage();
    const records = this.getItem<MedicalRecord[]>(STORAGE_KEYS.MEDICAL_RECORDS, INITIAL_MEDICAL_RECORDS);
    if (patientId) return records.filter((r) => r.patientId === patientId);
    return records;
  }

  public static saveMedicalRecord(record: MedicalRecord): MedicalRecord {
    const records = this.getMedicalRecords();
    records.unshift(record);
    this.setItem(STORAGE_KEYS.MEDICAL_RECORDS, records);
    return record;
  }

  // Dental Records
  public static getDentalRecords(patientId?: string): DentalRecord[] {
    this.initStorage();
    const records = this.getItem<DentalRecord[]>(STORAGE_KEYS.DENTAL_RECORDS, INITIAL_DENTAL_RECORDS);
    if (patientId) return records.filter((r) => r.patientId === patientId);
    return records;
  }

  public static saveDentalRecord(record: DentalRecord): DentalRecord {
    const records = this.getDentalRecords();
    records.unshift(record);
    this.setItem(STORAGE_KEYS.DENTAL_RECORDS, records);
    return record;
  }

  // Nutrition Records
  public static getNutritionRecords(patientId?: string): NutritionAssessment[] {
    this.initStorage();
    const records = this.getItem<NutritionAssessment[]>(STORAGE_KEYS.NUTRITION_RECORDS, INITIAL_NUTRITION_RECORDS);
    if (patientId) return records.filter((r) => r.patientId === patientId);
    return records;
  }

  public static saveNutritionRecord(record: NutritionAssessment): NutritionAssessment {
    const records = this.getNutritionRecords();
    records.unshift(record);
    this.setItem(STORAGE_KEYS.NUTRITION_RECORDS, records);
    return record;
  }

  // Meal Plans
  public static getMealPlans(patientId?: string): MealPlan[] {
    this.initStorage();
    const plans = this.getItem<MealPlan[]>(STORAGE_KEYS.MEAL_PLANS, INITIAL_MEAL_PLANS);
    if (patientId) return plans.filter((p) => p.patientId === patientId);
    return plans;
  }

  public static saveMealPlan(plan: MealPlan): MealPlan {
    const plans = this.getMealPlans();
    plans.unshift(plan);
    this.setItem(STORAGE_KEYS.MEAL_PLANS, plans);
    return plan;
  }

  // Generated Images
  public static getGeneratedImages(): GeneratedImageRecord[] {
    return this.getItem<GeneratedImageRecord[]>(STORAGE_KEYS.GENERATED_IMAGES, []);
  }

  public static saveGeneratedImage(img: GeneratedImageRecord): void {
    const images = this.getGeneratedImages();
    images.unshift(img);
    this.setItem(STORAGE_KEYS.GENERATED_IMAGES, images);
  }

  // Theme & Profession Preferences
  public static getTheme(): 'light' | 'dark' {
    return this.getItem<'light' | 'dark'>(STORAGE_KEYS.THEME, 'light');
  }

  public static setTheme(theme: 'light' | 'dark'): void {
    this.setItem(STORAGE_KEYS.THEME, theme);
  }

  public static getActiveProfession(): 'medico' | 'dentista' | 'nutricionista' {
    return this.getItem<'medico' | 'dentista' | 'nutricionista'>(STORAGE_KEYS.ACTIVE_PROFESSION, 'medico');
  }

  public static setActiveProfession(prof: 'medico' | 'dentista' | 'nutricionista'): void {
    this.setItem(STORAGE_KEYS.ACTIVE_PROFESSION, prof);
  }

  // Backup & Import / Export All Data (LGPD compliance)
  public static exportAllDataJSON(): string {
    const data = {
      patients: this.getPatients(),
      medicalRecords: this.getMedicalRecords(),
      dentalRecords: this.getDentalRecords(),
      nutritionRecords: this.getNutritionRecords(),
      mealPlans: this.getMealPlans(),
      generatedImages: this.getGeneratedImages(),
      metadata: {
        exportedAt: new Date().toISOString(),
        system: 'OmniClin',
        author: 'Micael Nildo Oliveira Souza',
        license: 'MIT',
        lgpdCompliant: true,
      },
    };
    return JSON.stringify(data, null, 2);
  }

  public static importAllDataJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.patients && Array.isArray(parsed.patients)) {
        this.setItem(STORAGE_KEYS.PATIENTS, parsed.patients);
      }
      if (parsed.medicalRecords && Array.isArray(parsed.medicalRecords)) {
        this.setItem(STORAGE_KEYS.MEDICAL_RECORDS, parsed.medicalRecords);
      }
      if (parsed.dentalRecords && Array.isArray(parsed.dentalRecords)) {
        this.setItem(STORAGE_KEYS.DENTAL_RECORDS, parsed.dentalRecords);
      }
      if (parsed.nutritionRecords && Array.isArray(parsed.nutritionRecords)) {
        this.setItem(STORAGE_KEYS.NUTRITION_RECORDS, parsed.nutritionRecords);
      }
      if (parsed.mealPlans && Array.isArray(parsed.mealPlans)) {
        this.setItem(STORAGE_KEYS.MEAL_PLANS, parsed.mealPlans);
      }
      return true;
    } catch (e) {
      console.error('Falha ao importar dados JSON:', e);
      return false;
    }
  }

  public static clearAllData(): void {
    localStorage.removeItem(STORAGE_KEYS.PATIENTS);
    localStorage.removeItem(STORAGE_KEYS.MEDICAL_RECORDS);
    localStorage.removeItem(STORAGE_KEYS.DENTAL_RECORDS);
    localStorage.removeItem(STORAGE_KEYS.NUTRITION_RECORDS);
    localStorage.removeItem(STORAGE_KEYS.MEAL_PLANS);
    localStorage.removeItem(STORAGE_KEYS.GENERATED_IMAGES);
  }
}
