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
      style={{ backgroundColor: '#ffffff', color: '#0f172a' }}
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

      {/* Relatório Individual por Equipamento */}
      <div className="mb-10">
        <h2 className="text-lg font-bold mb-4 pb-2" style={{ color: '#1e293b', borderBottom: '1px solid #e2e8f0' }}>Relatório Individual por Equipamento</h2>
        {appliances.length === 0 ? (
          <p className="p-4 text-center" style={{ color: '#64748b' }}>Nenhum aparelho adicionado.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {sortedAppliances.map((app, idx) => {
              const monthly = calculateConsumption(app);
              const daily = (app.power * app.hoursPerDay * app.quantity) / 1000;
              const annual = monthly * 12;
              const percent = totalConsumption > 0 ? (monthly / totalConsumption) * 100 : 0;

              return (
                <div key={idx} className="p-4 rounded-lg border" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
                  <h3 className="font-bold text-base mb-3" style={{ color: '#1e293b' }}>{app.name}</h3>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-xs">
                    <div>
                      <p style={{ color: '#64748b' }}>Qtd / Potência:</p>
                      <p className="font-semibold" style={{ color: '#334155' }}>{app.quantity}x • {app.power}W</p>
                    </div>
                    <div>
                      <p style={{ color: '#64748b' }}>Uso:</p>
                      <p className="font-semibold" style={{ color: '#334155' }}>{app.hoursPerDay}h/dia • {app.daysPerMonth}d</p>
                    </div>
                    <div>
                      <p style={{ color: '#64748b' }}>Consumo Diário:</p>
                      <p className="font-semibold" style={{ color: '#334155' }}>{daily.toFixed(2)} kWh</p>
                    </div>
                    <div>
                      <p style={{ color: '#64748b' }}>Consumo Mensal:</p>
                      <p className="font-bold" style={{ color: '#4f46e5' }}>{monthly.toFixed(1)} kWh</p>
                    </div>
                    <div>
                      <p style={{ color: '#64748b' }}>Consumo Anual:</p>
                      <p className="font-semibold" style={{ color: '#334155' }}>{annual.toFixed(0)} kWh</p>
                    </div>
                    <div>
                      <p style={{ color: '#64748b' }}>Impacto Total:</p>
                      <p className="font-bold" style={{ color: '#059669' }}>{percent.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Dicas */}
      {tips.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-bold mb-4 pb-2" style={{ color: '#1e293b', borderBottom: '1px solid #e2e8f0' }}>Dicas de Economia Personalizadas</h2>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {tips.map((tip, idx) => (
              <div key={idx} className="p-4 rounded-lg border" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
                <h3 className="font-bold text-sm mb-1" style={{ color: '#1e293b' }}>{tip.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#475569' }}>{tip.desc}</p>
              </div>
            ))}
          </div>

          {/* Simulação de Troca */}
          <div className="p-6 rounded-xl" style={{ backgroundColor: '#0f172a', color: '#ffffff' }}>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#ffffff' }}>Simulação de Troca de Aparelhos</h3>
            <p className="mb-6 text-sm" style={{ color: '#cbd5e1' }}>Veja o impacto financeiro de trocar aparelhos antigos por versões mais eficientes (Selo Procel A).</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border flex items-center justify-between" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
                <div>
                  <p className="text-xs" style={{ color: '#94a3b8' }}>Chuveiro Elétrico</p>
                  <p className="font-semibold" style={{ color: '#ffffff' }}>5500W</p>
                </div>
                <div style={{ color: '#64748b' }}>→</div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: '#34d399' }}>Aquecedor Solar</p>
                  <p className="font-semibold" style={{ color: '#6ee7b7' }}>-80% consumo</p>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border flex items-center justify-between" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }}>
                <div>
                  <p className="text-xs" style={{ color: '#94a3b8' }}>Lâmpada Comum</p>
                  <p className="font-semibold" style={{ color: '#ffffff' }}>60W</p>
                </div>
                <div style={{ color: '#64748b' }}>→</div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: '#34d399' }}>Lâmpada LED</p>
                  <p className="font-semibold" style={{ color: '#6ee7b7' }}>9W (-85%)</p>
                </div>
              </div>
            </div>
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
