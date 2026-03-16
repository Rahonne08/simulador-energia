/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Calculator, PieChart, Lightbulb, Zap, Settings, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Appliance, BillConfig, TariffFlag } from './types';
import { COMMON_APPLIANCES, TARIFF_FLAGS } from './constants';
import { calculateTotalConsumption, calculateBill, formatCurrency } from './utils';
import ApplianceList from './components/ApplianceList';
import BillEstimate from './components/BillEstimate';
import ConsumptionChart from './components/ConsumptionChart';
import SavingsTips from './components/SavingsTips';
import QuickEstimate from './components/QuickEstimate';

type Tab = 'simulador' | 'conta' | 'grafico' | 'dicas' | 'rapido';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('simulador');
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [billConfig, setBillConfig] = useState<BillConfig>({
    tariff: 0.84318,
    flag: 'verde',
    isLowIncome: false,
    connectionType: 'monofasico',
  });

  const totalConsumption = calculateTotalConsumption(appliances);
  const bill = calculateBill(totalConsumption, billConfig);

  const tabs = [
    { id: 'simulador', label: 'Aparelhos', icon: <Calculator className="w-5 h-5" /> },
    { id: 'conta', label: 'Estimativa', icon: <Zap className="w-5 h-5" /> },
    { id: 'grafico', label: 'Gráfico', icon: <PieChart className="w-5 h-5" /> },
    { id: 'dicas', label: 'Dicas', icon: <Lightbulb className="w-5 h-5" /> },
    { id: 'rapido', label: 'Estimativa Rápida', icon: <TrendingDown className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-indigo-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300" />
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight">EcoPower</h1>
            </div>
            <div className="lg:hidden flex items-center gap-2 bg-indigo-700 px-3 py-1.5 rounded-full">
              <span className="text-xs font-bold">{formatCurrency(bill.total)}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <nav 
              className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar sticky top-[72px] lg:top-auto bg-slate-50 lg:bg-transparent z-40"
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
                  className={`flex items-center gap-2 sm:gap-3 px-4 py-2.5 sm:py-3 rounded-xl transition-colors whitespace-nowrap text-sm sm:text-base ${
                    activeTab === tab.id
                      ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-200'
                      : 'bg-white lg:bg-transparent text-slate-600 hover:bg-slate-100 border border-slate-200 lg:border-0'
                  }`}
                >
                  <span className={activeTab === tab.id ? 'text-white' : 'text-indigo-600'}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </motion.button>
              ))}
            </nav>

            {/* Summary Card */}
            <div className="mt-8 bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hidden lg:block">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Resumo Mensal</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Consumo Total</p>
                  <p className="text-2xl font-bold text-slate-800">{totalConsumption.toFixed(0)} <span className="text-base font-normal text-slate-500">kWh</span></p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Valor Estimado</p>
                  <p className="text-2xl font-bold text-emerald-600">{formatCurrency(bill.total)}</p>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TARIFF_FLAGS[billConfig.flag]?.bg || 'bg-slate-100'} ${TARIFF_FLAGS[billConfig.flag]?.color || 'text-slate-600'}`}>
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
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl font-medium transition-colors shadow-sm"
              >
                <TrendingDown className="w-5 h-5" />
                Estimativa Rápida
              </motion.button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[500px] overflow-hidden">
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
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-8 text-center text-sm font-medium text-slate-500 uppercase tracking-wider">
        Desenvolvido por Pablo Rahonne
      </footer>
    </div>
  );
}
