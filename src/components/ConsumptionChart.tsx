import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Appliance } from '../types';
import { calculateConsumption } from '../utils';
import { X, Info, PieChart as PieChartIcon, BarChart3, LineChart as LineChartIcon, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  appliances: Appliance[];
  totalConsumption: number;
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

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
      <div className="p-6 flex flex-col items-center justify-center h-full min-h-[400px] text-slate-500">
        <PieChartIcon className="w-16 h-16 mb-4 text-slate-300" />
        <p>Adicione aparelhos para ver o gráfico de consumo.</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percent = ((data.value / totalConsumption) * 100).toFixed(1);
      return (
        <div className="bg-white/95 backdrop-blur-sm p-4 border border-slate-200 shadow-2xl rounded-2xl min-w-[180px]">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Aparelho</p>
          <p className="font-bold text-slate-900 text-lg mb-2">{data.name}</p>
          <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Consumo</p>
              <p className="text-indigo-600 font-black">{data.value.toFixed(1)} <span className="text-xs font-normal">kWh</span></p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Impacto</p>
              <p className="text-emerald-600 font-black">{percent}%</p>
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
    <div className="p-4 sm:p-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Análise de Consumo</h2>
            <div className="flex items-center gap-2">
              <p className="text-sm text-slate-500">Distribuição detalhada por aparelho</p>
              {selectedApplianceName && (
                <motion.button 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedApplianceName(null)}
                  className="px-2 py-0.5 bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase tracking-wider rounded-md hover:bg-indigo-200 transition-colors"
                >
                  Limpar Filtro
                </motion.button>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 self-end lg:self-auto">
          <div className="hidden xl:flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
            <Info className="w-4 h-4 text-indigo-500" />
            <span>INTERAÇÃO ATIVA</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
            <button 
              onClick={() => setChartType('pie')} 
              className={`p-2 rounded-xl transition-all ${chartType === 'pie' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              title="Gráfico de Pizza"
            >
              <PieChartIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setChartType('bar')} 
              className={`p-2 rounded-xl transition-all ${chartType === 'bar' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              title="Gráfico de Barras"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setChartType('line')} 
              className={`p-2 rounded-xl transition-all ${chartType === 'line' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
              title="Gráfico de Linha"
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
          className="flex-1 bg-white rounded-3xl border border-slate-100 shadow-sm p-4 sm:p-8 min-w-0"
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
                    stroke="none"
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        onClick={() => setSelectedApplianceName(entry.name)}
                        className={`cursor-pointer transition-all duration-300 outline-none ${
                          index === 0 ? 'filter drop-shadow-xl' : ''
                        }`}
                        style={{
                          transform: index === 0 ? 'scale(1.02)' : 'scale(1)',
                          transformOrigin: 'center'
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    verticalAlign="bottom" 
                    iconType="circle"
                    wrapperStyle={{ 
                      paddingTop: '40px', 
                      fontSize: '11px',
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }} 
                  />
                  {/* Center Label */}
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
                    <tspan x="50%" dy="-1.4em" fontSize={10} fontWeight="bold" fill="#94a3b8" textTransform="uppercase">
                      {selectedApplianceName ? 'Consumo' : 'Total'}
                    </tspan>
                    <tspan x="50%" dy="1.4em" fontSize={window.innerWidth < 768 ? 22 : 28} fontWeight="900" fill="#1e293b">
                      {(selectedApplianceName 
                        ? (data.find(d => d.name === selectedApplianceName)?.value || 0) 
                        : totalConsumption
                      ).toFixed(0)}
                    </tspan>
                    <tspan x="50%" dy="1.6em" fontSize={12} fontWeight="bold" fill="#64748b">
                      kWh/mês
                    </tspan>
                  </text>
                </PieChart>
              ) : chartType === 'bar' ? (
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 100 }} onClick={handleChartClick}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100} 
                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', radius: 12 }} />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]} animationDuration={1500}>
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? '#4f46e5' : COLORS[index % COLORS.length]} 
                        fillOpacity={index === 0 ? 1 : 0.8}
                        className="cursor-pointer hover:fill-opacity-100 transition-all outline-none"
                      />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 100 }} onClick={handleChartClick}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={100} 
                    tick={{ fontSize: 11, fill: '#94a3b8', fontWeight: 600 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#4f46e5" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#4f46e5', strokeWidth: 3, stroke: '#fff' }} 
                    activeDot={{ r: 10, fill: '#4f46e5', stroke: '#fff', strokeWidth: 4 }} 
                    animationDuration={1500}
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Sidebar / Insights */}
        <div className="lg:w-[400px] flex flex-col gap-6 shrink-0">
          {/* Top Consumer Insight Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Zap className="w-24 h-24" />
            </div>
            <p className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-2">Maior Consumidor</p>
            <h3 className="text-2xl font-black mb-4 truncate pr-12">{topAppliance.name}</h3>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-4xl font-black">{((topAppliance.value / totalConsumption) * 100).toFixed(1)}%</p>
                <p className="text-xs text-indigo-100 font-medium">do consumo total da casa</p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedApplianceName(topAppliance.name)}
                className="px-4 py-2 bg-white text-indigo-600 text-xs font-black rounded-xl shadow-lg"
              >
                VER DETALHES
              </motion.button>
            </div>
          </motion.div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Ranking de Consumo</h3>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full">TOP 6</span>
            </div>
            
            <div className="space-y-3">
              {data.slice(0, 6).map((item, index) => {
                const percent = ((item.value / totalConsumption) * 100).toFixed(1);
                const isSelected = selectedApplianceName === item.name;
                return (
                  <motion.button 
                    key={index} 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedApplianceName(isSelected ? null : item.name)}
                    className={`flex items-center justify-between w-full p-4 rounded-2xl border transition-all text-left group ${
                      isSelected 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-xl shadow-indigo-100' 
                        : 'bg-white border-slate-100 hover:border-indigo-200 hover:shadow-md text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div 
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        0{index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className={`text-sm font-bold block truncate ${isSelected ? 'text-white' : 'text-slate-800'}`} title={item.name}>
                          {item.name}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-indigo-200' : ''}`} style={isSelected ? {} : { backgroundColor: COLORS[index % COLORS.length] }} />
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                            {item.value.toFixed(1)} kWh
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-lg font-black block leading-none ${isSelected ? 'text-white' : 'text-slate-900'}`}>{percent}%</span>
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
                className="absolute inset-0 bg-slate-900/80 backdrop-blur-md"
              />
              
              <motion.div 
                key={selectedApplianceName}
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden relative z-10 border border-slate-200"
              >
                <div className="bg-indigo-600 p-5 sm:p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Info className="w-48 h-48" />
                  </div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedApplianceName(null)}
                    className="absolute top-8 right-8 p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors z-20"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <Zap className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-indigo-200">Relatório Detalhado</span>
                    </div>
                    <h3 className="text-4xl font-black tracking-tight leading-none">
                      {selectedAppliance.name}
                    </h3>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                    {[
                      { label: 'Qtd', value: selectedAppliance.quantity, unit: '' },
                      { label: 'Potência', value: selectedAppliance.power, unit: 'W' },
                      { label: 'Uso Diário', value: selectedAppliance.hoursPerDay, unit: 'h' },
                      { label: 'Dias/Mês', value: selectedAppliance.daysPerMonth, unit: '' }
                    ].map((stat, i) => (
                      <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                        <p className="text-[9px] text-slate-400 uppercase font-black mb-1 tracking-widest">{stat.label}</p>
                        <p className="text-xl font-black text-slate-900 leading-none">
                          {stat.value}<span className="text-xs font-bold text-slate-300 ml-0.5">{stat.unit}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-5 bg-indigo-50 rounded-[24px] border border-indigo-100 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-3 opacity-5">
                        <BarChart3 className="w-20 h-20" />
                      </div>
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
                          <BarChart3 className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-1">Consumo Mensal</p>
                          <p className="text-xl font-black text-indigo-900 leading-none">{consumption.toFixed(1)} <span className="text-sm font-bold">kWh</span></p>
                        </div>
                      </div>
                      <div className="text-right relative z-10">
                        <p className="text-[9px] font-black text-indigo-300 uppercase tracking-[0.2em] mb-1">Impacto Total</p>
                        <p className="text-3xl font-black text-indigo-600 leading-none">{percent}%</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Consumo Diário</p>
                        <p className="text-base font-black text-slate-700 leading-none">{dailyConsumption.toFixed(2)} <span className="text-[10px] font-bold text-slate-300">kWh</span></p>
                      </div>
                      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Consumo Anual</p>
                        <p className="text-base font-black text-indigo-600 leading-none">{(consumption * 12).toFixed(0)} <span className="text-[10px] font-bold text-indigo-200">kWh</span></p>
                      </div>
                      <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Custo Mensal Est.</p>
                        <p className="text-base font-black text-emerald-600 leading-none">
                          R$ {(consumption * 0.92).toFixed(2)}
                        </p>
                        <span className="text-[7px] text-slate-400 font-bold block mt-1">*Base: R$ 0,92/kWh</span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedApplianceName(null)}
                    className="w-full mt-8 py-4 bg-slate-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
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
