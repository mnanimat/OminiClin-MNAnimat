/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar, TopHeader } from './components/Navbar';
import { PatientManager } from './components/PatientManager';
import { DoctorModule } from './components/DoctorModule';
import { DentistModule } from './components/DentistModule';
import { NutritionistModule } from './components/NutritionistModule';
import { FinancialDashboard } from './components/FinancialDashboard';
import { DownloadCenter } from './components/DownloadCenter';
import { LegalPanel } from './components/LegalPanel';
import { Patient, ProfessionalProfile } from './types';
import { StorageService } from './services/storage';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => StorageService.getTheme());
  const [activeProfile, setActiveProfile] = useState<ProfessionalProfile>(() =>
    StorageService.getActiveProfession()
  );
  const [activeTab, setActiveTab] = useState<'pacientes' | 'atendimento' | 'financas' | 'downloads' | 'legal'>(
    'pacientes'
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [patients, setPatients] = useState<Patient[]>(() => StorageService.getPatients());
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(() => {
    const list = StorageService.getPatients();
    return list.length > 0 ? list[0] : null;
  });

  // Apply Dark Theme Class to Document Root
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    StorageService.setTheme(theme);
  }, [theme]);

  // Persist Active Profile Selection
  useEffect(() => {
    StorageService.setActiveProfession(activeProfile);
  }, [activeProfile]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleRefreshPatients = () => {
    const list = StorageService.getPatients();
    setPatients(list);
    if (selectedPatient) {
      const updated = list.find((p) => p.id === selectedPatient.id);
      if (updated) setSelectedPatient(updated);
    }
  };

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setActiveTab('atendimento');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Desktop & Mobile Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedPatientName={selectedPatient?.name}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <TopHeader
          activeProfile={activeProfile}
          setActiveProfile={setActiveProfile}
          theme={theme}
          toggleTheme={toggleTheme}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'pacientes' && (
            <PatientManager
              patients={patients}
              selectedPatient={selectedPatient}
              onSelectPatient={handleSelectPatient}
              onRefreshPatients={handleRefreshPatients}
            />
          )}

          {activeTab === 'atendimento' && (
            <>
              {activeProfile === 'medico' && <DoctorModule patient={selectedPatient} />}
              {activeProfile === 'dentista' && <DentistModule patient={selectedPatient} />}
              {activeProfile === 'nutricionista' && <NutritionistModule patient={selectedPatient} />}
            </>
          )}

          {activeTab === 'financas' && <FinancialDashboard patients={patients} />}

          {activeTab === 'downloads' && <DownloadCenter />}

          {activeTab === 'legal' && <LegalPanel />}
        </main>

        {/* Compact Footer Notice */}
        <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-6 mt-8 transition-colors text-xs text-slate-500 dark:text-slate-400">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center md:text-left">
              <p className="font-semibold text-slate-700 dark:text-slate-300">
                OminiClin MNAnimat - Rotina Clínica Multidisciplinar Local v1.0.0
              </p>
              <p className="text-[11px]">
                Desenvolvido por <strong className="text-blue-600 dark:text-blue-400">Micael Nildo Oliveira Souza</strong> com auxílio de <strong className="text-purple-600 dark:text-purple-400">Inteligência Artificial (Google AI Studio / Gemini AI)</strong> sob Licença MIT. Sistema em conformidade com a LGPD (Lei nº 13.709/2018).
              </p>
            </div>

            {/* Observação de Sistema Web Demonstrativo e Aviso Profissional Registrado */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 px-3.5 py-1.5 rounded-xl text-[11px] text-slate-600 dark:text-slate-300 text-center shadow-2xs">
              <span>⚠️ <strong>Sistema Web Demonstrativo & Fictício:</strong> Uso exclusivo por Médicos (CRM), Dentistas (CRO) e Nutricionistas (CRN) registrados.</span>
            </div>

            <div className="flex items-center space-x-3 text-[11px]">
              <button
                onClick={() => setActiveTab('legal')}
                className="hover:text-blue-600 transition-colors"
              >
                Conformidade LGPD & Licença MIT
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveTab('downloads')}
                className="hover:text-blue-600 transition-colors"
              >
                Executável Windows & Android
              </button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

