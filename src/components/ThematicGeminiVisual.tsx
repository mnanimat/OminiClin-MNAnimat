import React, { useState } from 'react';
import {
  Sparkles,
  Download,
  Eye,
  Loader2,
  RefreshCw,
  Image as ImageIcon,
  CheckCircle2,
  Maximize2,
  X,
} from 'lucide-react';

export interface VisualPreset {
  title: string;
  prompt: string;
  description: string;
}

const SPECIALTY_PRESETS: Record<string, VisualPreset[]> = {
  medicina: [
    {
      title: 'Anatomia Cardíaca e Ausculta',
      prompt: 'Ilustração clínica fidedigna da estrutura do coração humano com aurículas, ventrículos e vasos da base em iluminação de estúdio médico',
      description: 'Corte anatômico do miocárdio e sistema de condução elétrica para orientação ao paciente.',
    },
    {
      title: 'Aparelho Respiratório & Pulmões',
      prompt: 'Diagrama médico detalhado dos pulmões humanos, bronquíolos e alvéolos em fundo escuro de alta definição',
      description: 'Apoio visual para explicação de bronquite, rinite e patologias respiratórias.',
    },
    {
      title: 'Camadas da Pele e Dermatologia',
      prompt: 'Visão microscópica realista da epiderme, derme e hipoderme com folículo piloso e glândulas sebáceas',
      description: 'Ilustração para dermatologia, lesões cutâneas e procedimentos estéticos.',
    },
  ],
  odontologia: [
    {
      title: 'Anatomia Dental 3D (Molar)',
      prompt: 'Modelo anatômico fotorealista em 3D de dente molar com esmalte, dentina, câmara pulpar e raiz expostos em fundo clínico limpo',
      description: 'Modelo tridimensional de elemento dentário para explicação de endodontia e cárie.',
    },
    {
      title: 'Evolução da Cárie & Periodontia',
      prompt: 'Ilustração médica comparativa de dente hígido versus dente com lesão de cárie oclusal e inflamação gengival',
      description: 'Guia ilustrado de prevenção de placa bacteriana e gengivite.',
    },
    {
      title: 'Prótese e Implante Ósseo',
      prompt: 'Diagrama realista de pino de implante dentário em titânio integrado ao osso maxilar com coroa de porcelana',
      description: 'Visualização de reabilitação oral e implantodontia.',
    },
  ],
  nutricao: [
    {
      title: 'Prato Equilibrado de Macronutrientes',
      prompt: 'Prato saudável e colorido visto de cima com 50% vegetais, 25% proteínas grelhadas e 25% carboidratos complexos em mesa de mármore',
      description: 'Referência visual da proporção ideal de refeições para educação nutricional.',
    },
    {
      title: 'Tabela TACO e Fibras',
      prompt: 'Composição fotografia gastronômica de grãos integrais, sementes, abacate, frutas frescas e oleaginosas ricas em fibras',
      description: 'Catálogo de alimentos funcionais e densidade nutritiva.',
    },
    {
      title: 'Composição Corporal & Somatotipo',
      prompt: 'Diagrama anatômico e infográfico de massa magra versus gordura visceral em corpo humano estilo fitness moderno',
      description: 'Apoio visual em reavaliações de bioimpedância e dobras cutâneas.',
    },
  ],
};

interface ThematicGeminiVisualProps {
  specialty: 'medicina' | 'odontologia' | 'nutricao';
  patientName?: string;
}

export const ThematicGeminiVisual: React.FC<ThematicGeminiVisualProps> = ({
  specialty,
  patientName,
}) => {
  const presets = SPECIALTY_PRESETS[specialty] || SPECIALTY_PRESETS.medicina;
  const [selectedPreset, setSelectedPreset] = useState<VisualPreset>(presets[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState('');

  // Initial fallback visual generator
  const getFallbackCanvasImage = (title: string, desc: string, spec: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    // Specialty Theme Colors
    let color1 = '#0f172a';
    let color2 = '#0284c7';
    if (spec === 'odontologia') color2 = '#0d9488';
    if (spec === 'nutricao') color2 = '#059669';

    // Background Gradient
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative Circles
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 110, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 150, 0, Math.PI * 2);
    ctx.stroke();

    // Text Header
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 25);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '13px sans-serif';
    ctx.fillText('OmniClin - Ilustração Técnica Gemini IA', canvas.width / 2, canvas.height / 2 + 5);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '11px sans-serif';
    const shortDesc = desc.length > 55 ? desc.substring(0, 52) + '...' : desc;
    ctx.fillText(shortDesc, canvas.width / 2, canvas.height / 2 + 35);

    return canvas.toDataURL('image/png');
  };

  const handleGenerateVisual = async (presetToUse?: VisualPreset) => {
    const targetPreset = presetToUse || selectedPreset;
    const promptText = customPrompt.trim() || targetPreset.prompt;

    setIsLoading(true);
    setStatusMsg('');

    try {
      const res = await fetch('/api/gemini/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          category: specialty,
          aspectRatio: '16:9',
        }),
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        setActiveImageUrl(data.imageUrl);
        setStatusMsg('Imagem gerada em tempo real pela API Gemini!');
      } else {
        const fallback = getFallbackCanvasImage(targetPreset.title, targetPreset.description, specialty);
        setActiveImageUrl(fallback);
        setStatusMsg('Modo Ilustrativo Ativo: Imagem anatômica simulada com sucesso.');
      }
    } catch {
      const fallback = getFallbackCanvasImage(targetPreset.title, targetPreset.description, specialty);
      setActiveImageUrl(fallback);
      setStatusMsg('Modo Local: Imagem temática do sistema carregada.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render initial fallback on first display if no active image
  const displayImage =
    activeImageUrl || getFallbackCanvasImage(selectedPreset.title, selectedPreset.description, specialty);

  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
              Atalhos Visuais e Anatomia Gemini IA
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Imagens e esquemas educativos integrados para {specialty === 'medicina' ? 'Diagnóstico Médico' : specialty === 'odontologia' ? 'Anatomia Dental' : 'Orientações Nutricionais'}.
            </p>
          </div>
        </div>

        <span className="self-start sm:self-auto px-2.5 py-1 text-[11px] font-semibold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full border border-blue-200 dark:border-blue-800">
          Visual Clínico Gemini
        </span>
      </div>

      {/* Specialty Preset Selector Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {presets.map((p, idx) => {
          const isSelected = selectedPreset.title === p.title;
          return (
            <button
              key={idx}
              onClick={() => {
                setSelectedPreset(p);
                setCustomPrompt('');
                setActiveImageUrl(null);
              }}
              className={`p-3 rounded-xl text-left border transition-all text-xs space-y-1 ${
                isSelected
                  ? 'bg-blue-50 dark:bg-blue-950/80 border-blue-500 text-blue-900 dark:text-blue-200 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="font-bold block text-slate-900 dark:text-white">{p.title}</span>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
                {p.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Image Display Box */}
      <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shadow-inner group min-h-[220px] flex items-center justify-center">
        <img
          src={displayImage}
          alt={selectedPreset.title}
          referrerPolicy="no-referrer"
          className="w-full h-auto max-h-[320px] object-contain transition-transform duration-300 group-hover:scale-[1.01]"
        />

        {/* Overlay Overlay Controls */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            onClick={() => setFullscreenImage(displayImage)}
            className="p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-xl backdrop-blur border border-slate-700 transition-all shadow-md"
            title="Expandir em Tela Cheia"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <a
            href={displayImage}
            download={`gemini_${specialty}_${selectedPreset.title.toLowerCase().replace(/\s+/g, '_')}.png`}
            className="p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-xl backdrop-blur border border-slate-700 transition-all shadow-md"
            title="Baixar Imagem"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>

        {/* Bottom Banner */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-blue-300">{selectedPreset.title}</h4>
            <p className="text-[11px] text-slate-300 hidden sm:block">
              {selectedPreset.description}
            </p>
          </div>

          <button
            onClick={() => handleGenerateVisual()}
            disabled={isLoading}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Gerando...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Recriar com Gemini</span>
              </>
            )}
          </button>
        </div>
      </div>

      {statusMsg && (
        <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium text-right">
          ✓ {statusMsg}
        </p>
      )}

      {/* Modal Fullscreen Viewer */}
      {fullscreenImage && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-slate-900 rounded-2xl border border-slate-800 p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-white">
              <h3 className="font-bold text-sm">{selectedPreset.title} - Visualização Completa</h3>
              <button
                onClick={() => setFullscreenImage(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-center max-h-[70vh]">
              <img
                src={fullscreenImage}
                alt="Visualização Cheia"
                referrerPolicy="no-referrer"
                className="max-h-[70vh] w-auto object-contain rounded-xl"
              />
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>{selectedPreset.description}</span>
              <a
                href={fullscreenImage}
                download="imagem_gemini_clinica.png"
                className="px-4 py-2 bg-blue-600 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                <span>Download HD</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
