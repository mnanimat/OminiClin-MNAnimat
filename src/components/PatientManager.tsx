import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldAlert,
  Trash2,
  Edit2,
  Clock,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react';
import { Patient } from '../types';
import { StorageService } from '../services/storage';

interface PatientManagerProps {
  patients: Patient[];
  selectedPatient: Patient | null;
  onSelectPatient: (patient: Patient) => void;
  onRefreshPatients: () => void;
}

export const PatientManager: React.FC<PatientManagerProps> = ({
  patients,
  selectedPatient,
  onSelectPatient,
  onRefreshPatients,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [patientNumber, setPatientNumber] = useState<string>('1004');

  const [formData, setFormData] = useState<Partial<Patient>>({
    name: '',
    cpf: '',
    birthDate: '1990-01-01',
    gender: 'M',
    phone: '',
    email: '',
    address: '',
    allergies: [],
    continuousMeds: [],
    notes: '',
    consentLgpd: true,
  });

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.cpf.includes(searchTerm) ||
      p.phone.includes(searchTerm)
  );

  const handleOpenAdd = () => {
    setEditingPatient(null);
    const nextNum = 1000 + patients.length + 1;
    setPatientNumber(nextNum.toString());
    setFormData({
      name: '',
      cpf: '',
      birthDate: '1990-01-01',
      gender: 'M',
      phone: '',
      email: '',
      address: '',
      allergies: [],
      continuousMeds: [],
      notes: '',
      consentLgpd: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: Patient, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPatient(p);
    
    // Extract numeric prefix if present
    const numMatch = p.name.match(/\d+/);
    if (numMatch) {
      setPatientNumber(numMatch[0]);
    } else {
      setPatientNumber('1001');
    }

    setFormData(p);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.cpf) {
      alert('Por favor, preencha o Nome e o CPF do paciente.');
      return;
    }

    let finalName = formData.name.trim();
    // Ensure patient name includes the numeric registration code
    if (patientNumber && !finalName.match(/^Nº\s*\d+/i)) {
      finalName = `Nº ${patientNumber} - ${finalName.replace(/^Nº\s*\d+\s*-\s*/i, '')}`;
    }

    const patientToSave: Patient = {
      id: editingPatient ? editingPatient.id : `pat-${Date.now()}`,
      name: finalName,
      cpf: formData.cpf || '',
      birthDate: formData.birthDate || '1990-01-01',
      gender: (formData.gender as 'M' | 'F' | 'Outro') || 'M',
      phone: formData.phone || '',
      email: formData.email || '',
      address: formData.address || '',
      allergies: Array.isArray(formData.allergies) ? formData.allergies : [],
      continuousMeds: Array.isArray(formData.continuousMeds) ? formData.continuousMeds : [],
      notes: formData.notes || '',
      consentLgpd: formData.consentLgpd ?? true,
      consentTimestamp: new Date().toISOString(),
      createdAt: editingPatient ? editingPatient.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    StorageService.savePatient(patientToSave);
    onRefreshPatients();
    onSelectPatient(patientToSave);
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Ação LGPD: Deseja apagar permanentemente os dados deste paciente?')) {
      StorageService.deletePatient(id);
      onRefreshPatients();
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            <span>Gestão de Pacientes</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Prontuários eletrônicos protegidos localmente com consentimento LGPD.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-medium text-sm transition-all shadow-sm shadow-teal-600/20"
        >
          <UserPlus className="w-4 h-4" />
          <span>Cadastrar Novo Paciente</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nome, CPF ou telefone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-teal-500 text-sm outline-none transition-all"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700">
          <span className="font-semibold text-slate-900 dark:text-white">{patients.length}</span>
          <span>pacientes registrados localmente</span>
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map((patient) => {
          const isSelected = selectedPatient?.id === patient.id;
          return (
            <div
              key={patient.id}
              onClick={() => onSelectPatient(patient)}
              className={`cursor-pointer p-5 rounded-2xl border transition-all relative group ${
                isSelected
                  ? 'bg-teal-50/50 dark:bg-teal-950/30 border-teal-500 dark:border-teal-400 ring-2 ring-teal-500/20'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-teal-300 dark:hover:border-teal-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-11 h-11 rounded-full bg-slate-100 dark:bg-slate-700 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-lg">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                      {patient.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      CPF: {patient.cpf}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleOpenEdit(patient, e)}
                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(patient.id, e)}
                    className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-500"
                    title="Excluir (LGPD)"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{patient.phone || 'Sem telefone registrado'}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{patient.email || 'Sem e-mail registrado'}</span>
                </div>
              </div>

              {/* Badges */}
              <div className="mt-4 flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>LGPD Consentido</span>
                </div>

                {isSelected ? (
                  <span className="flex items-center space-x-1 font-semibold text-teal-600 dark:text-teal-400 bg-teal-100 dark:bg-teal-900/60 px-2 py-0.5 rounded-md">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Selecionado</span>
                  </span>
                ) : (
                  <span className="text-slate-400 hover:text-teal-600 transition-colors">
                    Clique para Atender →
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Patient Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
              {editingPatient ? 'Editar Paciente' : 'Novo Cadastro de Paciente'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nº Prontuário *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="1001"
                    value={patientNumber}
                    onChange={(e) => setPatientNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Paciente 4"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    CPF (Fictício) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: CPF FICTÍCIO (000.000.000-00)"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Telefone / WhatsApp (Fictício)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: TELEFONE FICTÍCIO (00) 00000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Gênero
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  >
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Observações Gerais e Alergias
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Informações relevantes sobre saúde, alergias medicamentosas..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                />
              </div>

              {/* LGPD Consent Checkbox */}
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.consentLgpd}
                    onChange={(e) => setFormData({ ...formData, consentLgpd: e.target.checked })}
                    className="mt-0.5 rounded text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-xs text-slate-700 dark:text-slate-300">
                    O paciente declara ciência do tratamento de seus dados de saúde exclusivamente para fins de consulta e prontuário médico/odontológico/nutricional nos termos da LGPD (Lei 13.709/2018).
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm"
                >
                  {editingPatient ? 'Salvar Alterações' : 'Cadastrar Paciente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
