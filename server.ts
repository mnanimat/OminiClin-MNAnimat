import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini SDK with telemetry header
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health & Metadata API
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    app: "OmniClin - Rotina Clínica Multidisciplinar",
    author: "Micael Nildo Oliveira Souza",
    license: "MIT",
    version: "1.0.0",
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Gemini Clinical Analysis Endpoint
app.post("/api/gemini/analyze", async (req, res) => {
  try {
    const { prompt, profession, patientContext, taskType } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Local smart fallback when API key is not present or offline
      return res.json({
        success: true,
        source: "offline_engine",
        text: getLocalClinicalResponse(profession, taskType, prompt, patientContext),
      });
    }

    const systemInstruction = `Você é o assistente virtual inteligente do sistema OmniClin, desenvolvido por Micael Nildo Oliveira Souza sob Licença MIT e conformidade com a LGPD (Lei 13.709/2018).
Seu objetivo é auxiliar ${profession || "Profissionais de Saúde"} (Médicos, Dentistas e Nutricionistas) na elaboração de anamneses, condutas clínicas, resumos para receitas, sugestões de CID-10, tabelas antropométricas e planos alimentares.
IMPORTANTE: Suas respostas são caráter AUXILIAR e DE APOIO À DECISÃO CLÍNICA. Toda decisão final é de responsabilidade do profissional de saúde devidamente inscrito no CRM/CFO/CRN.
Sempre responda de forma estruturada, em Português do Brasil, profissional, clara e direta.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Contexto do Paciente:\n${JSON.stringify(patientContext || {})}\n\nSolicitação (${taskType || "Geral"}):\n${prompt}`,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    return res.json({
      success: true,
      source: "gemini_3.6_flash",
      text: response.text || "Sem resposta gerada.",
    });
  } catch (err: any) {
    console.error("Erro na API Gemini Analyze:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Falha na comunicação com o serviço de IA.",
    });
  }
});

// Gemini Image Generation Endpoint
app.post("/api/gemini/generate-image", async (req, res) => {
  try {
    const { prompt, category, aspectRatio = "1:1" } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback message when API key is missing
      return res.status(400).json({
        success: false,
        error: "Chave GEMINI_API_KEY não configurada no servidor. Para gerar imagens com IA realista no Gemini, adicione a chave em Configurações > Secrets.",
      });
    }

    const imagePrompt = `Photorealistic, highly detailed clinical healthcare visual, professional medical lighting, clean studio finish, subject: ${prompt}. Professionally presented for medical, dental or nutritional education and diagnosis report. High precision, realistic textures.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-image",
      contents: {
        parts: [{ text: imagePrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
        },
      },
    });

    let imageUrl = null;
    let descriptionText = "";

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageUrl = `data:${part.inlineData.mimeType || "image/png"};base64,${part.inlineData.data}`;
        } else if (part.text) {
          descriptionText += part.text;
        }
      }
    }

    if (!imageUrl) {
      return res.status(500).json({
        success: false,
        error: "Não foi possível extrair a imagem da resposta do Gemini.",
      });
    }

    return res.json({
      success: true,
      imageUrl,
      description: descriptionText,
    });
  } catch (err: any) {
    console.error("Erro na API Gemini Generate Image:", err);
    return res.status(500).json({
      success: false,
      error: err.message || "Erro ao gerar imagem realista no Gemini.",
    });
  }
});

// Local Fallback response generator for offline / fallback mode
function getLocalClinicalResponse(profession: string, taskType: string, prompt: string, context: any): string {
  const name = context?.name || "Paciente sem nome";
  const age = context?.age ? `${context.age} anos` : "";

  if (profession === "Dentista" || taskType === "odontograma") {
    return `### 🦷 Sugestão Clínica Odontológica (Modo Local Offline)
**Paciente:** ${name} (${age})
**Avaliação Solicitada:** ${prompt}

**Recomendações e Conduta:**
1. **Exame Clínico:** Proceder com sondagem periodontal nos quadrantes indicados e checagem de oclusão.
2. **Procedimentos Sugeridos:** Profilaxia, aplicação de selante ou restauração conforme mapeamento do Odontograma.
3. **Orientações:** Uso diário de fio dental e escovação com dentifrócio fluoretado (1450ppm).
*Nota LGPD:* Dados salvos localmente no dispositivo.`;
  }

  if (profession === "Nutricionista" || taskType === "nutricao") {
    return `### 🥗 Plano e Análise Antropométrica (Modo Local Offline)
**Paciente:** ${name} (${age})
**Meta:** ${prompt}

**Diretrizes Nutricionais Sólidas:**
- **Distribuição de Macronutrientes:** ~50% Carboidratos complexos, 25% Proteínas de alto valor biológico, 25% Gorduras insaturadas.
- **Hidratação Recomendada:** 35 ml/kg de peso corporal.
- **Micro-nutrientes:** Foco em Fibras (25-30g/dia) e Micronutrientes antioxidantes.
- **Acompanhamento:** Reavaliação das dobras cutâneas e bioimpedância em 30 dias.`;
  }

  return `### 🩺 Resumo da Anamnese e Conduta Médica (Modo Local Offline)
**Paciente:** ${name} (${age})
**Queixa Principal / Motivo:** ${prompt}

**Sugestão de Estruturação:**
1. **Anamnese e Exame Físico:** Avaliar sinais vitais, ausculta e dor de escala analógica visual.
2. **Diagnóstico Diferencial & CID-10:** Verifique na lista interna do sistema a codificação compatível.
3. **Conduta Farmacológica:** Emitir receita simples/controlada com posologia detalhada e orientações de repouso.
*Desenvolvido por Micael Nildo Oliveira Souza - Licença MIT.*`;
}

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[OmniClin] Servidor rodando em http://localhost:${PORT}`);
  });
}

startServer();
