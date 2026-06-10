/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef } from 'react';
import { Calculator, PieChart, Lightbulb, Zap, Settings, TrendingDown, Moon, Sun, Download, Loader2, Trophy, Star } from 'lucide-react';
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
    { id: 'conta', label: 'Estimativa', icon: <Zap className="w-5 h-5" /> },
    { id: 'grafico', label: 'Gráfico', icon: <PieChart className="w-5 h-5" /> },
    { id: 'dicas', label: 'Dicas', icon: <Lightbulb className="w-5 h-5" /> },
    { id: 'rapido', label: 'Estimativa Rápida', icon: <TrendingDown className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans relative overflow-x-hidden pb-10">
      {/* Banner Comemorativo Copa do Mundo */}
      <div className="bg-br-blue text-white text-center py-2 text-xs sm:text-sm font-semibold tracking-wider flex items-center justify-center gap-2 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <Trophy className="w-4 h-4 text-br-yellow animate-pulse" />
        <span>EnerControl na Torcida do Brasil 🇧🇷 Copa do Mundo</span>
        <Star className="w-4 h-4 text-br-yellow" fill="currentColor" />
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

      <header className="bg-gradient-to-r from-br-green to-[#007A2E] text-white shadow-lg z-50 relative overflow-hidden border-b-4 border-br-yellow">
        {/* Padrão geométrico suave no fundo do header */}
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTAgMGwyMCAyME0yMCAwbC0yMCAyMCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz48L3N2Zz4=')]"></div>
        
        <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 relative z-10">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => setActiveTab('simulador')}
              className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-all focus:outline-none text-left group"
            >
              <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 group-hover:bg-white/30 transition-colors shadow-inner">
                <Zap className="w-6 h-6 sm:w-7 sm:h-7 text-br-yellow" fill="currentColor" />
                <Star className="w-3 h-3 text-br-yellow absolute -right-1 -top-1 animate-bounce" fill="currentColor" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white drop-shadow-md flex items-center gap-1">
                  EnerControl
                </h1>
                <span className="text-[10px] sm:text-xs text-br-yellow font-bold tracking-widest uppercase">Equatorial Energia</span>
              </div>
            </button>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleGeneratePDF}
                disabled={isGeneratingPDF}
                className="flex items-center gap-2 bg-br-yellow text-br-blue hover:bg-[#FFE533] disabled:bg-[#FFE533]/70 disabled:cursor-not-allowed px-4 py-2 sm:px-5 sm:py-2.5 rounded-full transition-all text-sm font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                {isGeneratingPDF ? <Loader2 className="w-4 h-4 animate-spin text-br-blue" /> : <Download className="w-4 h-4 text-br-blue" />}
                <span className="hidden sm:inline">{isGeneratingPDF ? 'Gerando...' : 'Gerar Relatório'}</span>
              </button>
              <div className="lg:hidden flex items-center gap-2 bg-br-blue/80 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-inner text-br-yellow">
                <span className="text-sm font-bold">{formatCurrency(bill.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <nav 
              className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar sticky top-0 lg:top-auto bg-slate-50 lg:bg-transparent z-40 pt-2 lg:pt-0"
              aria-label="Navegação principal"
            >
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  aria-label={`Aba ${tab.label}`}
                  aria-current={activeTab === tab.id ? 'page' : undefined}
                  className={`flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:py-3 rounded-xl transition-all whitespace-nowrap text-sm sm:text-base font-medium ${
                    activeTab === tab.id
                      ? 'bg-br-blue text-white shadow-lg shadow-br-blue/20 ring-2 ring-br-yellow ring-offset-2'
                      : `bg-white lg:bg-transparent text-slate-600 hover:bg-slate-100 hover:text-br-blue border border-slate-200 lg:border-0`
                  }`}
                >
                  <span className={`${activeTab === tab.id ? 'text-br-yellow' : 'text-slate-400'}`}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </motion.button>
              ))}
            </nav>

            {/* Summary Card */}
            <div className="mt-8 bg-white rounded-2xl p-6 shadow-md border border-slate-200 hidden lg:block relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-br-green/10 to-br-yellow/10 rounded-bl-full -z-10 transition-transform group-hover:scale-110"></div>
              <h3 className="text-sm font-bold text-br-blue uppercase tracking-wider mb-5 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-br-green" />
                Resumo Mensal
              </h3>
              <div className="space-y-5">
                <div>
                  <p className="text-sm text-slate-500 font-medium mb-1">Consumo Total</p>
                  <p className="text-2xl font-black text-slate-800">{totalConsumption.toFixed(0)} <span className="text-base font-semibold text-slate-500">kWh</span></p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-500 font-medium mb-1">Valor Estimado</p>
                  <p className="text-3xl font-black text-br-green drop-shadow-sm">{formatCurrency(bill.total)}</p>
                </div>
                <div className="pt-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${TARIFF_FLAGS[billConfig.flag]?.bg || 'bg-slate-100'} ${TARIFF_FLAGS[billConfig.flag]?.color || 'text-slate-600'} border-current/20 shadow-sm`}>
                    {TARIFF_FLAGS[billConfig.flag]?.label || 'Bandeira Desconhecida'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Estimate CTA */}
            <div className="mt-4 hidden lg:block">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab('rapido')}
                aria-label="Acessar Estimativa Rápida"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-br-green to-[#008A34] hover:from-[#008A34] hover:to-br-green text-white px-5 py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg border border-[#007A2E]"
              >
                <TrendingDown className="w-5 h-5 text-br-yellow" />
                Estimativa Rápida
              </motion.button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 min-h-[600px] overflow-hidden relative">
              {/* Subtle top accent line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-br-green via-br-yellow to-br-blue"></div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
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

      <footer className="max-w-7xl mx-auto px-4 pt-12 pb-8 text-center text-sm font-medium text-slate-500">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-6">
          <button 
            onClick={() => setActiveTab('privacidade')}
            className="text-br-blue hover:text-br-green transition-colors font-semibold"
          >
            Política de Privacidade
          </button>
          <button 
            onClick={() => setActiveTab('licenca')}
            className="text-br-blue hover:text-br-green transition-colors font-semibold"
          >
            Termos de Uso (EULA)
          </button>
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
           <span className="w-1.5 h-1.5 rounded-full bg-br-green"></span>
           <span className="w-1.5 h-1.5 rounded-full bg-br-yellow"></span>
           <span className="w-1.5 h-1.5 rounded-full bg-br-blue"></span>
        </div>
        <div className="tracking-wide">
          <span className="opacity-70">Desenvolvido por</span> <a href="https://github.com/Rahonne08" target="_blank" rel="noopener noreferrer" className="text-slate-700 hover:text-br-green font-bold transition-colors">Pablo Rahonne</a> <span className="opacity-70">&bull; Equatorial Energia</span>
        </div>
      </footer>
    </div>
  );
}
