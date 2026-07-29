import React, { useState } from 'react';
import {
  ShieldCheck,
  FileText,
  Lock,
  UserCheck,
  AlertTriangle,
  Download,
  Trash2,
  Database,
  CheckCircle2,
  Scale,
  Award,
  Sparkles,
} from 'lucide-react';
import { StorageService } from '../services/storage';

export const LegalPanel: React.FC = () => {
  const [dataBackupJson, setDataBackupJson] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');

  const handleExportJson = () => {
    const json = StorageService.exportAllDataJSON();
    setDataBackupJson(json);

    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OminiClin_MNAnimat_Backup_LGPD_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJson = () => {
    if (!importJsonText.trim()) return;
    const success = StorageService.importAllDataJSON(importJsonText);
    if (success) {
      alert('Backup e registros restaurados com sucesso! A página será atualizada.');
      window.location.reload();
    } else {
      alert('Erro: Arquivo de backup inválido.');
    }
  };

  const handleClearData = () => {
    if (confirm('Atenção LGPD: Esta ação apagará permanentemente TODOS os prontuários, pacientes e imagens locais. Tem certeza?')) {
      StorageService.clearAllData();
      alert('Todos os dados foram completamente removidos deste navegador.');
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white p-6 rounded-2xl border border-slate-700 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Conformidade com a Lei Brasileira & Internacional
            </span>
          </div>
          <h2 className="text-2xl font-black">
            Termos de Uso, Licença MIT & Privacidade LGPD
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Lançamento sob Licença MIT por <strong className="text-white">Micael Nildo Oliveira Souza</strong>. Cumprimento rigoroso da Lei Geral de Proteção de Dados (Lei nº 13.709/2018) e Termos de Uso do Google Gemini AI.
          </p>
        </div>

        <div className="p-3 bg-white/10 rounded-xl backdrop-blur text-xs text-right">
          <p className="font-bold text-teal-300">Licença Open Source MIT</p>
          <p className="text-[10px] text-slate-300">Copyright (c) 2026 Micael Nildo Oliveira Souza</p>
        </div>
      </div>

      {/* Grid of Legal Requirements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MIT License Section */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-600" />
            <span>Licença MIT (Texto Oficial do Lançamento)</span>
          </h3>

          <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-xs leading-relaxed space-y-2 border border-slate-700 max-h-60 overflow-y-auto">
            <p className="font-bold text-teal-400">MIT License</p>
            <p>Copyright (c) 2026 Micael Nildo Oliveira Souza</p>
            <p>
              Permission is hereby granted, free of charge, to any person obtaining a copy
              of this software and associated documentation files (the "Software"), to deal
              in the Software without restriction, including without limitation the rights
              to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
              copies of the Software, and to permit persons to whom the Software is
              furnished to do so, subject to the following conditions:
            </p>
            <p>
              The above copyright notice and this permission notice shall be included in all
              copies or substantial portions of the Software.
            </p>
            <p className="text-slate-400 text-[11px]">
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
              IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
              AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
              LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
              OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
              SOFTWARE.
            </p>
          </div>
        </div>

        {/* LGPD Compliance Section */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-teal-600" />
            <span>LGPD (Lei Geral de Proteção de Dados - Lei 13.709/2018)</span>
          </h3>

          <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Armazenamento Local e Privado:</strong> Todos os dados de saúde e prontuários permanecem armazenados estritamente no dispositivo local do profissional de saúde (IndexedDB/LocalStorage).
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Direito do Titular (Art. 18 LGPD):</strong> O sistema fornece mecanismos diretos para exportação completa dos dados em formato legível (JSON) e exclusão definitiva dos prontuários.
              </span>
            </li>
            <li className="flex items-start space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Consentimento de Saúde:</strong> Todo cadastro de paciente possui registro explícito de consentimento e timestamp de confirmação do paciente.
              </span>
            </li>
          </ul>

          <div className="pt-2 flex flex-wrap gap-2">
            <button
              onClick={handleExportJson}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center space-x-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Backup Total (JSON LGPD)</span>
            </button>

            <button
              onClick={() => setIsImportModalOpen(true)}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white font-semibold text-xs rounded-xl flex items-center space-x-2 hover:bg-slate-200"
            >
              <Database className="w-4 h-4" />
              <span>Restaurar Backup</span>
            </button>

            <button
              onClick={handleClearData}
              className="px-4 py-2 bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold text-xs rounded-xl flex items-center space-x-1 hover:bg-rose-200"
            >
              <Trash2 className="w-4 h-4" />
              <span>Excluir Tudo (Direito ao Esquecimento)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Professional Notice Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl border border-blue-700 shadow-md space-y-3">
        <div className="flex items-center space-x-2 text-blue-300">
          <UserCheck className="w-6 h-6 text-blue-400" />
          <h3 className="text-base font-bold uppercase tracking-wider text-blue-300">
            Aviso Obrigatório de Uso por Profissionais de Saúde Registrados
          </h3>
        </div>
        <p className="text-xs text-slate-200 leading-relaxed max-w-4xl">
          Esta aplicação e suas ferramentas clínicas de diagnóstico, planejamento odontológico, prescrição dietética e módulos de IA destinam-se <strong>exclusivamente ao uso por profissionais devidamente habilitados e registrados em seus respectivos conselhos de classe</strong>:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 bg-white/10 rounded-xl border border-white/10 flex items-center gap-3">
            <span className="text-lg">👨‍⚕️</span>
            <div>
              <p className="font-bold text-white">Médicos</p>
              <p className="text-[11px] text-blue-200">Registro ativo no CRM (Conselho Regional de Medicina)</p>
            </div>
          </div>
          <div className="p-3 bg-white/10 rounded-xl border border-white/10 flex items-center gap-3">
            <span className="text-lg">🦷</span>
            <div>
              <p className="font-bold text-white">Dentistas</p>
              <p className="text-[11px] text-blue-200">Registro ativo no CRO (Conselho Regional de Odontologia)</p>
            </div>
          </div>
          <div className="p-3 bg-white/10 rounded-xl border border-white/10 flex items-center gap-3">
            <span className="text-lg">🥗</span>
            <div>
              <p className="font-bold text-white">Nutricionistas</p>
              <p className="text-[11px] text-blue-200">Registro ativo no CRN (Conselho Regional de Nutricionistas)</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Development Transparency Card */}
      <div className="bg-purple-50 dark:bg-purple-950/40 p-6 rounded-2xl border border-purple-200 dark:border-purple-800/60 space-y-3">
        <div className="flex items-center gap-2 text-purple-900 dark:text-purple-300">
          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h3 className="font-bold text-sm sm:text-base">
            Transparência & Engenharia: Desenvolvimento Assistido por Inteligência Artificial
          </h3>
        </div>
        <p className="text-xs text-purple-900/80 dark:text-purple-200/90 leading-relaxed">
          Em conformidade com as diretrizes de transparência tecnológica e inovação em software para a saúde, declaramos que a estrutura deste sistema web e aplicativo desktop local foi desenvolvida por <strong>Micael Nildo Oliveira Souza</strong> utilizando recursos avançados de engenharia assistida por Inteligência Artificial através da plataforma <strong>Google AI Studio</strong> e modelos <strong>Gemini AI</strong>.
        </p>
      </div>

      {/* Gemini AI, Cloudflare & Clinical Responsibility Terms */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-teal-600" />
          <span>Conformidade Legal Brasileira (LGPD / Marco Civil) e Termos de Plataformas (Google & Cloudflare)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-blue-600 dark:text-blue-400">Termos do Google Cloud & Gemini AI</h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              As funcionalidades de IA utilizam a SDK oficial do Google Gemini (<code className="font-mono text-teal-600">@google/genai</code>) através de rotas de servidor protegidas. Respeita integralmente os Termos de Serviço de IA Generativa do Google. Nenhum dado pessoal não pseudo-anonimizado de pacientes é utilizado para treinamento de modelos públicos.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-orange-600 dark:text-orange-400">Termos de Hospedagem Cloudflare</h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              O sistema é otimizado para deploy em Cloudflare Pages / Workers ou Cloud Run sob HTTPS/TLS 1.3 nativo, cumprindo com a Política de Uso Aceitável (AUP) e padrões globais de segurança de rede e distribuição estática.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-emerald-600 dark:text-emerald-400">Marco Civil da Internet (Lei 12.965/2014)</h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Respeito às garantias de neutralidade da rede, proteção da privacidade, inviolabilidade do fluxo de comunicações e sigilo dos registros locais mantidos exclusivamente sob a custódia do usuário.
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
          <h4 className="font-bold text-amber-600 dark:text-amber-400">Aviso Prévio Médico, Odontológico e Nutricional (CFM nº 1.821/07 e 2.314/22, CFO, CRN)</h4>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            O sistema <strong>OminiClin MNAnimat</strong> e suas ferramentas de suporte atua unicamente como <strong>SISTEMA DE APOIO À DECISÃO CLÍNICA (SADC)</strong>. As sugestões, hipóteses diagnósticas e prescrições geradas têm caráter informativo e auxiliar. A conduta terapêutica, prescrição final e acompanhamento técnico são de responsabilidade direta e inafastável do profissional médico (CRM), cirurgião-dentista (CRO) ou nutricionista (CRN) registrado e responsável.
          </p>
        </div>
      </div>

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Restaurar Backup de Dados (JSON)
            </h3>
            <p className="text-xs text-slate-500">
              Cole o conteúdo do arquivo JSON de backup exportado anteriormente para restaurar pacientes e prontuários.
            </p>

            <textarea
              rows={6}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Cole o código JSON aqui..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 font-mono text-xs text-slate-900 dark:text-white"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700"
              >
                Cancelar
              </button>
              <button
                onClick={handleImportJson}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 text-white hover:bg-teal-700"
              >
                Restaurar Dados
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
