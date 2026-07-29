import React from 'react';
import {
  Stethoscope,
  Smile,
  Apple,
  Users,
  ClipboardList,
  Download,
  ShieldCheck,
  Sun,
  Moon,
  Menu,
  X,
  Activity,
  DollarSign,
  UserCheck,
} from 'lucide-react';
import { ProfessionalProfile } from '../types';

interface SidebarProps {
  activeTab: 'pacientes' | 'atendimento' | 'financas' | 'downloads' | 'legal';
  setActiveTab: (tab: 'pacientes' | 'atendimento' | 'financas' | 'downloads' | 'legal') => void;
  selectedPatientName?: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  selectedPatientName,
  mobileMenuOpen,
  setMobileMenuOpen,
  theme,
  toggleTheme,
}) => {
  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-100 flex-col justify-between flex-shrink-0 h-screen sticky top-0 hidden lg:flex border-r border-slate-800 z-30">
        <div>
          {/* Logo Section */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/30">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-base text-white tracking-tight leading-tight">
                  OminiClin <span className="text-blue-400">MNAnimat</span>
                </h1>
                <p className="text-[11px] text-slate-400">Rotina Clínica v1.0.0</p>
              </div>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-blue-950 text-blue-300 border border-blue-800 rounded-md">
              MIT
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Menu Principal
            </div>

            <button
              onClick={() => setActiveTab('pacientes')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'pacientes'
                  ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Pacientes</span>
            </button>

            <button
              onClick={() => setActiveTab('atendimento')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'atendimento'
                  ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ClipboardList className="w-4 h-4" />
                <span>Atendimento</span>
              </div>
              {selectedPatientName && (
                <span className="px-2 py-0.5 text-[10px] bg-slate-800 text-blue-300 rounded font-normal truncate max-w-[80px]">
                  {selectedPatientName.split(' ')[0]}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('financas')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'financas'
                  ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Finanças & Gráficos</span>
            </button>

            <div className="pt-4 px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Instalação & Legal
            </div>

            <button
              onClick={() => setActiveTab('downloads')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'downloads'
                  ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Download className="w-4 h-4" />
              <span>Windows / Android</span>
            </button>

            <button
              onClick={() => setActiveTab('legal')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === 'legal'
                  ? 'bg-blue-600 text-white font-medium shadow-md shadow-blue-600/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>LGPD & Licença MIT</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/80 p-3.5 rounded-xl text-xs space-y-1.5 border border-slate-700/50">
            <div className="flex items-center justify-between text-slate-300 font-semibold">
              <span>Licença MIT</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Desenvolvido por: <strong className="text-slate-200">Micael Nildo Oliveira Souza</strong>
            </p>
            <p className="text-[10px] text-slate-500">Conformidade LGPD (Lei 13.709/2018)</p>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex">
          <div className="w-72 bg-slate-900 text-white h-full p-5 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
                    <Activity className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-white">OminiClin MNAnimat</h2>
                    <p className="text-[10px] text-slate-400">Sistema Clínico MIT</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-2 text-sm">
                <button
                  onClick={() => {
                    setActiveTab('pacientes');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                    activeTab === 'pacientes'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Pacientes</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('atendimento');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                    activeTab === 'atendimento'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ClipboardList className="w-4 h-4" />
                    <span>Atendimento</span>
                  </div>
                  {selectedPatientName && (
                    <span className="px-2 py-0.5 text-[10px] bg-slate-800 text-blue-300 rounded">
                      {selectedPatientName.split(' ')[0]}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveTab('financas');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                    activeTab === 'financas'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Finanças & Gráficos</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('downloads');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                    activeTab === 'downloads'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>Windows / Android</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('legal');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                    activeTab === 'legal'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>LGPD & Licença MIT</span>
                </button>
              </nav>
            </div>

            <div className="p-3 bg-slate-800 rounded-xl text-xs space-y-1">
              <p className="font-semibold text-slate-200">Micael Nildo Oliveira Souza</p>
              <p className="text-[11px] text-slate-400">Licença MIT • LGPD ok</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

interface TopHeaderProps {
  activeProfile: ProfessionalProfile;
  setActiveProfile: (prof: ProfessionalProfile) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onOpenMobileMenu: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeProfile,
  setActiveProfile,
  theme,
  toggleTheme,
  onOpenMobileMenu,
}) => {
  // Format today's date in Portuguese
  const todayFormatted = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const formattedDate = todayFormatted.charAt(0).toUpperCase() + todayFormatted.slice(1);

  return (
    <header className="sticky top-0 z-20 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between transition-colors w-full">
      {/* Left Section: Mobile Toggle & Date / Status Badge */}
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden md:flex flex-col">
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            {formattedDate}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Ambiente Local de Atendimento
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-medium px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Servidor Local Online</span>
        </div>
      </div>

      {/* Center / Right Section: Profile Switcher & User Avatar */}
      <div className="flex items-center gap-3">
        {/* Specialty Profile Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveProfile('medico')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeProfile === 'medico'
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Médico</span>
          </button>

          <button
            onClick={() => setActiveProfile('dentista')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeProfile === 'dentista'
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Dentista</span>
          </button>

          <button
            onClick={() => setActiveProfile('nutricionista')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeProfile === 'nutricionista'
                ? 'bg-blue-600 text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Nutricionista</span>
          </button>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 font-semibold text-xs shadow-2xs"
          title={theme === 'light' ? 'Mudar para Modo Escuro' : 'Mudar para Modo Claro'}
        >
          {theme === 'light' ? (
            <>
              <Moon className="w-4 h-4 text-slate-700" />
              <span className="hidden sm:inline">Modo Escuro</span>
            </>
          ) : (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Modo Claro</span>
            </>
          )}
        </button>

        {/* Responsible Person / Admin Badge */}
        <div className="hidden xl:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs border border-blue-200 dark:border-blue-800">
            MN
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
              Micael Nildo
            </p>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Responsável T.I.</p>
          </div>
        </div>
      </div>
    </header>
  );
};


