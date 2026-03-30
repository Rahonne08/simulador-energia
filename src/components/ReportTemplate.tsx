import React from 'react';
import { Appliance, BillConfig } from '../types';
import { calculateConsumption, formatCurrency } from '../utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { TARIFF_FLAGS } from '../constants';

interface Props {
  appliances: Appliance[];
  totalConsumption: number;
  bill: { total: number };
  billConfig: BillConfig;
  tips: { title: string; desc: string; type: string }[];
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6'];

// Map tariff flags to hex colors for PDF
const FLAG_COLORS: Record<string, string> = {
  verde: '#16a34a',
  amarela: '#ca8a04',
  vermelha1: '#ef4444',
  vermelha2: '#b91c1c',
};

export const ReportTemplate = React.forwardRef<HTMLDivElement, Props>(({ appliances, totalConsumption, bill, billConfig, tips }, ref) => {
  const sortedAppliances = [...appliances].sort((a, b) => calculateConsumption(b) - calculateConsumption(a));
  
  const chartData = sortedAppliances.map(app => ({
    name: app.name,
    value: calculateConsumption(app)
  }));

  return (
    <div 
      ref={ref} 
      className="p-10 w-[800px] font-sans absolute top-0 -left-[9999px]"
      style={{ minHeight: '1123px', backgroundColor: '#ffffff', color: '#0f172a' }} // A4 approx height
    >
      {/* Header */}
      <div className="pb-6 mb-8 flex justify-between items-end" style={{ borderBottom: '2px solid #4f46e5' }}>
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: '#4338ca' }}>EnerControl 🔋</h1>
          <p className="mt-1 uppercase tracking-wider text-sm font-semibold" style={{ color: '#64748b' }}>Relatório de Consumo e Estimativa</p>
        </div>
        <div className="text-right">
          <p className="text-sm" style={{ color: '#64748b' }}>Data de Geração:</p>
          <p className="font-semibold">{new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="p-4 rounded-xl border" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
          <p className="text-xs uppercase font-bold tracking-wider mb-1" style={{ color: '#64748b' }}>Consumo Total</p>
          <p className="text-2xl font-bold" style={{ color: '#1e293b' }}>{totalConsumption.toFixed(0)} <span className="text-sm font-normal" style={{ color: '#64748b' }}>kWh/mês</span></p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }}>
          <p className="text-xs uppercase font-bold tracking-wider mb-1" style={{ color: '#059669' }}>Valor Estimado</p>
          <p className="text-2xl font-bold" style={{ color: '#047857' }}>{formatCurrency(bill.total)}</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
          <p className="text-xs uppercase font-bold tracking-wider mb-1" style={{ color: '#64748b' }}>Bandeira Tarifária</p>
          <p className="text-lg font-bold" style={{ color: FLAG_COLORS[billConfig.flag] || '#475569' }}>
            {TARIFF_FLAGS[billConfig.flag]?.label || 'Desconhecida'}
          </p>
        </div>
      </div>

      {/* Gráfico */}
      {appliances.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold mb-4 pb-2" style={{ color: '#1e293b', borderBottom: '1px solid #e2e8f0' }}>Distribuição de Consumo</h2>
          <div className="h-[300px] w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Tabela de Aparelhos */}
      <div className="mb-10">
        <h2 className="text-lg font-bold mb-4 pb-2" style={{ color: '#1e293b', borderBottom: '1px solid #e2e8f0' }}>Detalhamento dos Aparelhos</h2>
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr>
              <th className="p-3 font-semibold rounded-tl-lg" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>Aparelho</th>
              <th className="p-3 font-semibold" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>Qtd</th>
              <th className="p-3 font-semibold" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>Potência</th>
              <th className="p-3 font-semibold" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>Uso</th>
              <th className="p-3 font-semibold text-right rounded-tr-lg" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>Consumo (kWh/mês)</th>
            </tr>
          </thead>
          <tbody>
            {sortedAppliances.map((app, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td className="p-3 font-medium" style={{ color: '#1e293b' }}>{app.name}</td>
                <td className="p-3" style={{ color: '#475569' }}>{app.quantity}</td>
                <td className="p-3" style={{ color: '#475569' }}>{app.power} W</td>
                <td className="p-3" style={{ color: '#475569' }}>{app.hoursPerDay}h/dia × {app.daysPerMonth}d</td>
                <td className="p-3 text-right font-bold" style={{ color: '#4f46e5' }}>{calculateConsumption(app).toFixed(1)}</td>
              </tr>
            ))}
            {appliances.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center" style={{ color: '#64748b' }}>Nenhum aparelho adicionado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dicas */}
      {tips.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-4 pb-2" style={{ color: '#1e293b', borderBottom: '1px solid #e2e8f0' }}>Dicas de Economia Personalizadas</h2>
          <div className="grid grid-cols-2 gap-4">
            {tips.map((tip, idx) => (
              <div key={idx} className="p-4 rounded-lg border" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
                <h3 className="font-bold text-sm mb-1" style={{ color: '#1e293b' }}>{tip.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#475569' }}>{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-12 pt-6 text-center text-xs" style={{ borderTop: '1px solid #e2e8f0', color: '#94a3b8' }}>
        Gerado por EnerControl 🔋 - Desenvolvido por Pablo Rahonne
      </div>
    </div>
  );
});

ReportTemplate.displayName = 'ReportTemplate';
