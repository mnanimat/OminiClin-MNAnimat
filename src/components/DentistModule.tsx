import React, { useState } from 'react';
import {
  Smile,
  CheckCircle2,
  AlertTriangle,
  Printer,
  Sparkles,
  Plus,
  Trash2,
  Loader2,
  Calendar,
  FileCheck2,
} from 'lucide-react';
import { Patient, DentalRecord, ToothData, ToothStatus, PrescriptionItem } from '../types';
import { StorageService } from '../services/storage';
import { ExportPackageUtils } from '../utils/exportPackages';
import { ThematicGeminiVisual } from './ThematicGeminiVisual';


interface DentistModuleProps {
  patient: Patient | null;
}

const STATUS_COLORS: Record<ToothStatus, { bg: string; text: string; label: string }> = {
  saudavel: { bg: 'bg-emerald-100 dark:bg-emerald-950/80', text: 'text-emerald-700 dark:text-emerald-300', label: 'Saudável' },
  carie: { bg: 'bg-rose-100 dark:bg-rose-950/80', text: 'text-rose-700 dark:text-rose-300', label: 'Cárie' },
  restaurado: { bg: 'bg-sky-100 dark:bg-sky-950/80', text: 'text-sky-700 dark:text-sky-300', label: 'Restauração' },
  canal: { bg: 'bg-amber-100 dark:bg-amber-950/80', text: 'text-amber-700 dark:text-amber-300', label: 'Tratamento Canal' },
  implante: { bg: 'bg-purple-100 dark:bg-purple-950/80', text: 'text-purple-700 dark:text-purple-300', label: 'Implante' },
  ausente: { bg: 'bg-slate-200 dark:bg-slate-700', text: 'text-slate-600 dark:text-slate-400', label: 'Ausente/Extraído' },
  protese: { bg: 'bg-indigo-100 dark:bg-indigo-950/80', text: 'text-indigo-700 dark:text-indigo-300', label: 'Prótese' },
};

export const DentistModule: React.FC<DentistModuleProps> = ({ patient }) => {
  const [records, setRecords] = useState<DentalRecord[]>(() =>
    patient ? StorageService.getDentalRecords(patient.id) : []
  );

  const [chiefComplaint, setChiefComplaint] = useState('');
  const [periodontalStatus, setPeriodontalStatus] = useState<'normal' | 'gingivite' | 'periodontite_leve' | 'periodontite_severa'>('normal');

  // Initialize 32 permanent teeth map
  const [teeth, setTeeth] = useState<Record<number, ToothData>>(() => {
    if (records.length > 0 && records[0].teeth) {
      return records[0].teeth;
    }
    const initial: Record<number, ToothData> = {};
    const numbers = [
      18, 17, 16, 15, 14, 13, 12, 11,
      21, 22, 23, 24, 25, 26, 27, 28,
      48, 47, 46, 45, 44, 43, 42, 41,
      31, 32, 33, 34, 35, 36, 37, 38,
    ];
    numbers.forEach((num) => {
      initial[num] = { toothNumber: num, status: 'saudavel' };
    });
    return initial;
  });

  const [selectedToothNumber, setSelectedToothNumber] = useState<number | null>(16);
  const [toothNote, setToothNote] = useState('');
  const [toothStatusSelect, setToothStatusSelect] = useState<ToothStatus>('saudavel');

  const [proceduresDone, setProceduresDone] = useState<string[]>([
    'Profilaxia Ultrassônica e Jato de Bicarbonato',
    'Aplicação Tópica de Flúor',
  ]);
  const [newProcedureInput, setNewProcedureInput] = useState('');

  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      medication: 'Amoxicilina 500mg',
      dosage: '1 cápsula',
      frequency: 'de 8 em 8 horas',
      duration: '7 dias',
      instructions: 'Ingerir nos mesmos horários.',
    },
  ]);

  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  if (!patient) {
    return (
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 text-center space-y-3">
        <Smile className="w-12 h-12 text-teal-600 dark:text-teal-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Nenhum Paciente Selecionado
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
          Selecione um paciente registrado na aba <span className="font-semibold text-teal-600">Pacientes</span> para carregar e salvar o Odontograma.
        </p>
      </div>
    );
  }

  const handleUpdateTooth = () => {
    if (!selectedToothNumber) return;
    setTeeth((prev) => ({
      ...prev,
      [selectedToothNumber]: {
        toothNumber: selectedToothNumber,
        status: toothStatusSelect,
        notes: toothNote,
      },
    }));
  };

  const handleAddProcedure = () => {
    if (!newProcedureInput.trim()) return;
    setProceduresDone([...proceduresDone, newProcedureInput.trim()]);
    setNewProcedureInput('');
  };

  const handleSaveDentalRecord = () => {
    const newRecord: DentalRecord = {
      id: `den-${Date.now()}`,
      patientId: patient.id,
      date: new Date().toISOString(),
      chiefComplaint,
      teeth,
      periodontalStatus,
      proceduresDone,
      prescriptions,
      aiNotes: aiAnalysis,
    };

    StorageService.saveDentalRecord(newRecord);
    setRecords(StorageService.getDentalRecords(patient.id));
    alert('Odontograma e Registro Odontológico salvos com sucesso!');
  };

  const handleConsultAiOdonto = async () => {
    setIsAiLoading(true);
    try {
      const teethSummary = (Object.values(teeth) as ToothData[])
        .filter((t) => t.status !== 'saudavel')
        .map((t) => `Dente ${t.toothNumber}: ${t.status} (${t.notes || ''})`)
        .join('; ');

      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profession: 'Dentista',
          taskType: 'odontograma',
          prompt: `Queixa: ${chiefComplaint}. Condição Periodontal: ${periodontalStatus}. Achados Odontograma: ${teethSummary || 'Todos elementos íntegros'}. Elabore plano de tratamento sequencial.`,
          patientContext: {
            name: patient.name,
            age: new Date().getFullYear() - new Date(patient.birthDate).getFullYear(),
          },
        }),
      });
      const data = await res.json();
      if (data.text) {
        setAiAnalysis(data.text);
      }
    } catch {
      setAiAnalysis('Modo Local: Plano de tratamento padrão gerado offline.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Quadrants definition for 32 permanent teeth
  const upperRight = [18, 17, 16, 15, 14, 13, 12, 11];
  const upperLeft = [21, 22, 23, 24, 25, 26, 27, 28];
  const lowerRight = [48, 47, 46, 45, 44, 43, 42, 41];
  const lowerLeft = [31, 32, 33, 34, 35, 36, 37, 38];

  return (
    <div className="space-y-6">
      {/* Patient Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-xs font-medium">
              Odontograma do Paciente
            </span>
          </div>
          <h2 className="text-2xl font-extrabold mt-1">{patient.name}</h2>
          <p className="text-xs text-teal-100 mt-0.5 font-mono">CPF: {patient.cpf}</p>
        </div>

        <button
          onClick={() => {
            const tempRecord: DentalRecord = {
              id: 'temp',
              patientId: patient.id,
              date: new Date().toISOString(),
              chiefComplaint,
              teeth,
              periodontalStatus,
              proceduresDone,
              prescriptions,
            };
            ExportPackageUtils.printDentalReport(patient, tempRecord);
          }}
          className="px-4 py-2.5 bg-white text-teal-800 rounded-xl font-bold text-xs shadow hover:bg-slate-100 transition-all flex items-center gap-2"
        >
          <Printer className="w-4 h-4 text-teal-600" />
          <span>Exportar Odontograma em PDF</span>
        </button>
      </div>

      {/* Main Interactive Odontogram Grid */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg flex items-center gap-2">
              <Smile className="w-6 h-6 text-teal-600" />
              <span>Odontograma Interativo Permanente (Arcada Superior & Inferior)</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clique sobre um dente para alterar o status e registrar anotações clínicas.
            </p>
          </div>

          {/* Status Legend */}
          <div className="flex flex-wrap items-center gap-2 text-[10px]">
            {Object.entries(STATUS_COLORS).map(([key, val]) => (
              <span key={key} className={`px-2 py-0.5 rounded-md font-semibold ${val.bg} ${val.text}`}>
                {val.label}
              </span>
            ))}
          </div>
        </div>

        {/* Teeth Display Arches */}
        <div className="space-y-6">
          {/* Upper Arch */}
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center mb-3">
              Arcada Superior (Vestibular / Oclusal)
            </h4>

            <div className="flex justify-center flex-wrap gap-2">
              {/* Q1 */}
              <div className="flex space-x-1.5 border-r-2 border-dashed border-slate-300 dark:border-slate-700 pr-2">
                {upperRight.map((num) => {
                  const tData = teeth[num] || { toothNumber: num, status: 'saudavel' };
                  const colorConfig = STATUS_COLORS[tData.status] || STATUS_COLORS.saudavel;
                  const isSelected = selectedToothNumber === num;

                  return (
                    <button
                      key={num}
                      onClick={() => {
                        setSelectedToothNumber(num);
                        setToothStatusSelect(tData.status);
                        setToothNote(tData.notes || '');
                      }}
                      className={`w-10 h-14 rounded-lg flex flex-col items-center justify-between p-1 transition-all border ${
                        colorConfig.bg
                      } ${isSelected ? 'ring-2 ring-teal-500 scale-105 border-teal-600' : 'border-slate-200 dark:border-slate-700'}`}
                    >
                      <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
                        {num}
                      </span>
                      <div className="w-5 h-5 rounded-full border border-slate-400/40 bg-white/50 flex items-center justify-center text-[9px] font-bold">
                        {tData.status.charAt(0).toUpperCase()}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Q2 */}
              <div className="flex space-x-1.5 pl-2">
                {upperLeft.map((num) => {
                  const tData = teeth[num] || { toothNumber: num, status: 'saudavel' };
                  const colorConfig = STATUS_COLORS[tData.status] || STATUS_COLORS.saudavel;
                  const isSelected = selectedToothNumber === num;

                  return (
                    <button
                      key={num}
                      onClick={() => {
                        setSelectedToothNumber(num);
                        setToothStatusSelect(tData.status);
                        setToothNote(tData.notes || '');
                      }}
                      className={`w-10 h-14 rounded-lg flex flex-col items-center justify-between p-1 transition-all border ${
                        colorConfig.bg
                      } ${isSelected ? 'ring-2 ring-teal-500 scale-105 border-teal-600' : 'border-slate-200 dark:border-slate-700'}`}
                    >
                      <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
                        {num}
                      </span>
                      <div className="w-5 h-5 rounded-full border border-slate-400/40 bg-white/50 flex items-center justify-center text-[9px] font-bold">
                        {tData.status.charAt(0).toUpperCase()}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Lower Arch */}
          <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center mb-3">
              Arcada Inferior (Vestibular / Oclusal)
            </h4>

            <div className="flex justify-center flex-wrap gap-2">
              {/* Q4 */}
              <div className="flex space-x-1.5 border-r-2 border-dashed border-slate-300 dark:border-slate-700 pr-2">
                {lowerRight.map((num) => {
                  const tData = teeth[num] || { toothNumber: num, status: 'saudavel' };
                  const colorConfig = STATUS_COLORS[tData.status] || STATUS_COLORS.saudavel;
                  const isSelected = selectedToothNumber === num;

                  return (
                    <button
                      key={num}
                      onClick={() => {
                        setSelectedToothNumber(num);
                        setToothStatusSelect(tData.status);
                        setToothNote(tData.notes || '');
                      }}
                      className={`w-10 h-14 rounded-lg flex flex-col items-center justify-between p-1 transition-all border ${
                        colorConfig.bg
                      } ${isSelected ? 'ring-2 ring-teal-500 scale-105 border-teal-600' : 'border-slate-200 dark:border-slate-700'}`}
                    >
                      <div className="w-5 h-5 rounded-full border border-slate-400/40 bg-white/50 flex items-center justify-center text-[9px] font-bold">
                        {tData.status.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
                        {num}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Q3 */}
              <div className="flex space-x-1.5 pl-2">
                {lowerLeft.map((num) => {
                  const tData = teeth[num] || { toothNumber: num, status: 'saudavel' };
                  const colorConfig = STATUS_COLORS[tData.status] || STATUS_COLORS.saudavel;
                  const isSelected = selectedToothNumber === num;

                  return (
                    <button
                      key={num}
                      onClick={() => {
                        setSelectedToothNumber(num);
                        setToothStatusSelect(tData.status);
                        setToothNote(tData.notes || '');
                      }}
                      className={`w-10 h-14 rounded-lg flex flex-col items-center justify-between p-1 transition-all border ${
                        colorConfig.bg
                      } ${isSelected ? 'ring-2 ring-teal-500 scale-105 border-teal-600' : 'border-slate-200 dark:border-slate-700'}`}
                    >
                      <div className="w-5 h-5 rounded-full border border-slate-400/40 bg-white/50 flex items-center justify-center text-[9px] font-bold">
                        {tData.status.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
                        {num}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Selected Tooth Edit Panel */}
        {selectedToothNumber && (
          <div className="p-4 bg-teal-50/50 dark:bg-slate-900/80 rounded-xl border border-teal-200 dark:border-teal-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-teal-800 dark:text-teal-300">
                Edição de Registro: Dente {selectedToothNumber}
              </h4>
              <span className="text-xs text-slate-500">Quad: {Math.floor(selectedToothNumber / 10)}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Status Odontológico</label>
                <select
                  value={toothStatusSelect}
                  onChange={(e) => setToothStatusSelect(e.target.value as ToothStatus)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="saudavel">Saudável</option>
                  <option value="carie">Cárie</option>
                  <option value="restaurado">Restauração de Resina/Amálgama</option>
                  <option value="canal">Tratamento de Canal (Endodontia)</option>
                  <option value="implante">Implante</option>
                  <option value="ausente">Ausente / Extraído</option>
                  <option value="protese">Prótese / Coroa</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Anotações do Dente</label>
                <input
                  type="text"
                  value={toothNote}
                  onChange={(e) => setToothNote(e.target.value)}
                  placeholder="Ex: Face oclusal afetada, resina D3..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
            </div>

            <button
              onClick={handleUpdateTooth}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg shadow-sm transition-all"
            >
              Aplicar Alteração ao Dente {selectedToothNumber}
            </button>
          </div>
        )}
      </div>

      {/* Integrated Dental Anatomy & Visual Generator */}
      <ThematicGeminiVisual specialty="odontologia" patientName={patient.name} />

      {/* Procedures & Periodontal Section */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Procedimentos Realizados & Periodontia
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Avaliação Periodontal Geral
            </label>
            <select
              value={periodontalStatus}
              onChange={(e) => setPeriodontalStatus(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
            >
              <option value="normal">Normal / Íntegro</option>
              <option value="gingivite">Gingivite Marginal</option>
              <option value="periodontite_leve">Periodontite Leve a Moderada</option>
              <option value="periodontite_severa">Periodontite Avançada / Perda Óssea</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Adicionar Procedimento Concluído
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newProcedureInput}
                onChange={(e) => setNewProcedureInput(e.target.value)}
                placeholder="Ex: Restauração em resina no dente 16"
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
              />
              <button
                onClick={handleAddProcedure}
                className="px-3 py-2 bg-teal-600 text-white font-semibold text-xs rounded-xl"
              >
                Adicionar
              </button>
            </div>

            <ul className="mt-3 space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {proceduresDone.map((p, idx) => (
                <li key={idx} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <span>• {p}</span>
                  <button
                    onClick={() => setProceduresDone(proceduresDone.filter((_, i) => i !== idx))}
                    className="text-rose-500 hover:text-rose-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleSaveDentalRecord}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <FileCheck2 className="w-4 h-4" />
            <span>Salvar Odontograma Localmente</span>
          </button>
        </div>

        {/* AI Dental Assistant */}
        <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white p-5 rounded-2xl border border-slate-700 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-sm">IA Odontológica Gemini</h3>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/20 text-amber-300">
              Apoio Clínico
            </span>
          </div>

          <p className="text-xs text-slate-300">
            Gere sequenciamento de tratamento preventivo e profilático baseado no Odontograma.
          </p>

          <button
            onClick={handleConsultAiOdonto}
            disabled={isAiLoading}
            className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-teal-500 hover:from-amber-600 hover:to-teal-600 text-slate-950 font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2"
          >
            {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Gerar Sequência de Tratamento Odontológico</span>
          </button>

          {aiAnalysis && (
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-700 text-xs text-slate-200 whitespace-pre-line max-h-60 overflow-y-auto">
              {aiAnalysis}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
