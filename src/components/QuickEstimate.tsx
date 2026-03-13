import React, { useState } from 'react';
import { Users, Zap, Wind, Bath, Tv, Monitor, Waves, Minus, Plus } from 'lucide-react';
import { calculateBill, formatCurrency, formatNumber } from '../utils';

interface CounterProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
}

const Counter = ({ icon, label, value, onChange, min = 0 }: CounterProps) => (
  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600">
        {icon}
      </div>
      <span className="font-medium text-slate-700 text-sm">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <button 
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <Minus className="w-3 h-3" />
      </button>
      <span className="w-4 text-center font-medium text-sm">{value}</span>
      <button 
        onClick={() => onChange(value + 1)}
        className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  </div>
);

export const QuickEstimate = () => {
  const [people, setPeople] = useState(2);
  const [showers, setShowers] = useState(0);
  const [acs, setAcs] = useState(0);
  const [tvs, setTvs] = useState(1);
  const [computers, setComputers] = useState(0);
  const [washingMachines, setWashingMachines] = useState(1);

  const calculateQuickBill = () => {
    let kwh = people * 30; // Base 30kWh per person (fridge, lights, small devices)
    kwh += showers * 50;   // ~50kWh per shower
    kwh += acs * 120;      // ~120kWh per AC
    kwh += tvs * 15;       // ~15kWh per TV
    kwh += computers * 20; // ~20kWh per PC
    kwh += washingMachines * 10; // ~10kWh per washing machine

    const bill = calculateBill(kwh, {
      tariff: 0.84318,
      flag: 'verde',
      isLowIncome: false,
      connectionType: 'monofasico'
    });
    
    return { kwh, bill };
  };

  const { kwh, bill } = calculateQuickBill();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-800">Estimativa Inteligente</h2>
        <p className="text-sm text-slate-500 mt-1">Cálculo rápido baseado no perfil da residência</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <Counter icon={<Users className="w-5 h-5" />} label="Pessoas" value={people} onChange={setPeople} min={1} />
          <Counter icon={<Bath className="w-5 h-5" />} label="Chuveiros Elétricos" value={showers} onChange={setShowers} min={0} />
          <Counter icon={<Wind className="w-5 h-5" />} label="Ar Condicionado" value={acs} onChange={setAcs} min={0} />
          <Counter icon={<Tv className="w-5 h-5" />} label="Televisões" value={tvs} onChange={setTvs} min={0} />
          <Counter icon={<Monitor className="w-5 h-5" />} label="Computadores" value={computers} onChange={setComputers} min={0} />
          <Counter icon={<Waves className="w-5 h-5" />} label="Máquinas de Lavar" value={washingMachines} onChange={setWashingMachines} min={0} />
        </div>

        <div className="bg-indigo-600 rounded-xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap className="w-24 h-24" />
          </div>
          
          <div className="relative z-10">
            <p className="text-indigo-200 text-sm font-medium mb-1">Consumo Estimado</p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-bold">{formatNumber(kwh, 0)}</span>
              <span className="text-indigo-200">kWh/mês</span>
            </div>

            <div className="pt-4 border-t border-indigo-500/50">
              <p className="text-indigo-200 text-sm font-medium mb-1">Valor Aproximado</p>
              <span className="text-3xl font-bold">{formatCurrency(bill.total)}</span>
            </div>
            
            <p className="text-xs text-indigo-200 mt-6 opacity-80">
              * Cálculo baseado na tarifa de R$ 0,84318/kWh. Para um valor exato, use o Simulador Completo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default QuickEstimate;
