import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Appliance } from '../types';
import { calculateConsumption } from '../utils';
import { X, Info, PieChart as PieChartIcon, BarChart3, LineChart as LineChartIcon, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  appliances: Appliance[];
  totalConsumption: number;
}

const CYBER_COLORS = [
  '#06b6d4', // cyan-500
  '#6366f1', // indigo-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ec4899', // pink-500
  '#3b82f6', // blue-500
  '#8b5cf6', // purple-500
  '#14b8a6', // teal-500
];

export default function ConsumptionChart({ appliances, totalConsumption }: Props) {
  const [selectedApplianceName, setSelectedApplianceName] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'line'>('pie');

  const data = useMemo(() => {
    return appliances
      .map(app => ({
        name: app.name,
        value: calculateConsumption(app),
      }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [appliances]);

  const topAppliance = data[0];

  if (data.length === 0) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full min-h-[400px] text-slate-500 font-mono text-sm">
        <PieChartIcon className="w-16 h-16 mb-4 text-slate-700 animate-pulse" />
        <p>NENHUM DADO DE CONSUMO DISPONÍVEL. ADICIONE DISPOSITIVOS.</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percent = ((data.value / totalConsumption) * 100).toFixed(1);
      return (
        <div className="bg-[#0b111e]/95 backdrop-blur-md p-4 border border-cyan-500/40 shadow-2xl rounded-2xl min-w-[200px] font-mono text-slate-200">
          <p className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-1">Dispositivo</p>
          <p className="font-bold text-white text-base mb-3">{data.name}</p>
          <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-800">
            <div>
              <p className="text-[9px] text-slate-400 uppercase font-bold">Consumo</p>
              <p className="text-cyan-300 font-bold text-sm">{data.value.toFixed(1)} <span className="text-[10px] text-slate-400">kWh</span></p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-slate-400 uppercase font-bold">Participação</p>
              <p className="text-emerald-400 font-bold text-sm">{percent}%</p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const handleChartClick = (state: any) => {
    if (state && state.activePayload && state.activePayload.length > 0) {
      setSelectedApplianceName(state.activePayload[0].payload.name);
    }
  };

  return (
    <div className="p-6 sm:p-8 text-slate-100">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-950/60 rounded-xl border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Análise Teórica de Demanda
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-xs font-mono text-slate-400">Distribuição percentual de carga por equipamento</p>
              {selectedApplianceName && (
                <motion.button 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedApplianceName(null)}
                  className="px-2 py-0.5 bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono uppercase tracking-wider rounded-md"
                >
                  Limpar Filtro [x]
                </motion.button>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 self-end lg:self-auto">
          <div className="flex items-center gap-1 bg-[#070b13] p-1.5 rounded-2xl border border-slate-800 shadow-inner">
            <button 
              onClick={() => setChartType('pie')} 
              className={`p-2 rounded-xl transition-all ${chartType === 'pie' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
              title="Gráfico Radial"
            >
              <PieChartIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setChartType('bar')} 
              className={`p-2 rounded-xl transition-all ${chartType === 'bar' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
              title="Gráfico de Barras"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setChartType('line')} 
              className={`p-2 rounded-xl transition-all ${chartType === 'line' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md' : 'text-slate-500 hover:text-slate-300'}`}
              title="Gráfico Temporal"
            >
              <LineChartIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Chart Container */}
        <motion.div 
          layout
          className="flex-1 bg-[#0b111e]/90 rounded-3xl border border-cyan-500/20 shadow-xl p-4 sm:p-8 min-w-0"
        >
          <div className="w-full h-[340px] md:h-[425px] lg:h-[465px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'pie' ? (
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={window.innerWidth < 768 ? 65 : 97}
                    outerRadius={window.innerWidth < 768 ? 89 : 154}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="#0b111e"
                    strokeWidth={2}
                    animationBegin={0}
                    animationDuration={1200}
                  >
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CYBER_COLORS[index % CYBER_COLORS.length]} 
                        onClick={() => setSelectedApplianceName(entry.name)}
                        className="cursor-pointer transition-all duration-300 outline-none hover:opacity-80"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    iconType="circle"
                    wrapperStyle={{ 
                      paddingTop: '30px', 
                      fontSize: '11px',
                      fontFamily: 'monospace',
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }} 
                  />
                  {/* Center Label */}
                  <text x="50%" y="44%" textAnchor="middle" dominantBaseline="middle">
                    <tspan x="50%" dy="-1.5em" fontSize={10} fontFamily="monospace" fontWeight="bold" fill="#64748b" style={{ textTransform: 'uppercase' }}>
                      {selectedApplianceName ? 'Filtrado' : 'Total Carga'}
                    </tspan>
                    <tspan x="50%" dy="1.5em" fontSize={window.innerWidth < 768 ? 24 : 32} fontFamily="monospace" fontWeight="900" fill="#f8fafc">
                      {(selectedApplianceName 
                        ? (data.find(d => d.name === selectedApplianceName)?.value || 0) 
                        : totalConsumption
                      ).toFixed(0)}
                    </tspan>
                    <tspan x="50%" dy="1.5em" fontSize={11} fontFamily="monospace" fontWeight="bold" fill="#06b6d4">
                      kWh / MÊS
                    </tspan>
                  </text>
                </PieChart>
              ) : chartType === 'bar' ? (
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 100 }} onClick={handleChartClick}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100} 
                    tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'monospace' }} 
                    axisLine={{ stroke: '#1e293b' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'monospace' }} 
                    axisLine={{ stroke: '#1e293b' }}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#0f172a', radius: 8 }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]} animationDuration={1200}>
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? '#06b6d4' : CYBER_COLORS[index % CYBER_COLORS.length]} 
                        className="cursor-pointer hover:opacity-80 transition-all outline-none"
                      />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 100 }} onClick={handleChartClick}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100} 
                    tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'monospace' }} 
                    axisLine={{ stroke: '#1e293b' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 11, fill: '#64748b', fontFamily: 'monospace' }} 
                    axisLine={{ stroke: '#1e293b' }}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#06b6d4" 
                    strokeWidth={3} 
                    dot={{ r: 5, fill: '#06b6d4', strokeWidth: 2, stroke: '#070b13' }} 
                    activeDot={{ r: 8, fill: '#38bdf8', stroke: '#070b13', strokeWidth: 2 }} 
                    animationDuration={1200}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Sidebar / Cyber Insights */}
        <div className="lg:w-[380px] flex flex-col gap-6 shrink-0">
          {/* Top Consumer Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#0c2a4a] to-[#071322] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden border border-cyan-500/40"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap className="w-24 h-24 text-cyan-400" />
            </div>
            <p className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Ponto Crítico de Demanda
            </p>
            <h3 className="text-xl font-bold mb-4 truncate pr-10 text-white">{topAppliance.name}</h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-black font-mono text-cyan-300 drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                  {((topAppliance.value / totalConsumption) * 100).toFixed(1)}%
                </p>
                <p className="text-xs font-mono text-slate-400">da carga mensal total</p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedApplianceName(topAppliance.name)}
                className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-mono font-bold rounded-xl shadow-lg transition-colors uppercase tracking-wider"
              >
                Detalhes
              </motion.button>
            </div>
          </motion.div>

          <div className="bg-[#0b111e]/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
              <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Ranking de Consumo</h3>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">TOP 6</span>
            </div>
            
            <div className="space-y-2.5">
              {data.slice(0, 6).map((item, index) => {
                const percent = ((item.value / totalConsumption) * 100).toFixed(1);
                const isSelected = selectedApplianceName === item.name;
                return (
                  <motion.button 
                    key={index} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedApplianceName(isSelected ? null : item.name)}
                    className={`flex items-center justify-between w-full p-3.5 rounded-2xl border transition-all text-left group font-mono ${
                      isSelected 
                        ? 'bg-cyan-950/60 border-cyan-500/60 text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]' 
                        : 'bg-[#070b13] border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div 
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                          isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-500 border border-slate-800'
                        }`}
                      >
                        0{index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className={`text-xs font-bold block truncate ${isSelected ? 'text-cyan-300' : 'text-white'}`} title={item.name}>
                          {item.name}
                        </span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CYBER_COLORS[index % CYBER_COLORS.length] }} />
                          <span className="text-[10px] text-slate-400">
                            {item.value.toFixed(1)} kWh
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <span className={`text-sm font-bold block ${isSelected ? 'text-cyan-400' : 'text-slate-300'}`}>{percent}%</span>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Appliance Details Modal */}
      <AnimatePresence>
        {selectedApplianceName && (() => {
          const selectedAppliance = appliances.find(app => app.name === selectedApplianceName);
          if (!selectedAppliance) return null;

          const consumption = calculateConsumption(selectedAppliance);
          const percent = ((consumption / totalConsumption) * 100).toFixed(1);
          const dailyConsumption = (selectedAppliance.power * selectedAppliance.hoursPerDay * selectedAppliance.quantity) / 1000;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedApplianceName(null)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
              />
              
              <motion.div 
                key={selectedApplianceName}
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-[#0b111e] rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative z-10 border border-cyan-500/40"
              >
                <div className="bg-gradient-to-r from-cyan-950 to-slate-900 p-6 text-white relative overflow-hidden border-b border-slate-800">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedApplianceName(null)}
                    className="absolute top-6 right-6 p-2.5 bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors z-20 text-slate-300"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">Diagnóstico Individual</span>
                    </div>
                    <h3 className="text-2xl font-black tracking-tight text-white font-sans">
                      {selectedAppliance.name}
                    </h3>
                  </div>
                </div>

                <div className="p-6 font-mono">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                    {[
                      { label: 'Qtd', value: selectedAppliance.quantity, unit: 'x' },
                      { label: 'Potência', value: selectedAppliance.power, unit: 'W' },
                      { label: 'Horas/Dia', value: selectedAppliance.hoursPerDay, unit: 'h' },
                      { label: 'Dias/Mês', value: selectedAppliance.daysPerMonth, unit: 'd' }
                    ].map((stat, i) => (
                      <div key={i} className="bg-[#070b13] p-3 rounded-xl border border-slate-800 text-center">
                        <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">{stat.label}</p>
                        <p className="text-base font-bold text-white leading-none">
                          {stat.value}<span className="text-[10px] text-cyan-400 ml-0.5">{stat.unit}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-cyan-950/30 rounded-2xl border border-cyan-500/30">
                      <div>
                        <p className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider mb-1">Consumo Mensal</p>
                        <p className="text-xl font-black text-cyan-300 leading-none">{consumption.toFixed(1)} <span className="text-xs">kWh</span></p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider mb-1">Impacto no Total</p>
                        <p className="text-2xl font-black text-white leading-none">{percent}%</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="p-3.5 rounded-xl border border-slate-800 bg-[#070b13]">
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Consumo Dia</p>
                        <p className="text-sm font-bold text-slate-200">{dailyConsumption.toFixed(2)} kWh</p>
                      </div>
                      <div className="p-3.5 rounded-xl border border-slate-800 bg-[#070b13]">
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Consumo Ano</p>
                        <p className="text-sm font-bold text-slate-200">{(consumption * 12).toFixed(0)} kWh</p>
                      </div>
                      <div className="p-3.5 rounded-xl border border-slate-800 bg-[#070b13]">
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider mb-1">Custo Estimado</p>
                        <p className="text-sm font-bold text-emerald-400">
                          R$ {(consumption * 0.92).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedApplianceName(null)}
                    className="w-full mt-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono uppercase tracking-wider rounded-xl transition-all"
                  >
                    Fechar Relatório
                  </motion.button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

