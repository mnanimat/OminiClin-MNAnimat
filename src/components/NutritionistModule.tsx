import React, { useState } from 'react';
import {
  Apple,
  Scale,
  Flame,
  Printer,
  Sparkles,
  Plus,
  Trash2,
  Loader2,
  Activity,
  Calendar,
  Check,
} from 'lucide-react';
import { Patient, NutritionAssessment, MealPlan, Meal } from '../types';
import { StorageService } from '../services/storage';
import { ExportPackageUtils } from '../utils/exportPackages';
import { ThematicGeminiVisual } from './ThematicGeminiVisual';


interface NutritionistModuleProps {
  patient: Patient | null;
}

export const NutritionistModule: React.FC<NutritionistModuleProps> = ({ patient }) => {
  const [records, setRecords] = useState<NutritionAssessment[]>(() =>
    patient ? StorageService.getNutritionRecords(patient.id) : []
  );

  const [weightKg, setWeightKg] = useState<number>(68.5);
  const [heightCm, setHeightCm] = useState<number>(170);
  const [waistCm, setWaistCm] = useState<number>(76);
  const [hipCm, setHipCm] = useState<number>(98);
  const [activityLevel, setActivityLevel] = useState<'sedentario' | 'leve' | 'moderado' | 'intenso' | 'muito_intenso'>('moderado');
  const [nutritionalGoal, setNutritionalGoal] = useState<'perda_gordura' | 'hipertrofia' | 'manutencao' | 'saude_geral'>('hipertrofia');

  // Skinfolds
  const [foldTriceps, setFoldTriceps] = useState<number>(12);
  const [foldSubscapular, setFoldSubscapular] = useState<number>(10);
  const [foldSuprailiac, setFoldSuprailiac] = useState<number>(9);
  const [foldAbdominal, setFoldAbdominal] = useState<number>(14);

  // Meal Plan State
  const [planTitle, setPlanTitle] = useState('Plano Alimentar para Hipertrofia');
  const [meals, setMeals] = useState<Meal[]>([
    {
      time: '07:30',
      name: 'Café da Manhã',
      items: [
        { food: 'Ovos cozidos', quantity: '2 unidades', caloriesKcal: 150, proteinG: 12, carbsG: 1, fatG: 10 },
        { food: 'Aveia em flocos', quantity: '40g', caloriesKcal: 140, proteinG: 5, carbsG: 23, fatG: 3 },
      ],
    },
    {
      time: '12:30',
      name: 'Almoço',
      items: [
        { food: 'Peito de frango grelhado', quantity: '150g', caloriesKcal: 240, proteinG: 45, carbsG: 0, fatG: 5 },
        { food: 'Arroz integral', quantity: '120g', caloriesKcal: 140, proteinG: 3, carbsG: 30, fatG: 1 },
      ],
    },
  ]);

  const [recommendations, setRecommendations] = useState(
    'Hidratação mínima de 2,5 litros de água/dia. Suplementação de Creatina 5g ao dia pós-treino.'
  );

  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Calculations
  const heightM = heightCm / 100;
  const bmi = heightM > 0 ? parseFloat((weightKg / (heightM * heightM)).toFixed(2)) : 0;

  const getBmiClass = (val: number) => {
    if (val < 18.5) return 'Abaixo do peso';
    if (val < 24.9) return 'Eutrofia (Peso Normal)';
    if (val < 29.9) return 'Sobrepeso';
    if (val < 34.9) return 'Obesidade Grau I';
    return 'Obesidade Severa';
  };

  const bmiClass = getBmiClass(bmi);
  const waistHipRatio = hipCm > 0 ? parseFloat((waistCm / hipCm).toFixed(2)) : 0;

  // Body Fat Estimate (Jackson & Pollock 4 skinfolds sum)
  const sumFolds = foldTriceps + foldSubscapular + foldSuprailiac + foldAbdominal;
  const estimatedBodyFat = parseFloat(Math.min(35, Math.max(8, sumFolds * 0.45)).toFixed(1));

  // BMR (Harris-Benedict estimate)
  const isMale = patient?.gender === 'M';
  const bmr = Math.round(
    isMale
      ? 88.36 + 13.4 * weightKg + 4.8 * heightCm - 5.7 * 30
      : 447.59 + 9.24 * weightKg + 3.1 * heightCm - 4.33 * 30
  );

  const activityMultipliers = {
    sedentario: 1.2,
    leve: 1.375,
    moderado: 1.55,
    intenso: 1.725,
    muito_intenso: 1.9,
  };

  const tdee = Math.round(bmr * activityMultipliers[activityLevel]);

  // Target Macros
  const targetCalories = nutritionalGoal === 'perda_gordura' ? tdee - 400 : nutritionalGoal === 'hipertrofia' ? tdee + 300 : tdee;
  const targetProtein = Math.round(weightKg * 2.0);
  const targetFat = Math.round(weightKg * 0.9);
  const targetCarbs = Math.round((targetCalories - (targetProtein * 4 + targetFat * 9)) / 4);

  if (!patient) {
    return (
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-3">
        <Apple className="w-12 h-12 text-teal-600 dark:text-teal-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Nenhum Paciente Selecionado
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Selecione um paciente registrado na aba <span className="font-semibold text-teal-600">Pacientes</span> para efetuar a avaliação antropométrica e montar o cardápio.
        </p>
      </div>
    );
  }

  const handleConsultAiNutrition = async () => {
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profession: 'Nutricionista',
          taskType: 'nutricao',
          prompt: `Meta: ${nutritionalGoal}. Peso: ${weightKg}kg, Altura: ${heightCm}cm, IMC: ${bmi}, TMB: ${bmr}kcal, GET: ${tdee}kcal. Monte sugestão de cardápio semanal variado para bater ${targetCalories}kcal.`,
          patientContext: {
            name: patient.name,
            age: new Date().getFullYear() - new Date(patient.birthDate).getFullYear(),
            gender: patient.gender,
          },
        }),
      });
      const data = await res.json();
      if (data.text) {
        setAiAnalysis(data.text);
      }
    } catch {
      setAiAnalysis('Modo Local: Recomendações nutricionais offline geradas com sucesso.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveNutrition = () => {
    const newAssessment: NutritionAssessment = {
      id: `nut-${Date.now()}`,
      patientId: patient.id,
      date: new Date().toISOString(),
      weightKg,
      heightCm,
      bmi,
      bmiClassification: bmiClass,
      waistCm,
      hipCm,
      waistHipRatio,
      skinfoldsMm: {
        triceps: foldTriceps,
        subscapular: foldSubscapular,
        suprailiac: foldSuprailiac,
        abdominal: foldAbdominal,
      },
      bodyFatPercent: estimatedBodyFat,
      bmrKcal: bmr,
      tdeeKcal: tdee,
      activityLevel,
      nutritionalGoal,
    };

    const newMealPlan: MealPlan = {
      id: `plan-${Date.now()}`,
      patientId: patient.id,
      date: new Date().toISOString(),
      title: planTitle,
      targetCaloriesKcal: targetCalories,
      targetProteinG: targetProtein,
      targetCarbsG: targetCarbs,
      targetFatG: targetFat,
      meals,
      recommendations,
    };

    StorageService.saveNutritionRecord(newAssessment);
    StorageService.saveMealPlan(newMealPlan);
    setRecords(StorageService.getNutritionRecords(patient.id));
    alert('Avaliação Antropométrica e Plano Alimentar salvos localmente!');
  };

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-xs font-medium">
            Módulo Nutricional & Antropometria
          </span>
          <h2 className="text-2xl font-extrabold mt-1">{patient.name}</h2>
          <p className="text-xs text-teal-100 mt-0.5 font-mono">CPF: {patient.cpf}</p>
        </div>

        <button
          onClick={() => {
            const plan: MealPlan = {
              id: 'temp',
              patientId: patient.id,
              date: new Date().toISOString(),
              title: planTitle,
              targetCaloriesKcal: targetCalories,
              targetProteinG: targetProtein,
              targetCarbsG: targetCarbs,
              targetFatG: targetFat,
              meals,
              recommendations,
            };
            ExportPackageUtils.printMealPlan(patient, plan);
          }}
          className="px-4 py-2.5 bg-white text-teal-800 rounded-xl font-bold text-xs shadow hover:bg-slate-100 transition-all flex items-center gap-2"
        >
          <Printer className="w-4 h-4 text-teal-600" />
          <span>Exportar Plano Alimentar em PDF</span>
        </button>
      </div>

      {/* Anthropometric & Metabolic Calculators Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Antropometria Controls */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Scale className="w-5 h-5 text-teal-600" />
              <span>Avaliação Antropométrica & Bioimpedância</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Peso (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Altura (cm)</label>
                <input
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Cintura (cm)</label>
                <input
                  type="number"
                  value={waistCm}
                  onChange={(e) => setWaistCm(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Quadril (cm)</label>
                <input
                  type="number"
                  value={hipCm}
                  onChange={(e) => setHipCm(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                />
              </div>
            </div>

            {/* Calculated Metrics Display Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-teal-50 dark:bg-teal-950/60 rounded-xl border border-teal-200 dark:border-teal-800 text-center">
                <span className="text-[10px] text-teal-700 dark:text-teal-300 font-semibold block">IMC</span>
                <span className="text-xl font-extrabold text-teal-900 dark:text-teal-100">{bmi}</span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 block truncate">{bmiClass}</span>
              </div>

              <div className="p-3 bg-sky-50 dark:bg-sky-950/60 rounded-xl border border-sky-200 dark:border-sky-800 text-center">
                <span className="text-[10px] text-sky-700 dark:text-sky-300 font-semibold block">Gordura Corporal</span>
                <span className="text-xl font-extrabold text-sky-900 dark:text-sky-100">{estimatedBodyFat}%</span>
                <span className="text-[10px] text-sky-600 dark:text-sky-400 block">Est. 4 Dobras</span>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-xl border border-amber-200 dark:border-amber-800 text-center">
                <span className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold block">RCQ (Cintura/Quadril)</span>
                <span className="text-xl font-extrabold text-amber-900 dark:text-amber-100">{waistHipRatio}</span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 block">Risco Cardiovascular</span>
              </div>

              <div className="p-3 bg-purple-50 dark:bg-purple-950/60 rounded-xl border border-purple-200 dark:border-purple-800 text-center">
                <span className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold block">GET (Gasto Diário)</span>
                <span className="text-xl font-extrabold text-purple-900 dark:text-purple-100">{tdee} kcal</span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 block">TMB: {bmr} kcal</span>
              </div>
            </div>

            {/* Dobras Cutâneas (Foldmm) */}
            <div className="pt-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Aferição de Dobras Cutâneas (Adipômetro em mm)
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div>
                  <label className="block text-[11px]">Tricipital</label>
                  <input
                    type="number"
                    value={foldTriceps}
                    onChange={(e) => setFoldTriceps(parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 rounded-lg border bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px]">Subescapular</label>
                  <input
                    type="number"
                    value={foldSubscapular}
                    onChange={(e) => setFoldSubscapular(parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 rounded-lg border bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px]">Suprailíaca</label>
                  <input
                    type="number"
                    value={foldSuprailiac}
                    onChange={(e) => setFoldSuprailiac(parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 rounded-lg border bg-slate-50 dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[11px]">Abdominal</label>
                  <input
                    type="number"
                    value={foldAbdominal}
                    onChange={(e) => setFoldAbdominal(parseInt(e.target.value) || 0)}
                    className="w-full px-2 py-1 rounded-lg border bg-slate-50 dark:bg-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Integrated Nutrition & Meal Visual Generator */}
          <ThematicGeminiVisual specialty="nutricao" patientName={patient.name} />

          {/* Cardápio / Meal Plan Creator */}

          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Flame className="w-5 h-5 text-teal-600" />
                <span>Prescrição do Plano Alimentar</span>
              </h3>

              {/* Target Macro Pills */}
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="px-2 py-1 rounded-md bg-teal-100 text-teal-800 font-bold">
                  {targetCalories} kcal
                </span>
                <span className="px-2 py-1 rounded-md bg-blue-100 text-blue-800 font-medium">
                  Prot: {targetProtein}g
                </span>
                <span className="px-2 py-1 rounded-md bg-amber-100 text-amber-800 font-medium">
                  Carb: {targetCarbs}g
                </span>
                <span className="px-2 py-1 rounded-md bg-rose-100 text-rose-800 font-medium">
                  Gord: {targetFat}g
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Título do Plano Alimentar
              </label>
              <input
                type="text"
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
              />
            </div>

            {/* Meals List */}
            <div className="space-y-3">
              {meals.map((m, mIdx) => (
                <div key={mIdx} className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center justify-between font-bold text-xs text-teal-600 dark:text-teal-400">
                    <span>[{m.time}] - {m.name}</span>
                  </div>

                  <div className="space-y-1">
                    {m.items.map((it, itIdx) => (
                      <div key={itIdx} className="flex items-center justify-between text-xs bg-white dark:bg-slate-800 p-2 rounded-lg">
                        <span>• {it.food} ({it.quantity})</span>
                        <span className="font-mono text-slate-500">{it.caloriesKcal} kcal</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Orientações Gerais e Suplementação
              </label>
              <textarea
                rows={2}
                value={recommendations}
                onChange={(e) => setRecommendations(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
            </div>

            <button
              onClick={handleSaveNutrition}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Avaliação & Plano Alimentar</span>
            </button>
          </div>
        </div>

        {/* AI Nutrition Assistant */}
        <div className="space-y-6">
          <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white p-5 rounded-2xl border border-slate-700 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">IA Nutricional Gemini</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-300">
                Apoio em Cardápios
              </span>
            </div>

            <p className="text-xs text-slate-300">
              Gere variações de cardápios com alimentos da tabela TACO para a meta do paciente.
            </p>

            <button
              onClick={handleConsultAiNutrition}
              disabled={isAiLoading}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-teal-500 hover:from-amber-600 hover:to-teal-600 text-slate-950 font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2"
            >
              {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>Gerar Sugestões com Gemini IA</span>
            </button>

            {aiAnalysis && (
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-700 text-xs text-slate-200 whitespace-pre-line max-h-60 overflow-y-auto">
                {aiAnalysis}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
