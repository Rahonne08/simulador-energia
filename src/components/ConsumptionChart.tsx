import { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Appliance } from '../types';
import { calculateConsumption } from '../utils';
import { X, Info, PieChart as PieChartIcon, BarChart3, LineChart as LineChartIcon } from 'lucide-react';
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

  if (data.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-full min-h-[400px] text-slate-500">
        <PieChart className="w-16 h-16 mb-4 text-slate-300" />
        <p>Adicione aparelhos para ver o gráfico de consumo.</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percent = ((data.value / totalConsumption) * 100).toFixed(1);
      return (
        <div className="bg-white p-3 border border-slate-200 shadow-lg rounded-lg">
          <p className="font-medium text-slate-800">{data.name}</p>
          <p className="text-indigo-600 font-bold">{data.value.toFixed(1)} kWh</p>
          <p className="text-sm text-slate-500">{percent}% do total</p>
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
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-800">Distribuição de Consumo</h2>
          {selectedApplianceName && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedApplianceName(null)}
              className="px-2 py-1 bg-indigo-100 text-indigo-600 text-xs font-bold rounded-md hover:bg-indigo-200 transition-colors"
            >
              Limpar Seleção
            </motion.button>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <Info className="w-4 h-4" />
            <span>Clique em um elemento para ver detalhes</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button 
              onClick={() => setChartType('pie')} 
              className={`p-1.5 rounded-md transition-all ${chartType === 'pie' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
              title="Gráfico de Pizza"
            >
              <PieChartIcon className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setChartType('bar')} 
              className={`p-1.5 rounded-md transition-all ${chartType === 'bar' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
              title="Gráfico de Barras"
            >
              <BarChart3 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setChartType('line')} 
              className={`p-1.5 rounded-md transition-all ${chartType === 'line' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
              title="Gráfico de Linha"
            >
              <LineChartIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 h-[400px] md:h-[550px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'pie' ? (
              <PieChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="45%"
                  innerRadius={window.innerWidth < 768 ? 60 : 90}
                  outerRadius={window.innerWidth < 768 ? 100 : 160}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      onClick={() => setSelectedApplianceName(entry.name)}
                      className="cursor-pointer hover:opacity-80 transition-opacity outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
              </PieChart>
            ) : chartType === 'bar' ? (
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: window.innerWidth < 768 ? 80 : 120 }} onClick={handleChartClick}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={window.innerWidth < 768 ? 80 : 120} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                      className="cursor-pointer hover:opacity-80 transition-opacity outline-none"
                    />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: window.innerWidth < 768 ? 80 : 120 }} onClick={handleChartClick}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={window.innerWidth < 768 ? 80 : 120} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4f46e5" 
                  strokeWidth={3} 
                  dot={{ r: 6, fill: '#4f46e5', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 8, cursor: 'pointer' }} 
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="w-full md:w-80 lg:w-96 bg-slate-50 p-6 rounded-2xl border border-slate-200 shrink-0">
          <h3 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wider">Maiores Vilões</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
            {data.slice(0, 6).map((item, index) => {
              const percent = ((item.value / totalConsumption) * 100).toFixed(1);
              const isSelected = selectedApplianceName === item.name;
              return (
                <motion.button 
                  key={index} 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedApplianceName(isSelected ? null : item.name)}
                  className={`flex items-center justify-between w-full p-3 rounded-xl border transition-all text-left ${
                    isSelected 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-200' 
                      : 'bg-white border-slate-100 hover:border-indigo-200 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className={`w-3 h-3 rounded-full shrink-0 ${isSelected ? 'bg-white' : ''}`} 
                      style={isSelected ? {} : { backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className={`text-sm font-medium truncate max-w-[140px] ${isSelected ? 'text-white' : 'text-slate-700'}`} title={item.name}>
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold block ${isSelected ? 'text-white' : 'text-slate-900'}`}>{percent}%</span>
                    <span className={`text-xs block ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>{item.value.toFixed(1)} kWh</span>
                  </div>
                </motion.button>
              );
            })}
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
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              
              <motion.div 
                key={selectedApplianceName}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10 border border-slate-200"
              >
                <div className="bg-indigo-600 p-6 text-white relative">
                  <motion.button 
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedApplianceName(null)}
                    className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                  
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <Info className="w-6 h-6" />
                    {selectedAppliance.name}
                  </h3>
                  <p className="text-indigo-100 mt-1">Detalhamento técnico e impacto no consumo</p>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-widest">Quantidade</p>
                      <p className="text-2xl font-black text-slate-800">{selectedAppliance.quantity}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-widest">Potência</p>
                      <p className="text-2xl font-black text-slate-800">{selectedAppliance.power}<span className="text-sm font-bold text-slate-400 ml-1">W</span></p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-widest">Uso Diário</p>
                      <p className="text-2xl font-black text-slate-800">{selectedAppliance.hoursPerDay}<span className="text-sm font-bold text-slate-400 ml-1">h</span></p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 tracking-widest">Dias/Mês</p>
                      <p className="text-2xl font-black text-slate-800">{selectedAppliance.daysPerMonth}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <BarChart3 className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Consumo Mensal</p>
                          <p className="text-xl font-black text-indigo-900">{consumption.toFixed(1)} kWh</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Impacto Total</p>
                        <p className="text-3xl font-black text-indigo-600">{percent}%</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Consumo Diário</p>
                        <p className="text-lg font-bold text-slate-700">{dailyConsumption.toFixed(2)} <span className="text-xs font-normal">kWh</span></p>
                      </div>
                      <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Consumo Anual</p>
                        <p className="text-lg font-bold text-indigo-600">{(consumption * 12).toFixed(0)} <span className="text-xs font-normal">kWh</span></p>
                      </div>
                      <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Custo Mensal</p>
                        <p className="text-lg font-bold text-emerald-600">
                          R$ {(consumption * 0.92).toFixed(2)}
                        </p>
                        <span className="text-[10px] text-slate-400 font-normal block leading-none mt-1">*R$ 0,92/kWh</span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedApplianceName(null)}
                    className="w-full mt-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                  >
                    Fechar Detalhes
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
