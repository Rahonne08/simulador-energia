/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { Calculator, PieChart, Lightbulb, Zap, TrendingDown, Download, Loader2, Cpu, Activity, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Appliance, BillConfig, TariffFlag } from './types';
import { COMMON_APPLIANCES, TARIFF_FLAGS } from './constants';
import { calculateTotalConsumption, calculateBill, formatCurrency } from './utils';
import ApplianceList from './components/ApplianceList';
import BillEstimate from './components/BillEstimate';
import ConsumptionChart from './components/ConsumptionChart';
import SavingsTips from './components/SavingsTips';
import QuickEstimate from './components/QuickEstimate';
import { ReportTemplate } from './components/ReportTemplate';
import License from './components/License';
import PrivacyPolicy from './components/PrivacyPolicy';
import { generateSavingsTips } from './utils/tips';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type Tab = 'simulador' | 'conta' | 'grafico' | 'dicas' | 'rapido' | 'licenca' | 'privacidade';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('simulador');
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const [billConfig, setBillConfig] = useState<BillConfig>({
    tariff: 0.84318,
    flag: 'verde',
    isLowIncome: false,
    connectionType: 'monofasico',
  });

  const totalConsumption = calculateTotalConsumption(appliances);
  const bill = calculateBill(totalConsumption, billConfig);
  const tips = generateSavingsTips(appliances);

  const handleGeneratePDF = async () => {
    if (!reportRef.current) return;
    
    try {
      setIsGeneratingPDF(true);
      
      // Small delay to ensure the component is fully rendered
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save('relatorio-enercontrol.pdf');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Ocorreu um erro ao gerar o PDF. Tente novamente.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const tabs = [
    { id: 'simulador', label: 'Aparelhos', icon: <Calculator className="w-5 h-5" /> },
    { id: 'conta', label: 'Estimativa & Fatura', icon: <Zap className="w-5 h-5" /> },
    { id: 'grafico', label: 'Análise de Consumo', icon: <PieChart className="w-5 h-5" /> },
    { id: 'dicas', label: 'Otimização IA', icon: <Lightbulb className="w-5 h-5" /> },
    { id: 'rapido', label: 'Estimativa Rápida', icon: <TrendingDown className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#070b13] text-slate-100 font-sans relative overflow-x-hidden pb-10 selection:bg-cyan-500 selection:text-black">
      {/* Futuristic Background Ambient Glows & Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-10 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* Hidden Report Template for PDF Generation */}
      <div className="absolute top-0 left-[-9999px] pointer-events-none z-[-1]">
        <ReportTemplate 
          ref={reportRef}
          appliances={appliances}
          totalConsumption={totalConsumption}
          bill={bill}
          billConfig={billConfig}
          tips={tips}
        />
      </div>

      {/* Futuristic Top Bar / Header */}
      <header className="bg-[#0b111e]/90 backdrop-blur-xl border-b border-cyan-500/20 shadow-lg shadow-cyan-950/40 z-50 relative">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-5 relative z-10">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setActiveTab('simulador')}
              className="flex items-center gap-3 sm:gap-4 hover:opacity-95 transition-all focus:outline-none text-left group"
            >
              <div className="relative flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 rounded-2xl backdrop-blur-md border border-cyan-500/40 group-hover:border-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)]">
                <Zap className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-4 ring-[#0b111e] animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1">
                    Ener<span className="text-cyan-400">Control</span>
                  </h1>
                  <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-400 border border-cyan-500/30 rounded-md tracking-wider">
                    v2.5
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-xs text-slate-400 font-mono tracking-wider uppercase flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                    Equatorial Energia Grid
                  </span>
                </div>
              </div>
            </button>

            <div className="flex items-center gap-3 sm:gap-4">
              {/* Online telemetry indicator */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-mono text-slate-300">
                <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="text-slate-400">TELEMETRIA:</span>
                <span className="text-emerald-400 font-semibold">ATIVA</span>
              </div>

              <button 
                onClick={handleGeneratePDF}
                disabled={isGeneratingPDF}
                className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl transition-all text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {isGeneratingPDF ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                <span className="hidden sm:inline">{isGeneratingPDF ? 'PROCESSANDO...' : 'EXPORTAR RELATÓRIO'}</span>
                <span className="sm:hidden">{isGeneratingPDF ? '...' : 'PDF'}</span>
              </button>

              <div className="lg:hidden flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-cyan-500/30 text-cyan-400 shadow-inner">
                <span className="text-xs font-mono font-bold">{formatCurrency(bill.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <nav 
              className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar sticky top-0 lg:top-auto bg-[#070b13]/80 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none z-40 pt-2 lg:pt-0"
              aria-label="Navegação principal"
            >
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  aria-label={`Aba ${tab.label}`}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                  className={`flex items-center gap-2.5 sm:gap-3.5 px-4 py-3 rounded-2xl transition-all whitespace-nowrap text-sm font-medium ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/15 to-transparent text-cyan-300 font-semibold border-l-4 border-cyan-400 shadow-lg shadow-cyan-950/30 ring-1 ring-cyan-500/30'
                      : `bg-slate-900/60 lg:bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-slate-800/80`
                  }`}
                >
                  <span className={`${activeTab === tab.id ? 'text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]' : 'text-slate-500'}`}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </motion.button>
              ))}
            </nav>

            {/* Futuristic HUD Resumo Mensal */}
            <div className="mt-6 bg-[#0d1424]/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-cyan-500/20 hidden lg:block relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
              <div className="flex items-center justify-between mb-5 border-b border-slate-800 pb-3">
                <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  HUD METRICS // 01
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Consumo Total</p>
                  <p className="text-3xl font-black text-white tracking-tight flex items-baseline gap-1.5">
                    {totalConsumption.toFixed(0)} <span className="text-sm font-mono text-cyan-400 font-normal">kWh/mês</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <p className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1">Custo Estimado</p>
                  <p className="text-3xl font-black text-emerald-400 tracking-tight drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    {formatCurrency(bill.total)}
                  </p>
                </div>

                <div className="pt-2">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold border ${TARIFF_FLAGS[billConfig.flag]?.bg || 'bg-slate-800'} ${TARIFF_FLAGS[billConfig.flag]?.color || 'text-slate-300'} border-current/30 shadow-sm`}>
                    <span className="w-2 h-2 rounded-full bg-current animate-ping"></span>
                    {TARIFF_FLAGS[billConfig.flag]?.label || 'Bandeira Desconhecida'}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Estimate CTA Button */}
            <div className="mt-4 hidden lg:block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('rapido')}
                aria-label="Acessar Estimativa Rápida"
                className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-cyan-950/40 hover:to-indigo-950/40 text-cyan-300 hover:text-cyan-200 px-5 py-3.5 rounded-2xl font-bold transition-all shadow-lg border border-cyan-500/30 hover:border-cyan-400/60 group"
              >
                <TrendingDown className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm tracking-wide">Estimativa Rápida</span>
              </motion.button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <div className="bg-[#0d1424]/90 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-cyan-950/20 border border-slate-800/90 min-h-[600px] overflow-hidden relative">
              {/* Futuristic Top Glowing Laser Accent */}
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyan-400 via-indigo-500 to-emerald-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]"></div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  {activeTab === 'simulador' && (
                    <ApplianceList appliances={appliances} setAppliances={setAppliances} />
                  )}
                  {activeTab === 'conta' && (
                    <BillEstimate 
                      appliances={appliances} 
                      billConfig={billConfig} 
                      setBillConfig={setBillConfig} 
                      totalConsumption={totalConsumption}
                      bill={bill}
                    />
                  )}
                  {activeTab === 'grafico' && (
                    <ConsumptionChart appliances={appliances} totalConsumption={totalConsumption} />
                  )}
                  {activeTab === 'dicas' && (
                    <SavingsTips appliances={appliances} />
                  )}
                  {activeTab === 'rapido' && (
                    <QuickEstimate />
                  )}
                  {activeTab === 'licenca' && (
                    <License />
                  )}
                  {activeTab === 'privacidade' && (
                    <PrivacyPolicy />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 pt-12 pb-8 text-center text-xs font-mono text-slate-500 relative z-10">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-6">
          <button 
            onClick={() => setActiveTab('privacidade')}
            className="text-slate-400 hover:text-cyan-400 transition-colors uppercase tracking-wider flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
            Política de Privacidade
          </button>
          <span className="hidden sm:inline text-slate-700">&bull;</span>
          <button 
            onClick={() => setActiveTab('licenca')}
            className="text-slate-400 hover:text-cyan-400 transition-colors uppercase tracking-wider"
          >
            Termos de Uso (EULA)
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 mb-3 opacity-60">
           <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
           <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
           <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        </div>
        <div className="tracking-widest uppercase">
          <span className="text-slate-600">Desenvolvido por</span> <a href="https://github.com/Rahonne08" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">Pablo Rahonne</a> <span className="text-slate-600">&bull; Equatorial Energia</span>
        </div>
      </footer>
    </div>
  );
}
