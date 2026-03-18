import React, { useState } from 'react';
import { Users, Zap, Wind, Bath, Tv, Monitor, Waves, Minus, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { calculateBill, formatCurrency, formatNumber } from '../utils';

interface CounterProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
}

const Counter = ({ icon, label, value, onChange, min = 0 }: CounterProps) => (
  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600 shrink-0">
        {icon}
      </div>
      <span className="font-medium text-slate-700 text-sm sm:text-base">{label}</span>
    </div>
    <div className="flex items-center gap-3">
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 transition-all shadow-sm"
        aria-label={`Diminuir ${label}`}
      >
        <Minus className="w-4 h-4" />
      </motion.button>
      <span className="w-6 text-center font-bold text-slate-800">{value}</span>
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onChange(value + 1)}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-300 text-slate-600 hover:bg-slate-100 transition-all shadow-sm"
        aria-label={`Aumentar ${label}`}
      >
        <Plus className="w-4 h-4" />
      </motion.button>
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
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800">Estimativa Inteligente</h2>
        <p className="text-sm text-slate-500 mt-1">Cálculo rápido baseado no perfil da residência</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Counter icon={<Users className="w-5 h-5" />} label="Pessoas" value={people} onChange={setPeople} min={1} />
        <Counter icon={<Bath className="w-5 h-5" />} label="Chuveiros Elétricos" value={showers} onChange={setShowers} min={0} />
        <Counter icon={<Wind className="w-5 h-5" />} label="Ar Condicionado" value={acs} onChange={setAcs} min={0} />
        <Counter icon={<Tv className="w-5 h-5" />} label="Televisões" value={tvs} onChange={setTvs} min={0} />
        <Counter icon={<Monitor className="w-5 h-5" />} label="Computadores" value={computers} onChange={setComputers} min={0} />
        <Counter icon={<Waves className="w-5 h-5" />} label="Máquinas de Lavar" value={washingMachines} onChange={setWashingMachines} min={0} />
      </div>

      <div className="bg-indigo-600 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg shadow-indigo-200">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Zap className="w-32 h-32" />
        </div>
        
        <div className="relative z-10">
          <p className="text-indigo-200 text-sm font-medium mb-1">Consumo Estimado</p>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-4xl sm:text-5xl font-bold">{formatNumber(kwh, 0)}</span>
            <span className="text-indigo-200 font-medium">kWh/mês</span>
          </div>

          <div className="pt-6 border-t border-indigo-500/50">
            <p className="text-indigo-200 text-sm font-medium mb-1">Valor Aproximado</p>
            <span className="text-3xl sm:text-4xl font-bold">{formatCurrency(bill.total)}</span>
          </div>
          
          <p className="text-xs text-indigo-300 mt-8 leading-relaxed">
            * Cálculo baseado na tarifa média de R$ 0,84318/kWh. Para um valor exato e detalhado, utilize o Simulador Completo na aba "Aparelhos".
          </p>
        </div>
      </div>
    </div>
  );
};
export default QuickEstimate;
