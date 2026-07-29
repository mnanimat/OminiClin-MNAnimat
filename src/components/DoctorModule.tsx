import React, { useState } from 'react';
import {
  Stethoscope,
  Plus,
  Trash2,
  Printer,
  Sparkles,
  FileText,
  Activity,
  Award,
  BookOpen,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Patient, MedicalRecord, PrescriptionItem } from '../types';
import { StorageService } from '../services/storage';
import { ExportPackageUtils } from '../utils/exportPackages';
import { ThematicGeminiVisual } from './ThematicGeminiVisual';

interface DoctorModuleProps {
  patient: Patient | null;
}


const COMMON_ICD10 = [
  { code: 'G43.0', name: 'Enxaqueca sem aura [enxaqueca comum]' },
  { code: 'J00', name: 'Rinite aguda [resfriado comum]' },
  { code: 'J02.9', name: 'Faringite aguda não especificada' },
  { code: 'I10', name: 'Hipertensão essencial (primária)' },
  { code: 'E11', name: 'Diabetes mellitus não-insulino-dependente' },
  { code: 'M54.5', name: 'Dor lombar baixa (Lombalgia)' },
  { code: 'K21.9', name: 'Doença de refluxo gastroesofágico sem esofagite' },
  { code: 'F41.1', name: 'Ansiedade generalizada' },
];

export const DoctorModule: React.FC<DoctorModuleProps> = ({ patient }) => {
  const [records, setRecords] = useState<MedicalRecord[]>(() =>
    patient ? StorageService.getMedicalRecords(patient.id) : []
  );

  const [mainComplaint, setMainComplaint] = useState('');
  const [historyHPI, setHistoryHPI] = useState('');
  const [familyHistory, setFamilyHistory] = useState('');
  const [vitalBP, setVitalBP] = useState('120/80');
  const [vitalHR, setVitalHR] = useState('75');
  const [vitalTemp, setVitalTemp] = useState('36.5');
  const [vitalSpo2, setVitalSpo2] = useState('98%');
  const [physicalExam, setPhysicalExam] = useState('');
  const [icd10, setIcd10] = useState(COMMON_ICD10[0]);
  const [diagnosis, setDiagnosis] = useState('');

  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      medication: 'Paracetamol 750mg',
      dosage: '1 comprimido',
      frequency: 'de 8/8 horas em caso de dor',
      duration: '5 dias',
      instructions: 'Ingerir com bastante água.',
    },
  ]);

  const [attestationDays, setAttestationDays] = useState<number>(0);
  const [attestationReason, setAttestationReason] = useState('');
  const [examRequests, setExamRequests] = useState<string>('Hemograma Completo, Glicemia de Jejum, Proteína C Reativa');

  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  if (!patient) {
    return (
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-3">
        <Stethoscope className="w-12 h-12 text-teal-600 dark:text-teal-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Nenhum Paciente Selecionado
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Por favor, vá para a aba <span className="font-semibold text-teal-600">Pacientes</span> e selecione um paciente registrado para iniciar o atendimento médico.
        </p>
      </div>
    );
  }

  const addPrescriptionItem = () => {
    setPrescriptions([
      ...prescriptions,
      {
        medication: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
      },
    ]);
  };

  const removePrescriptionItem = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  const updatePrescriptionItem = (index: number, field: keyof PrescriptionItem, val: string) => {
    const updated = [...prescriptions];
    updated[index][field] = val;
    setPrescriptions(updated);
  };

  const handleConsultAi = async () => {
    setIsAiLoading(true);
    setAiAnalysis('');
    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profession: 'Médico',
          taskType: 'consulta_medica',
          prompt: `Queixa: ${mainComplaint}. Exame Físico: ${physicalExam}. Sinais vitais: PA ${vitalBP}, FC ${vitalHR}, Temp ${vitalTemp}. Forneça raciocínio diagnóstico e sugestões de conduta.`,
          patientContext: {
            name: patient.name,
            age: new Date().getFullYear() - new Date(patient.birthDate).getFullYear(),
            allergies: patient.allergies,
            meds: patient.continuousMeds,
          },
        }),
      });
      const data = await res.json();
      if (data.text) {
        setAiAnalysis(data.text);
      }
    } catch {
      setAiAnalysis('Modo Local: Não foi possível conectar ao serviço de IA online. As recomendações padrão foram ativadas.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveRecord = () => {
    const newRecord: MedicalRecord = {
      id: `med-${Date.now()}`,
      patientId: patient.id,
      date: new Date().toISOString(),
      mainComplaint,
      historyPresentIllness: historyHPI,
      familyHistory,
      vitalSigns: {
        bloodPressure: vitalBP,
        heartRate: vitalHR,
        temperature: vitalTemp,
        oxygenSat: vitalSpo2,
        weight: '70 kg',
      },
      physicalExam,
      icd10Code: icd10.code,
      icd10Description: icd10.name,
      diagnosis,
      prescriptions,
      attestationDays,
      attestationReason,
      examRequests: examRequests.split(',').map((s) => s.trim()).filter(Boolean),
      aiNotes: aiAnalysis,
    };

    StorageService.saveMedicalRecord(newRecord);
    setRecords(StorageService.getMedicalRecords(patient.id));
    alert('Atendimento médico registrado e salvo no dispositivo local!');
  };

  return (
    <div className="space-y-6">
      {/* Patient Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-xs font-medium">
              Prontuário Médico #
              {patient.id}
            </span>
            <span className="text-xs text-teal-100">
              {patient.gender === 'M' ? 'Masculino' : 'Feminino'}, {new Date().getFullYear() - new Date(patient.birthDate).getFullYear()} anos
            </span>
          </div>
          <h2 className="text-2xl font-extrabold mt-1">{patient.name}</h2>
          <p className="text-xs text-teal-100 mt-0.5 font-mono">CPF: {patient.cpf}</p>
        </div>

        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur p-3 rounded-xl text-xs">
          <div>
            <p className="font-semibold text-teal-100">Alergias Conocidas:</p>
            <p className="text-white font-medium">
              {patient.allergies.length > 0 ? patient.allergies.join(', ') : 'Nenhuma alergia relatada'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Consultation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Anamnesis Card */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-600" />
              <span>Anamnese & Queixa Principal</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Queixa Principal (QP)
              </label>
              <textarea
                rows={2}
                value={mainComplaint}
                onChange={(e) => setMainComplaint(e.target.value)}
                placeholder="Ex: Cefaleia pulsátil com náuseas há 2 dias..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                História da Moléstia Atual (HMA)
              </label>
              <textarea
                rows={3}
                value={historyHPI}
                onChange={(e) => setHistoryHPI(e.target.value)}
                placeholder="Início dos sintomas, evolução, fatores de melhora e piora..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
              />
            </div>
          </div>

          {/* Physical Exam & Vital Signs */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-600" />
              <span>Sinais Vitais & Exame Físico</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  P.A. (mmHg)
                </label>
                <input
                  type="text"
                  value={vitalBP}
                  onChange={(e) => setVitalBP(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  F.C. (bpm)
                </label>
                <input
                  type="text"
                  value={vitalHR}
                  onChange={(e) => setVitalHR(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Temp (°C)
                </label>
                <input
                  type="text"
                  value={vitalTemp}
                  onChange={(e) => setVitalTemp(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  SpO2 (%)
                </label>
                <input
                  type="text"
                  value={vitalSpo2}
                  onChange={(e) => setVitalSpo2(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Achados do Exame Físico
              </label>
              <textarea
                rows={3}
                value={physicalExam}
                onChange={(e) => setPhysicalExam(e.target.value)}
                placeholder="Estado geral, ausculta cardíaca e pulmonar, palpação abdominal..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
              />
            </div>
          </div>

          {/* Integrated Medical Anatomy & Visual Generator */}
          <ThematicGeminiVisual specialty="medicina" patientName={patient.name} />


          {/* ICD-10 & Diagnosis */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-600" />
              <span>Classificação de Diagnóstico (CID-10)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Buscar/Selecionar CID-10 Frequente
                </label>
                <select
                  value={icd10.code}
                  onChange={(e) => {
                    const found = COMMON_ICD10.find((i) => i.code === e.target.value);
                    if (found) setIcd10(found);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                >
                  {COMMON_ICD10.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.code} - {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Hipótese Diagnóstica Final
                </label>
                <input
                  type="text"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Ex: Síndrome Enxaquecosa"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Prescription & Attestation */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
                <Award className="w-5 h-5 text-teal-600" />
                <span>Receituário & Atestado Médico</span>
              </h3>

              <button
                type="button"
                onClick={addPrescriptionItem}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 font-semibold text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Medicamento</span>
              </button>
            </div>

            {/* Prescriptions List */}
            <div className="space-y-3">
              {prescriptions.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 relative"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                      Medicamento #{idx + 1}
                    </span>
                    {prescriptions.length > 1 && (
                      <button
                        onClick={() => removePrescriptionItem(idx)}
                        className="text-rose-500 p-1 hover:bg-rose-100 dark:hover:bg-rose-950 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Nome do Medicamento (ex: Amoxicilina 500mg)"
                      value={item.medication}
                      onChange={(e) => updatePrescriptionItem(idx, 'medication', e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                    <input
                      type="text"
                      placeholder="Posologia (ex: 1 comprimido de 8/8h)"
                      value={item.dosage}
                      onChange={(e) => updatePrescriptionItem(idx, 'dosage', e.target.value)}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Instruções de Uso (ex: Tomar após refeição por 7 dias)"
                    value={item.instructions}
                    onChange={(e) => updatePrescriptionItem(idx, 'instructions', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
                  />
                </div>
              ))}
            </div>

            {/* Attestation Days */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Atestado Médico (Dias de Afastamento)
                </label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={attestationDays}
                  onChange={(e) => setAttestationDays(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Exames Solicitados (Separados por vírgula)
                </label>
                <input
                  type="text"
                  value={examRequests}
                  onChange={(e) => setExamRequests(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSaveRecord}
              className="flex-1 px-5 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Atendimento Localmente</span>
            </button>

            <button
              onClick={() => {
                const dummyRecord: MedicalRecord = {
                  id: 'temp',
                  patientId: patient.id,
                  date: new Date().toISOString(),
                  mainComplaint,
                  historyPresentIllness: historyHPI,
                  familyHistory: '',
                  vitalSigns: { bloodPressure: vitalBP, heartRate: vitalHR, temperature: vitalTemp, oxygenSat: vitalSpo2, weight: '' },
                  physicalExam,
                  icd10Code: icd10.code,
                  icd10Description: icd10.name,
                  diagnosis,
                  prescriptions,
                };
                ExportPackageUtils.printMedicalPrescription(patient, dummyRecord);
              }}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-semibold text-sm transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Receita (PDF)</span>
            </button>
          </div>
        </div>

        {/* Right Col: AI Assistant & Medical History */}
        <div className="space-y-6">
          {/* AI Clinical Assistant Box */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-lg border border-slate-700 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Assistente Gemini IA</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 font-mono">
                Decisão Auxiliar
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Consulte a IA Gemini para hipóteses diagnósticas e revisão de interações medicamentosas.
            </p>

            <button
              onClick={handleConsultAi}
              disabled={isAiLoading}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-teal-500 hover:from-amber-600 hover:to-teal-600 text-slate-950 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {isAiLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analisando Quadro...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analisar Conduta com Gemini</span>
                </>
              )}
            </button>

            {aiAnalysis && (
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-700 text-xs text-slate-200 whitespace-pre-line max-h-60 overflow-y-auto leading-relaxed">
                {aiAnalysis}
              </div>
            )}
          </div>

          {/* Historical Consultation Records */}
          <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Histórico de Atendimentos
            </h3>

            {records.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">
                Nenhum atendimento médico anterior salvo.
              </p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {records.map((rec) => (
                  <div
                    key={rec.id}
                    className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1"
                  >
                    <div className="flex justify-between items-center font-bold text-teal-600 dark:text-teal-400">
                      <span>{new Date(rec.date).toLocaleDateString('pt-BR')}</span>
                      <span>CID: {rec.icd10Code}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 line-clamp-2">
                      {rec.mainComplaint}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
