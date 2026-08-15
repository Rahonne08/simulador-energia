import React, { useState } from 'react';
import { Plus, Trash2, Zap, Scale, X, CheckCircle2, TrendingUp, Info, Cpu, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Appliance } from '../types';
import { COMMON_APPLIANCES } from '../constants';
import { calculateConsumption } from '../utils';

interface Props {
  appliances: Appliance[];
  setAppliances: React.Dispatch<React.SetStateAction<Appliance[]>>;
}

export default function ApplianceList({ appliances, setAppliances }: Props) {
  const [newAppliance, setNewAppliance] = useState<Partial<Appliance>>({
    name: '',
    quantity: 1,
    power: 0,
    hoursPerDay: 0,
    daysPerMonth: 30,
  });

  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [compareApp1, setCompareApp1] = useState<string>(COMMON_APPLIANCES[0].name);
  const [compareApp2, setCompareApp2] = useState<string>(COMMON_APPLIANCES[1].name);

  const totalConsumption = appliances.reduce((acc, app) => acc + calculateConsumption(app), 0);

  const handleAdd = () => {
    if (!newAppliance.name || !newAppliance.power || !newAppliance.hoursPerDay) return;
    
    const quantity = Number(newAppliance.quantity) || 1;
    const power = Number(newAppliance.power);
    const hoursPerDay = Number(newAppliance.hoursPerDay);
    const daysPerMonth = Number(newAppliance.daysPerMonth) || 30;

    if (quantity <= 0 || power <= 0 || hoursPerDay <= 0 || daysPerMonth <= 0) {
      alert("Por favor, insira valores positivos maiores que zero para quantidade, potência, horas por dia e dias por mês.");
      return;
    }
    
    setAppliances([
      ...appliances,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: newAppliance.name,
        quantity,
        power,
        hoursPerDay,
        daysPerMonth,
      }
    ]);
    
    setNewAppliance({ name: '', quantity: 1, power: 0, hoursPerDay: 0, daysPerMonth: 30 });
  };

  const handleRemove = (id: string) => {
    setAppliances(appliances.filter(app => app.id !== id));
  };

  const handleAddCommon = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = COMMON_APPLIANCES.find(app => app.name === e.target.value);
    if (selected) {
      setNewAppliance({ ...selected });
    }
  };

  return (
    <div className="p-6 sm:p-8 text-slate-100">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-950/60 rounded-xl border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              Inventário de Carga
            </h2>
            <p className="text-xs font-mono text-slate-400">Mapeamento de dispositivos conectados</p>
          </div>
          <span className="ml-2 font-mono text-xs font-bold bg-cyan-500/10 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/30 shadow-inner">
            {appliances.length} {appliances.length === 1 ? 'dispositivo' : 'dispositivos'}
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          {appliances.length > 0 && (
            <button
              onClick={() => setIsClearModalOpen(true)}
              className="flex items-center gap-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Limpar Lista
            </button>
          )}
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-all shadow-md"
          >
            <Scale className="w-3.5 h-3.5 text-cyan-400" />
            Comparador
          </button>
        </div>
      </div>

      {/* Futuristic Add Form */}
      <div className="bg-[#0b111e]/90 p-6 rounded-2xl border border-cyan-500/20 mb-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Novo Registro de Equipamento
          </h3>
          <span className="text-[10px] font-mono text-slate-500 uppercase">Input Terminal</span>
        </div>
        
        <div className="mb-5">
          <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Modelos Pré-Calibrados</label>
          <select 
            className="w-full rounded-xl border-slate-800 bg-[#070b13] text-slate-200 border p-3 text-sm focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-all cursor-pointer font-sans"
            onChange={handleAddCommon}
            defaultValue=""
          >
            <option value="" disabled className="text-slate-500">Selecione um aparelho para carregar as especificações padrão...</option>
            {COMMON_APPLIANCES.map(app => (
              <option key={app.name} value={app.name} className="bg-slate-900 text-slate-200">{app.name} ({app.power}W)</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="sm:col-span-2 md:col-span-1">
            <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Identificação</label>
            <input 
              type="text" 
              value={newAppliance.name}
              onChange={e => setNewAppliance({...newAppliance, name: e.target.value})}
              className="w-full rounded-xl border-slate-800 bg-[#070b13] text-slate-100 border p-2.5 text-sm focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none placeholder:text-slate-600 font-sans"
              placeholder="Ex: Ar Condicionado"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Quantidade</label>
            <input 
              type="number" 
              min="1"
              value={newAppliance.quantity || ''}
              onChange={e => setNewAppliance({...newAppliance, quantity: Number(e.target.value)})}
              className="w-full rounded-xl border-slate-800 bg-[#070b13] text-slate-100 border p-2.5 text-sm focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none placeholder:text-slate-600 font-mono"
              placeholder="1"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Potência (W)</label>
            <input 
              type="number" 
              min="0"
              value={newAppliance.power || ''}
              onChange={e => setNewAppliance({...newAppliance, power: Number(e.target.value)})}
              className="w-full rounded-xl border-slate-800 bg-[#070b13] text-slate-100 border p-2.5 text-sm focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none placeholder:text-slate-600 font-mono"
              placeholder="Ex: 1200"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Horas / Dia</label>
            <input 
              type="number" 
              min="0"
              max="24"
              value={newAppliance.hoursPerDay || ''}
              onChange={e => setNewAppliance({...newAppliance, hoursPerDay: Number(e.target.value)})}
              className="w-full rounded-xl border-slate-800 bg-[#070b13] text-slate-100 border p-2.5 text-sm focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none placeholder:text-slate-600 font-mono"
              placeholder="Ex: 8"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 uppercase">Dias / Mês</label>
            <input 
              type="number" 
              min="0"
              max="31"
              value={newAppliance.daysPerMonth || ''}
              onChange={e => setNewAppliance({...newAppliance, daysPerMonth: Number(e.target.value)})}
              className="w-full rounded-xl border-slate-800 bg-[#070b13] text-slate-100 border p-2.5 text-sm focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none placeholder:text-slate-600 font-mono"
              placeholder="Ex: 30"
            />
          </div>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          disabled={!newAppliance.name || !newAppliance.power || !newAppliance.hoursPerDay}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.25)] text-sm uppercase tracking-wider"
        >
          <Plus className="w-4 h-4" />
          Registrar Aparelho
        </motion.button>
      </div>

      {/* Appliance List - Desktop Cyber Table / Mobile Tech Cards */}
      <div className="mt-6">
        {/* Desktop Table Header - Hidden on Mobile */}
        <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-800 bg-[#0b111e]/60">
          <table className="w-full text-left border-collapse font-sans">
            <thead>
              <tr className="border-b border-slate-800 text-xs font-mono text-cyan-400 bg-slate-900/80 uppercase">
                <th className="py-4 px-4 font-bold">Dispositivo</th>
                <th className="py-4 px-3 font-bold">Qtd</th>
                <th className="py-4 px-3 font-bold">Potência</th>
                <th className="py-4 px-3 font-bold">Ciclo de Uso</th>
                <th className="py-4 px-3 font-bold">Consumo Dia</th>
                <th className="py-4 px-3 font-bold">Consumo Mês</th>
                <th className="py-4 px-3 font-bold">Consumo Ano</th>
                <th className="py-4 px-4 font-bold text-right">Comando</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <AnimatePresence mode="popLayout">
                {appliances.length === 0 ? (
                  <motion.tr
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={8} className="py-12 text-center text-slate-500 font-mono text-sm">
                      NENHUM DISPOSITIVO REGISTRADO NO SISTEMA.
                    </td>
                  </motion.tr>
                ) : (
                  appliances.map(app => {
                    const monthlyConsumption = calculateConsumption(app);
                    const dailyConsumption = (app.power * app.hoursPerDay * app.quantity) / 1000;
                    const annualConsumption = monthlyConsumption * 12;
                    const percent = totalConsumption > 0 ? (monthlyConsumption / totalConsumption) * 100 : 0;
                    
                    return (
                      <motion.tr 
                        key={app.id} 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-slate-800/40 transition-colors group"
                      >
                        <td className="py-4 px-4 font-bold text-white">
                          <div className="flex items-center gap-2">
                            <span>{app.name}</span>
                            <div className="relative group/tooltip">
                              <Info className="w-3.5 h-3.5 text-slate-500 group-hover/tooltip:text-cyan-400 cursor-help transition-colors" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/tooltip:block z-50 w-52 p-3 bg-slate-900 text-slate-200 text-xs rounded-xl shadow-2xl pointer-events-none ring-1 ring-cyan-500/40 border border-slate-800">
                                <div className="space-y-1.5 font-mono">
                                  <p className="font-bold border-b border-slate-800 pb-1 mb-1 text-cyan-400 uppercase tracking-wider text-[10px]">Impacto no Grid</p>
                                  <div className="flex justify-between text-[11px]">
                                    <span className="text-slate-400">Diário:</span>
                                    <span className="font-bold text-white">{dailyConsumption.toFixed(2)} kWh</span>
                                  </div>
                                  <div className="flex justify-between text-[11px]">
                                    <span className="text-slate-400">Mensal:</span>
                                    <span className="font-bold text-white">{monthlyConsumption.toFixed(1)} kWh</span>
                                  </div>
                                  <div className="flex justify-between text-[11px]">
                                    <span className="text-slate-400">Anual:</span>
                                    <span className="font-bold text-white">{annualConsumption.toFixed(1)} kWh</span>
                                  </div>
                                  <div className="flex justify-between pt-1 border-t border-slate-800 text-[11px]">
                                    <span className="text-slate-400">Impacto Relativo:</span>
                                    <span className="font-bold text-cyan-400">{percent.toFixed(1)}%</span>
                                  </div>
                                </div>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-3 font-mono text-slate-300">{app.quantity}x</td>
                        <td className="py-4 px-3 font-mono text-slate-300">{app.power} W</td>
                        <td className="py-4 px-3 font-mono text-slate-400 text-xs">{app.hoursPerDay}h/d &bull; {app.daysPerMonth}d</td>
                        <td className="py-4 px-3 font-mono text-slate-300">
                          {dailyConsumption.toFixed(2)} kWh
                        </td>
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-1.5 text-cyan-400 font-mono font-bold">
                            <Zap className="w-3.5 h-3.5 text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]" />
                            {monthlyConsumption.toFixed(1)} kWh
                          </div>
                        </td>
                        <td className="py-4 px-3 font-mono text-slate-400 text-xs">
                          {annualConsumption.toFixed(0)} kWh
                        </td>
                        <td className="py-4 px-4 text-right">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRemove(app.id)}
                            className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/50 rounded-lg transition-all"
                            title="Remover"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile Tech Cards - Hidden on Desktop */}
        <div className="md:hidden space-y-4">
          <AnimatePresence mode="popLayout">
            {appliances.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-10 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800 font-mono text-sm"
              >
                NENHUM DISPOSITIVO REGISTRADO.
              </motion.div>
            ) : (
              appliances.map(app => {
                const monthlyConsumption = calculateConsumption(app);
                const dailyConsumption = (app.power * app.hoursPerDay * app.quantity) / 1000;
                const annualConsumption = monthlyConsumption * 12;
                const percent = totalConsumption > 0 ? (monthlyConsumption / totalConsumption) * 100 : 0;
                
                return (
                  <motion.div 
                    key={app.id} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="bg-[#0b111e] p-5 rounded-2xl border border-slate-800 relative shadow-lg overflow-hidden"
                  >
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemove(app.id)}
                      className="absolute top-4 right-4 p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                    
                    <div className="flex items-center gap-2 mb-4 pr-10">
                      <h4 className="font-bold text-white text-base">{app.name}</h4>
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                        {percent.toFixed(1)}%
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                        <p className="text-slate-500 uppercase text-[10px] mb-0.5">Potência</p>
                        <p className="text-slate-200 font-bold">{app.quantity}x &bull; {app.power}W</p>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                        <p className="text-slate-500 uppercase text-[10px] mb-0.5">Ciclo Uso</p>
                        <p className="text-slate-200 font-bold">{app.hoursPerDay}h/d &bull; {app.daysPerMonth}d</p>
                      </div>
                      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                        <p className="text-slate-500 uppercase text-[10px] mb-0.5">Consumo Diário</p>
                        <p className="text-slate-200 font-bold">{dailyConsumption.toFixed(2)} kWh</p>
                      </div>
                      <div className="bg-cyan-950/40 p-2.5 rounded-xl border border-cyan-500/30">
                        <p className="text-cyan-400 uppercase text-[10px] font-bold mb-0.5">Consumo Mensal</p>
                        <p className="text-cyan-300 font-black text-sm flex items-center gap-1">
                          <Zap className="w-3.5 h-3.5 text-cyan-400" />
                          {monthlyConsumption.toFixed(1)} kWh
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Compare Modal */}
      <AnimatePresence>
        {isCompareModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b111e] rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-cyan-500/30"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Scale className="w-5 h-5 text-cyan-400" />
                  Comparador de Carga & Eficiência
                </h3>
                <button 
                  onClick={() => setIsCompareModalOpen(false)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                <p className="text-sm text-slate-400 mb-6">
                  Selecione dois dispositivos para simular e confrontar o impacto de consumo mensal no grid.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div>
                    <label className="block text-xs font-mono text-cyan-400 mb-2 uppercase">Dispositivo Alpha</label>
                    <select 
                      value={compareApp1}
                      onChange={(e) => setCompareApp1(e.target.value)}
                      className="w-full rounded-xl border-slate-800 border p-3 text-sm focus:ring-2 focus:ring-cyan-400 outline-none bg-slate-900 text-white"
                    >
                      {COMMON_APPLIANCES.map(app => (
                        <option key={`a1-${app.name}`} value={app.name}>{app.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-indigo-400 mb-2 uppercase">Dispositivo Beta</label>
                    <select 
                      value={compareApp2}
                      onChange={(e) => setCompareApp2(e.target.value)}
                      className="w-full rounded-xl border-slate-800 border p-3 text-sm focus:ring-2 focus:ring-indigo-400 outline-none bg-slate-900 text-white"
                    >
                      {COMMON_APPLIANCES.map(app => (
                        <option key={`a2-${app.name}`} value={app.name}>{app.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {(() => {
                  const app1 = COMMON_APPLIANCES.find(a => a.name === compareApp1) || COMMON_APPLIANCES[0];
                  const app2 = COMMON_APPLIANCES.find(a => a.name === compareApp2) || COMMON_APPLIANCES[1];
                  
                  const cons1 = (app1.power * app1.hoursPerDay * app1.daysPerMonth) / 1000;
                  const cons2 = (app2.power * app2.hoursPerDay * app2.daysPerMonth) / 1000;
                  
                  const maxCons = Math.max(cons1, cons2) || 1;
                  const pct1 = (cons1 / maxCons) * 100;
                  const pct2 = (cons2 / maxCons) * 100;

                  const diff = Math.abs(cons1 - cons2);
                  const moreApp = cons1 > cons2 ? app1.name : app2.name;
                  const lessApp = cons1 > cons2 ? app2.name : app1.name;
                  const timesMore = cons1 > cons2 ? (cons1 / (cons2 || 1)) : (cons2 / (cons1 || 1));

                  const isApp1Efficient = cons1 < cons2;
                  const isApp2Efficient = cons2 < cons1;
                  const isEqual = cons1 === cons2;

                  return (
                    <div className="space-y-4">
                      {/* Bar 1 */}
                      <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-white">{app1.name}</span>
                              {isApp1Efficient && <span className="flex items-center gap-1 text-[10px] uppercase font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30"><CheckCircle2 className="w-3 h-3" /> Mais Econômico</span>}
                              {!isApp1Efficient && !isEqual && <span className="flex items-center gap-1 text-[10px] uppercase font-mono font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30"><TrendingUp className="w-3 h-3" /> Maior Carga</span>}
                            </div>
                            <p className="text-xs text-slate-400 font-mono">
                              {app1.power}W &bull; {app1.hoursPerDay}h/dia &bull; {app1.daysPerMonth} dias/mês
                            </p>
                          </div>
                          <div className="text-right font-mono">
                            <span className="font-black text-xl text-cyan-400">{cons1.toFixed(1)}</span>
                            <span className="text-xs block text-slate-400">kWh/mês</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                          <div 
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${pct1}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Bar 2 */}
                      <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/80">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-white">{app2.name}</span>
                              {isApp2Efficient && <span className="flex items-center gap-1 text-[10px] uppercase font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30"><CheckCircle2 className="w-3 h-3" /> Mais Econômico</span>}
                              {!isApp2Efficient && !isEqual && <span className="flex items-center gap-1 text-[10px] uppercase font-mono font-bold text-rose-400 bg-rose-950/60 px-2 py-0.5 rounded border border-rose-500/30"><TrendingUp className="w-3 h-3" /> Maior Carga</span>}
                            </div>
                            <p className="text-xs text-slate-400 font-mono">
                              {app2.power}W &bull; {app2.hoursPerDay}h/dia &bull; {app2.daysPerMonth} dias/mês
                            </p>
                          </div>
                          <div className="text-right font-mono">
                            <span className="font-black text-xl text-indigo-400">{cons2.toFixed(1)}</span>
                            <span className="text-xs block text-slate-400">kWh/mês</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800">
                          <div 
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${pct2}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-start gap-3">
                        <Info className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                        <div className="text-sm text-slate-300 leading-relaxed">
                          {isEqual ? (
                            <p>Ambos os dispositivos possuem consumo idêntico de <strong className="text-white">{cons1.toFixed(1)} kWh</strong> mensais.</p>
                          ) : (
                            <p>
                              O dispositivo <strong className="text-white">{moreApp}</strong> demanda <strong className="text-rose-400">{timesMore.toFixed(1)}x mais</strong> energia que <strong className="text-white">{lessApp}</strong>, representando um delta de <strong className="text-cyan-400">{diff.toFixed(1)} kWh</strong> por ciclo mensal.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              
              <div className="p-5 border-t border-slate-800 bg-[#070b13] flex justify-end">
                <button
                  onClick={() => setIsCompareModalOpen(false)}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clear All Modal */}
      <AnimatePresence>
        {isClearModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b111e] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col border border-rose-800/40"
            >
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-rose-400" />
                  Redefinir Inventário?
                </h3>
                <p className="text-slate-400 text-sm">Tem certeza que deseja expurgar todos os aparelhos da lista? Esta operação é irreversível.</p>
              </div>
              <div className="p-4 border-t border-slate-800 bg-[#070b13] flex justify-end gap-3">
                <button
                  onClick={() => setIsClearModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-mono uppercase tracking-wider hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    setAppliances([]);
                    setIsClearModalOpen(false);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-mono uppercase tracking-wider font-bold transition-colors shadow-lg shadow-rose-950/50"
                >
                  Confirmar Limpeza
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

