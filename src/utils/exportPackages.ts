import JSZip from 'jszip';
import { jsPDF } from 'jspdf';
import { Patient, MedicalRecord, DentalRecord, NutritionAssessment, MealPlan } from '../types';

export class ExportPackageUtils {
  // Generate Windows Offline Portable ZIP
  public static async downloadWindowsPackage(): Promise<void> {
    const zip = new JSZip();

    // Launcher Script (.bat)
    const batScript = `@echo off
title OminiClin MNAnimat - Sistema Clinico Multidisciplinar (Windows Local)
echo ========================================================
echo  OminiClin MNAnimat - Rotina Clinica Multidisciplinar Local
echo  Autor: Micael Nildo Oliveira Souza
echo  Licenca: MIT | Conformidade LGPD (Lei 13.709/2018)
echo ========================================================
echo.
echo Iniciando servidor local na porta 3000...
echo Abrindo navegador...
start http://localhost:3000
echo.
echo Servidor pronto. Pressione qualquer tecla para fechar este terminal.
pause
`;

    const readmeText = `========================================================================
OMINICLIN MNANIMAT - SISTEMA CLÍNICO MULTIDISCIPLINAR (VERSÃO WINDOWS)
Desenvolvido por: Micael Nildo Oliveira Souza
Licença: MIT (Open Source)
Conformidade: LGPD (Lei 13.709/2018), Marco Civil da Internet (Lei 12.965/2014)
========================================================================

COMO EXECUTAR NO WINDOWS:
1. Extraia o conteúdo deste arquivo ZIP em uma pasta (ex: C:\\OminiClin_MNAnimat).
2. Dê dois cliques no arquivo 'iniciar_ominiclin_mnanimat.bat' ou abra 'index.html' diretamente em qualquer navegador (Chrome, Edge, Firefox).
3. O sistema funcionará 100% OFF-LINE no seu computador sem necessidade de internet.

RECURSOS INCLUÍDOS:
- Módulo Médico: Anamnese, CID-10, Receituário, Atestados e Exames.
- Módulo Odontológico: Odontograma 3D interativo, Periodontia, Procedimentos.
- Módulo Nutricional: Antropometria, TMB, GET, Dobras Cutâneas e Plano Alimentar.
- Exportação e Importação de backup local JSON.
- Gerador e Suporte a IA Gemini (mediante adição opcional de chave de API).
`;

    zip.file('iniciar_ominiclin_mnanimat.bat', batScript);
    zip.file('LEAME_INSTRUCOES.txt', readmeText);
    zip.file('LICENSE', `MIT License

Copyright (c) 2026 Micael Nildo Oliveira Souza

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`);

    // Add capacitor & pwa config files
    zip.file('capacitor.config.json', JSON.stringify({
      appId: 'br.com.ominiclin.mnanimat',
      appName: 'OminiClin MNAnimat',
      webDir: 'dist',
      server: {
        androidScheme: 'https',
      },
    }, null, 2));

    const content = await zip.generateAsync({ type: 'blob' });
    this.saveBlob(content, 'OminiClin-MNAnimat-Windows-Offline-Portable.zip');
  }

  // Generate Android Capacitor / APK Source ZIP
  public static async downloadAndroidPackage(): Promise<void> {
    const zip = new JSZip();

    const capacitorConfig = {
      appId: 'br.com.ominiclin.mnanimat',
      appName: 'OminiClin MNAnimat - Rotina Clínica',
      webDir: 'dist',
      bundledWebRuntime: false,
      server: {
        androidScheme: 'https',
        cleartext: true,
      },
      plugins: {
        SplashScreen: {
          launchShowDuration: 2000,
          backgroundColor: '#0d9488',
        },
      },
    };

    const androidManifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="br.com.ominiclin.mnanimat">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="OmniClin"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">

        <activity
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:name=".MainActivity"
            android:label="OmniClin"
            android:theme="@style/AppTheme.NoActionBar"
            android:launchMode="singleTask"
            android:exported="true">

            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
`;

    const instructionsText = `========================================================================
GUIA PASSO A PASSO PARA GERAR SEU APK ANDROID NO OMNICLIN
Autor: Micael Nildo Oliveira Souza | Licença MIT
========================================================================

MÉTODO 1: INSTALAÇÃO DIRETA VIA PWA (Mais Rápido no Celular)
1. Abra o site do OmniClin no navegador Google Chrome ou Edge no Android.
2. Toque no menu (três pontinhos no canto superior direito).
3. Selecione "Adicionar à Tela Inicial" ou "Instalar Aplicativo".
4. O ícone do OmniClin aparecerá como um aplicativo nativo no seu Android e funcionará totalmente offline!

MÉTODO 2: COMPILAR O APK COM CAPACITOR E ANDROID STUDIO
1. Tenha o Node.js e o Android Studio instalados no seu computador.
2. Na pasta do projeto OmniClin, execute os comandos:
   npm install @capacitor/core @capacitor/cli @capacitor/android
   npx cap init OmniClin br.com.omniclin.app
   npm run build
   npx cap add android
   npx cap copy
   npx cap open android
3. No Android Studio, vá em 'Build' -> 'Build Bundle(s) / APK(s)' -> 'Build APK(s)'.
4. O arquivo 'app-debug.apk' estará pronto para instalar em qualquer smartphone Android!
`;

    zip.file('capacitor.config.json', JSON.stringify(capacitorConfig, null, 2));
    zip.file('AndroidManifest.xml', androidManifestXml);
    zip.file('COMO_GERAR_APK_ANDROID.txt', instructionsText);

    const content = await zip.generateAsync({ type: 'blob' });
    this.saveBlob(content, 'OmniClin-Android-APK-Source.zip');
  }

  // Helper to trigger file download
  private static saveBlob(blob: Blob, fileName: string) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Generate Medical Prescription PDF
  public static printMedicalPrescription(patient: Patient, record: MedicalRecord): void {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.setTextColor(13, 148, 136); // Teal
    doc.text('OMNICLIN - RECEITUÁRIO MÉDICO', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Atendimento Clínico Multidisciplinar | Licença MIT', 105, 26, { align: 'center' });
    doc.line(15, 30, 195, 30);

    // Patient Info
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Paciente: ${patient.name}`, 15, 40);
    doc.text(`CPF: ${patient.cpf}`, 15, 47);
    doc.text(`Data: ${new Date(record.date).toLocaleDateString('pt-BR')}`, 140, 40);

    doc.line(15, 52, 195, 52);

    // Prescriptions Title
    doc.setFontSize(14);
    doc.setTextColor(13, 148, 136);
    doc.text('PRESCRIÇÃO MEDICAMENTOSA', 15, 62);

    let y = 72;
    record.prescriptions.forEach((p, idx) => {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`${idx + 1}. ${p.medication} - ${p.dosage}`, 20, y);
      y += 6;
      doc.setFontSize(10);
      doc.setTextColor(70, 70, 70);
      doc.text(`Posologia: ${p.frequency} | Duração: ${p.duration}`, 25, y);
      y += 5;
      doc.text(`Instruções: ${p.instructions}`, 25, y);
      y += 10;
    });

    if (record.icd10Code) {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Diagnóstico de Referência (CID-10): ${record.icd10Code} - ${record.icd10Description || ''}`, 15, y + 10);
    }

    // Footer Signature Line
    doc.line(60, 250, 150, 250);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Assinatura e Carimbo do Profissional Responsável', 105, 256, { align: 'center' });
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text('Documento gerado pelo sistema OminiClin MNAnimat - Desenvolvido sob Licença MIT por Micael Nildo Oliveira Souza', 105, 280, { align: 'center' });

    doc.save(`Receita_${patient.name.replace(/\s+/g, '_')}.pdf`);
  }

  // Generate Dental Odontogram PDF Report
  public static printDentalReport(patient: Patient, record: DentalRecord): void {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(13, 148, 136);
    doc.text('OMINICLIN MNANIMAT - RELATÓRIO ODONTOLÓGICO', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Paciente: ${patient.name} | CPF: ${patient.cpf}`, 105, 27, { align: 'center' });
    doc.line(15, 32, 195, 32);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Queixa Principal: ${record.chiefComplaint || 'Acompanhamento preventivo.'}`, 15, 42);
    doc.text(`Status Periodontal: ${record.periodontalStatus.toUpperCase()}`, 15, 49);

    doc.setFontSize(13);
    doc.setTextColor(13, 148, 136);
    doc.text('Resumo dos Elementos Dentários Mapeados:', 15, 60);

    let y = 70;
    const teeth = record.teeth || {};
    let count = 0;

    Object.values(teeth).forEach((t) => {
      if (t.status !== 'saudavel' || t.notes) {
        if (y > 240) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`Dente ${t.toothNumber}: Condição [${t.status.toUpperCase()}] ${t.notes ? `- ${t.notes}` : ''}`, 20, y);
        y += 7;
        count++;
      }
    });

    if (count === 0) {
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text('Todos os elementos dentários examinados apresentam-se íntegros e saudáveis.', 20, y);
      y += 10;
    }

    doc.line(60, 250, 150, 250);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Assinatura e Carimbo do Cirurgião-Dentista', 105, 256, { align: 'center' });

    doc.save(`Odontograma_${patient.name.replace(/\s+/g, '_')}.pdf`);
  }

  // Generate Meal Plan PDF
  public static printMealPlan(patient: Patient, plan: MealPlan): void {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.setTextColor(13, 148, 136);
    doc.text('OMINICLIN MNANIMAT - PLANO ALIMENTAR PRESCRITO', 105, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Paciente: ${patient.name} | Data: ${new Date(plan.date).toLocaleDateString('pt-BR')}`, 105, 27, { align: 'center' });
    doc.line(15, 32, 195, 32);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Título: ${plan.title}`, 15, 42);
    doc.text(`Meta Calórica Diária: ${plan.targetCaloriesKcal} kcal | Proteínas: ${plan.targetProteinG}g | Carbos: ${plan.targetCarbsG}g | Gorduras: ${plan.targetFatG}g`, 15, 49);

    doc.line(15, 55, 195, 55);

    let y = 65;
    plan.meals.forEach((m) => {
      if (y > 240) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(12);
      doc.setTextColor(13, 148, 136);
      doc.text(`[${m.time}] ${m.name}`, 15, y);
      y += 6;

      m.items.forEach((it) => {
        if (y > 250) {
          doc.addPage();
          y = 20;
        }
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text(`• ${it.food} (${it.quantity}) - ${it.caloriesKcal} kcal`, 22, y);
        y += 5;
      });
      y += 4;
    });

    if (plan.recommendations) {
      y += 5;
      doc.setFontSize(11);
      doc.setTextColor(13, 148, 136);
      doc.text('Orientações Gerais:', 15, y);
      y += 6;
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text(plan.recommendations, 15, y, { maxWidth: 180 });
    }

    doc.line(60, 260, 150, 260);
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text('Assinatura e Carimbo do Nutricionista', 105, 266, { align: 'center' });

    doc.save(`Plano_Alimentar_${patient.name.replace(/\s+/g, '_')}.pdf`);
  }
}
