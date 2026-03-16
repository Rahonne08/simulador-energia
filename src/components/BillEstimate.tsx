import React from 'react';
import { motion } from 'motion/react';
import { Appliance, BillConfig, TariffFlag } from '../types';
import { TARIFF_FLAGS } from '../constants';
import { formatCurrency, formatNumber } from '../utils';
import { Settings, Zap, AlertTriangle } from 'lucide-react';

interface Props {
  appliances: Appliance[];
  billConfig: BillConfig;
  setBillConfig: React.Dispatch<React.SetStateAction<BillConfig>>;
  totalConsumption: number;
  bill: { 
    base: number; 
    extra: number; 
    icms: number;
    pis: number;
    cofins: number;
    totalTaxes: number;
    total: number; 
    discount: number;
    billedConsumption: number;
  };
}

export default function BillEstimate({ appliances, billConfig, setBillConfig, totalConsumption, bill }: Props) {
  const getFlagColorName = (colorClass: string) => {
    if (!colorClass) return 'slate';
    if (colorClass.includes('green')) return 'green';
    if (colorClass.includes('yellow')) return 'yellow';
    if (colorClass.includes('red')) return 'red';
    return 'slate';
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-slate-800">Estimativa da Conta</h2>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
          <Settings className="w-4 h-4" />
          Configuração Tarifária
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Configuration Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200"
        >
          <h3 className="text-sm font-semibold text-slate-600 mb-5 uppercase tracking-wider">Tarifa e Bandeira</h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
              <div className="pr-4">
                <h4 className="font-medium text-slate-800">Cliente Baixa Renda</h4>
                <p className="text-xs text-slate-500 mt-1">Tarifa Social (até 80 kWh grátis)</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={billConfig.isLowIncome}
                  onChange={(e) => setBillConfig({ ...billConfig, isLowIncome: e.target.checked })}
                  aria-label="Ativar Tarifa Social para Cliente Baixa Renda"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tipo de Conexão
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['monofasico', 'bifasico', 'trifasico'] as const).map((type) => (
                  <motion.label 
                    key={type} 
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all text-sm ${
                      billConfig.connectionType === type 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700 font-medium ring-1 ring-indigo-500' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <input 
                      type="radio" 
                      name="connectionType" 
                      value={type}
                      checked={billConfig.connectionType === type}
                      onChange={() => setBillConfig({ ...billConfig, connectionType: type })}
                      className="sr-only"
                    />
                    <span className="capitalize">{type.replace('fasico', 'fásico')}</span>
                  </motion.label>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">Define o custo de disponibilidade (mínimo faturável).</p>
            </div>

            {!billConfig.isLowIncome && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tarifa de Energia (R$/kWh)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">R$</span>
                  <input 
                    type="number" 
                    step="0.01"
                    value={billConfig.tariff}
                    onChange={e => setBillConfig({ ...billConfig, tariff: Number(e.target.value) })}
                    className="w-full rounded-xl border-slate-300 border py-3 pl-10 pr-4 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow text-lg font-semibold"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">Valor cobrado pela distribuidora por cada kWh consumido.</p>
              </div>
            )}

            {billConfig.isLowIncome && (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-sm text-emerald-800">
                  <strong>Regra Tarifa Social:</strong> Os primeiros 80 kWh são gratuitos (100% de desconto). O consumo acima de 80 kWh será cobrado com a tarifa normal.
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Bandeira Tarifária Atual
              </label>
              <div className="grid grid-cols-1 gap-2">
                {(Object.entries(TARIFF_FLAGS) as [TariffFlag, typeof TARIFF_FLAGS[TariffFlag]][]).map(([key, flag]) => (
                  <motion.label 
                    key={key} 
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      billConfig.flag === key 
                        ? `border-${getFlagColorName(flag.color)}-500 ${flag.bg} ring-1 ring-${getFlagColorName(flag.color)}-500` 
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="tariffFlag" 
                        value={key}
                        checked={billConfig.flag === key}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setBillConfig({ ...billConfig, flag: key as TariffFlag });
                          }
                        }}
                        className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                      />
                      <span className={`font-medium ${billConfig.flag === key ? flag.color : 'text-slate-700'}`}>
                        {flag.label}
                      </span>
                    </div>
                    {flag.extraPer100kWh > 0 && (
                      <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100 whitespace-nowrap">
                        + {formatCurrency(flag.extraPer100kWh)}
                      </span>
                    )}
                  </motion.label>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bill Breakdown */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-start"
        >
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
            
            <h3 className="text-indigo-100 font-medium mb-1 relative z-10">Valor Estimado da Conta</h3>
            <div className="text-4xl sm:text-5xl font-bold tracking-tight mb-8 relative z-10">
              {formatCurrency(bill.total)}
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center pb-4 border-b border-indigo-500/30">
                <span className="text-indigo-100">Consumo Faturado</span>
                <span className="font-semibold text-lg flex items-center gap-1">
                  <Zap className="w-4 h-4 text-yellow-300" />
                  {formatNumber(bill.billedConsumption, 1)} kWh
                </span>
              </div>
              
              {bill.billedConsumption > totalConsumption && (
                <div className="flex flex-col sm:flex-row justify-between sm:items-center text-xs text-indigo-200 mt-1 mb-2 gap-1">
                  <span>Consumo Medido: {formatNumber(totalConsumption, 1)} kWh</span>
                  <span>(Custo de Disponibilidade)</span>
                </div>
              )}
              
              {billConfig.isLowIncome && (
                <div className="flex justify-between items-center text-sm text-emerald-300">
                  <span>Desconto Tarifa Social</span>
                  <span className="font-medium">- {formatCurrency(bill.discount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm">
                <span className="text-indigo-200">
                  Custo Base
                </span>
                <span className="font-medium">{formatCurrency(bill.base)}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-indigo-200 flex items-center gap-1.5">
                  Acréscimo Bandeira
                  {bill.extra > 0 && <AlertTriangle className="w-3 h-3 text-yellow-300" />}
                </span>
                <span className={`font-medium ${bill.extra > 0 ? 'text-yellow-300' : 'text-emerald-300'}`}>
                  {bill.extra > 0 ? '+' : ''}{formatCurrency(bill.extra)}
                </span>
              </div>

              <div className="pt-3 mt-3 border-t border-indigo-500/30 space-y-2">
                <p className="text-xs text-indigo-300 font-medium uppercase tracking-wider mb-2">Tributos</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-indigo-200">ICMS (23%)</span>
                  <span className="font-medium text-red-300">+{formatCurrency(bill.icms)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-indigo-200">PIS/COFINS</span>
                  <span className="font-medium text-red-300">+{formatCurrency(bill.pis + bill.cofins)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-slate-400 text-center mt-4 px-4 leading-relaxed">
            * O valor estimado é calculado como: (Consumo Faturado × Tarifa) + Tributos (ICMS, PIS e COFINS).
          </p>
        </motion.div>
      </div>
    </div>
  );
}
