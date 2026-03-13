import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Appliance } from '../types';
import { calculateConsumption } from '../utils';

interface Props {
  appliances: Appliance[];
  totalConsumption: number;
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export default function ConsumptionChart({ appliances, totalConsumption }: Props) {
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

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Distribuição de Consumo</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={140}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 self-start">
          <h3 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wider">Maiores Vilões</h3>
          <div className="space-y-4">
            {data.slice(0, 5).map((item, index) => {
              const percent = ((item.value / totalConsumption) * 100).toFixed(1);
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm font-medium text-slate-700 truncate max-w-[120px]" title={item.name}>
                      {item.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900">{percent}%</span>
                    <span className="text-xs text-slate-500 block">{item.value.toFixed(1)} kWh</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
