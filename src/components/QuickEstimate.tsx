import React, { useState } from 'react';
import { Users, Zap, Wind, Bath, Tv, Monitor, Waves, Minus, Plus, Cpu, Activity } from 'lucide-react';
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
  <div className="flex items-center justify-between p-4 bg-[#070b13] rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors">
    <div className="flex items-center gap-3">
      <div className="p-2.5 bg-cyan-950/60 rounded-xl border border-cyan-500/30 text-cyan-400 shrink-0">
        {icon}
      </div>
      <span className="font-mono text-xs sm:text-sm text-slate-200 uppercase font-semibold">{label}</span>
    </div>
    <div className="flex items-center gap-3">
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all font-mono"
        aria-label={`Diminuir ${label}`}
      >
        <Minus className="w-3.5 h-3.5" />
      </motion.button>
      <span className="w-6 text-center font-mono font-bold text-white text-sm">{value}</span>
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-all font-mono"
        aria-label={`Aumentar ${label}`}
      >
        <Plus className="w-3.5 h-3.5" />
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
    <div className="p-6 sm:p-8 text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-950/60 rounded-xl border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Estimativa Heurística Rápida
            </h2>
            <p className="text-xs font-mono text-slate-400">Predição instantânea baseada no perfil habitacional</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3.5 py-1.5 rounded-full border border-cyan-500/30">
          <Activity className="w-3.5 h-3.5" />
          <span>MOTOR DE PREVISÃO</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Counter icon={<Users className="w-4 h-4" />} label="Habitantes" value={people} onChange={setPeople} min={1} />
        <Counter icon={<Bath className="w-4 h-4" />} label="Chuveiros Elétricos" value={showers} onChange={setShowers} min={0} />
        <Counter icon={<Wind className="w-4 h-4" />} label="Ar-Condicionado" value={acs} onChange={setAcs} min={0} />
        <Counter icon={<Tv className="w-4 h-4" />} label="Televisores" value={tvs} onChange={setTvs} min={0} />
        <Counter icon={<Monitor className="w-4 h-4" />} label="Estações PC" value={computers} onChange={setComputers} min={0} />
        <Counter icon={<Waves className="w-4 h-4" />} label="Máquinas de Lavar" value={washingMachines} onChange={setWashingMachines} min={0} />
      </div>

      <div className="bg-gradient-to-b from-[#0e172a] to-[#070b13] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-cyan-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 font-mono">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-1">Consumo Mensal Projetado</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-white">{formatNumber(kwh, 0)}</span>
                <span className="text-cyan-400 font-bold text-sm">kWh / mês</span>
              </div>
            </div>

            <div>
              <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-1">Impacto Financeiro Previsto</p>
              <span className="text-3xl sm:text-4xl font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                {formatCurrency(bill.total)}
              </span>
            </div>
          </div>
          
          <p className="text-[11px] text-slate-500 mt-6 leading-relaxed">
            * Cálculo baseado na tarifa regulada padrão de R$ 0,84318/kWh. Para detalhamento preciso por potência nominal e regime de horas, utilize a aba "Equipamentos".
          </p>
        </div>
      </div>
    </div>
  );
};
export default QuickEstimate;

