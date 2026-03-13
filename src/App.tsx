/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Calculator, PieChart, Lightbulb, Zap, Settings, TrendingDown } from 'lucide-react';
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
  const [appliances, setAppliances] = useState<Appliance[]>([
    { id: '1', name: 'Geladeira', power: 150, hoursPerDay: 24, daysPerMonth: 30 },
    { id: '2', name: 'Chuveiro elétrico', power: 5500, hoursPerDay: 0.5, daysPerMonth: 30 },
  ]);
  const [billConfig, setBillConfig] = useState<BillConfig>({
    tariff: 0.89,
    flag: 'verde',
  });

  const totalConsumption = calculateTotalConsumption(appliances);
  const bill = calculateBill(totalConsumption, billConfig);

  const tabs = [
    { id: 'simulador', label: 'Aparelhos', icon: <Calculator className="w-5 h-5" /> },
    { id: 'conta', label: 'Estimativa', icon: <Zap className="w-5 h-5" /> },
    { id: 'grafico', label: 'Gráfico', icon: <PieChart className="w-5 h-5" /> },
    { id: 'dicas', label: 'Dicas', icon: <Lightbulb className="w-5 h-5" /> },
    { id: 'rapido', label: 'Extra Rápido', icon: <TrendingDown className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-indigo-600 text-white shadow-md">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-yellow-300" />
            <h1 className="text-2xl font-bold tracking-tight">Simulador de Conta de Energia</h1>
          </div>
          <p className="text-indigo-100 mt-1">Estime seu consumo e descubra como economizar</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <nav className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 hide-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as Tab)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
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
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TARIFF_FLAGS[billConfig.flag].bg} ${TARIFF_FLAGS[billConfig.flag].color}`}>
                    {TARIFF_FLAGS[billConfig.flag].label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[500px]">
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
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
