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

      {/* Selected Appliance Details */}
      <AnimatePresence mode="wait">
        {selectedApplianceName && (() => {
          const selectedAppliance = appliances.find(app => app.name === selectedApplianceName);
          if (!selectedAppliance) return null;

          const consumption = calculateConsumption(selectedAppliance);
          const percent = ((consumption / totalConsumption) * 100).toFixed(1);
          const dailyConsumption = (selectedAppliance.power * selectedAppliance.hoursPerDay * selectedAppliance.quantity) / 1000;

          return (
            <motion.div 
              key={selectedApplianceName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="mt-8 bg-indigo-50/50 border border-indigo-100 rounded-2xl p-6 relative"
            >
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedApplianceName(null)}
                className="absolute top-4 right-4 p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </motion.button>
              
              <h3 className="text-lg font-bold text-indigo-900 mb-4 flex items-center gap-2">
                Detalhes: {selectedAppliance.name}
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white p-4 rounded-xl border border-indigo-50 shadow-sm">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1 tracking-wider">Quantidade</p>
                  <p className="text-xl font-bold text-slate-800">{selectedAppliance.quantity}</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-indigo-50 shadow-sm">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1 tracking-wider">Potência</p>
                  <p className="text-xl font-bold text-slate-800">{selectedAppliance.power} <span className="text-sm font-medium text-slate-500">W</span></p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-indigo-50 shadow-sm">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1 tracking-wider">Uso Diário</p>
                  <p className="text-xl font-bold text-slate-800">{selectedAppliance.hoursPerDay} <span className="text-sm font-medium text-slate-500">h</span></p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-indigo-50 shadow-sm">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1 tracking-wider">Dias/Mês</p>
                  <p className="text-xl font-bold text-slate-800">{selectedAppliance.daysPerMonth}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-xl border border-indigo-100 shadow-sm">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1 tracking-wider">Consumo Diário</p>
                  <p className="text-lg font-bold text-slate-700">{dailyConsumption.toFixed(2)} <span className="text-sm font-medium text-slate-500">kWh</span></p>
                </div>
                <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1 tracking-wider">Consumo Mensal Total</p>
                  <p className="text-2xl font-black text-indigo-600">{consumption.toFixed(1)} <span className="text-base font-bold text-indigo-400">kWh</span></p>
                </div>
                <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
                <div className="sm:text-right">
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1 tracking-wider">Impacto no Total</p>
                  <p className="text-2xl font-black text-emerald-500">{percent}%</p>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
