import React, { useState } from 'react';
import {
  Download,
  Monitor,
  Smartphone,
  Cloud,
  CheckCircle2,
  HardDrive,
  ShieldCheck,
  FileCode,
  Sparkles,
  Server,
  Layers,
} from 'lucide-react';
import { ExportPackageUtils } from '../utils/exportPackages';

export const DownloadCenter: React.FC = () => {
  const [isDownloadingWindows, setIsDownloadingWindows] = useState(false);
  const [isDownloadingAndroid, setIsDownloadingAndroid] = useState(false);

  const handleWindowsDownload = async () => {
    setIsDownloadingWindows(true);
    await ExportPackageUtils.downloadWindowsPackage();
    setIsDownloadingWindows(false);
  };

  const handleAndroidDownload = async () => {
    setIsDownloadingAndroid(true);
    await ExportPackageUtils.downloadAndroidPackage();
    setIsDownloadingAndroid(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-cyan-800 to-slate-900 text-white p-6 rounded-2xl shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-md bg-white/20 text-xs font-semibold">
            Central de Execução Local & Nuvem
          </span>
          <h2 className="text-2xl font-black mt-1">
            Download do Sistema (Windows & Android) e Hospedagem Cloudflare
          </h2>
          <p className="text-xs text-teal-100 mt-1 max-w-2xl">
            O OminiClin MNAnimat é totalmente portátil. Baixe os arquivos pré-configurados para rodar no seu computador Windows, compilar para Android ou hospedar no Cloudflare Pages com segurança total.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-white/10 p-3 rounded-xl backdrop-blur text-xs">
          <HardDrive className="w-5 h-5 text-teal-300" />
          <div>
            <p className="font-bold">100% Funcional Off-line</p>
            <p className="text-[10px] text-teal-200">Sem dependência de servidores externos</p>
          </div>
        </div>
      </div>

      {/* Main Download Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Windows Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/80 text-sky-600 dark:text-sky-300 flex items-center justify-center">
              <Monitor className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Versão Local para Windows
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Pacote portátil contendo o inicializador automático <code className="font-mono text-teal-600">iniciar_ominiclin_mnanimat.bat</code> e launcher HTML local.
              </p>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Roda sem instalar Node.js ou gerenciadores complexos</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Armazenamento isolado no seu disco rígido</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span>Inclui arquivo LICENSE MIT oficial</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleWindowsDownload}
            disabled={isDownloadingWindows}
            className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloadingWindows ? 'Gerando Pacote ZIP...' : 'Baixar Pacote Windows (.ZIP)'}</span>
          </button>
        </div>

        {/* Android Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 flex items-center justify-center">
              <Smartphone className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Versão para Android & APK
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Instale como PWA direto no celular ou baixe a estrutura do projeto Capacitor para compilar seu arquivo APK no Android Studio.
              </p>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Suporte a PWA com Service Worker offline</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span><code className="font-mono">capacitor.config.json</code> pré-configurado</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Guia passo a passo de compilação em TXT</span>
              </li>
            </ul>
          </div>

          <button
            onClick={handleAndroidDownload}
            disabled={isDownloadingAndroid}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloadingAndroid ? 'Gerando Pacote Android...' : 'Baixar Projeto Android / APK (.ZIP)'}</span>
          </button>
        </div>

        {/* Cloudflare Pages & GitHub Pages Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-300 flex items-center justify-center">
              <Cloud className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Hospedagem GitHub Pages & Cloudflare Pages
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Totalmente otimizado para publicar online no GitHub Pages ou Cloudflare Pages com HTTPS, roteamento SPA e segurança LGPD.
              </p>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Base relativa (<code className="font-mono">base: './'</code>) configurada no Vite</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Arquivos <code className="font-mono">.nojekyll</code>, <code className="font-mono">404.html</code> e <code className="font-mono">_redirects</code> incluídos</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                <span>SSL/HTTPS automático e proteção DDoS nativa</span>
              </li>
            </ul>
          </div>

          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 rounded-xl border border-amber-200 dark:border-amber-800 text-[11px] text-amber-800 dark:text-amber-200 font-medium text-center">
            Pronto para Deploy Direto no GitHub Pages ou Cloudflare
          </div>
        </div>
      </div>

      {/* Deploy Instructions Panel */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Server className="w-5 h-5 text-teal-600" />
          <span>Como Publicar no GitHub Pages e Cloudflare Pages</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* GitHub Pages Instructions */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <h4 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <FileCode className="w-4 h-4" />
                <span>GitHub Pages</span>
              </h4>
              <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded font-semibold">
                Grátis
              </span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-300 leading-relaxed">
              <li>Suba o projeto para um repositório (público ou privado) no GitHub.</li>
              <li>Acesse <strong>Settings &gt; Pages</strong> no repositório.</li>
              <li>Em <strong>Source</strong>, escolha <em>GitHub Actions</em> ou selecione a branch <code className="font-mono">main</code> / pasta <code className="font-mono">docs</code> / <code className="font-mono">gh-pages</code>.</li>
              <li>O arquivo <code className="font-mono">.nojekyll</code> e o <code className="font-mono">404.html</code> garantem que todas as páginas e rotas recarreguem perfeitamente!</li>
            </ol>
          </div>

          {/* Cloudflare Pages Instructions */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <h4 className="font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                <Cloud className="w-4 h-4" />
                <span>Cloudflare Pages</span>
              </h4>
              <span className="text-[10px] bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded font-semibold">
                Alta Performance
              </span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-600 dark:text-slate-300 leading-relaxed">
              <li>Acesse seu painel Cloudflare e vá em <strong>Workers &amp; Pages &gt; Create application &gt; Pages</strong>.</li>
              <li>Conecte sua conta do GitHub e escolha o repositório deste projeto.</li>
              <li>Defina o comando de build como <code className="font-mono">npm run build</code> e a pasta de saída como <code className="font-mono">dist</code>.</li>
              <li>O arquivo <code className="font-mono">_redirects</code> trata o roteamento SPA e os cabeçalhos de segurança garantem proteção total.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
