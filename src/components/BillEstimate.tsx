import React from 'react';
import { motion } from 'motion/react';
import { Appliance, BillConfig, TariffFlag } from '../types';
import { TARIFF_FLAGS } from '../constants';
import { formatCurrency, formatNumber } from '../utils';
import { Settings, Zap, AlertTriangle, ShieldCheck, DollarSign, Activity } from 'lucide-react';

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
  return (
    <div className="p-6 sm:p-8 text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-950/60 rounded-xl border border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Cálculo Tarifário & Projeção Financeira
            </h2>
            <p className="text-xs font-mono text-slate-400">Simulação de faturamento e composição de impostos regulatórios</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3.5 py-1.5 rounded-full border border-cyan-500/30">
          <Settings className="w-3.5 h-3.5" />
          <span>CONFIGURAÇÃO DE REDE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Configuration Panel */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#0b111e]/90 p-6 rounded-3xl border border-cyan-500/20 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <h3 className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Parâmetros de Fornecimento
            </h3>
            <span className="text-[10px] font-mono text-slate-500 uppercase">Tarifa & Carga</span>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-[#070b13] rounded-2xl border border-slate-800">
              <div className="pr-4">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Tarifa Social de Energia (TSEE)
                </h4>
                <p className="text-xs font-mono text-slate-400 mt-1">Isenção de 100% até 80 kWh mensais</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={billConfig.isLowIncome}
                  onChange={(e) => setBillConfig({ ...billConfig, isLowIncome: e.target.checked })}
                  aria-label="Ativar Tarifa Social para Cliente Baixa Renda"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 shadow-inner"></div>
              </label>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-2 uppercase">
                Padrão de Entrada (Conexão)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['monofasico', 'bifasico', 'trifasico'] as const).map((type) => (
                  <motion.label 
                    key={type} 
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center justify-center p-3 rounded-xl border cursor-pointer transition-all text-xs font-mono uppercase tracking-wider ${
                      billConfig.connectionType === type 
                        ? 'border-cyan-500 bg-cyan-950/60 text-cyan-300 font-bold shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500' 
                        : 'border-slate-800 bg-[#070b13] text-slate-400 hover:border-slate-700 hover:text-slate-200'
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
              <p className="text-[11px] font-mono text-slate-500 mt-2">Custo de disponibilidade regulatório.</p>
            </div>

            {!billConfig.isLowIncome && (
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-2 uppercase">
                  Tarifa de Energia Homologada (R$/kWh)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400 font-mono font-bold">R$</span>
                  <input 
                    type="number" 
                    step="0.01"
                    value={billConfig.tariff}
                    onChange={e => setBillConfig({ ...billConfig, tariff: Number(e.target.value) })}
                    className="w-full rounded-xl border-slate-800 border py-3 pl-11 pr-4 text-white bg-[#070b13] focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 outline-none transition-shadow text-base font-mono font-bold"
                  />
                </div>
                <p className="text-[11px] font-mono text-slate-500 mt-2">Tarifa da concessionária por quilowatt-hora consumido.</p>
              </div>
            )}

            {billConfig.isLowIncome && (
              <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-500/30">
                <p className="text-xs text-emerald-300 font-mono leading-relaxed">
                  <strong className="text-white uppercase font-bold">Regra TSEE Ativa:</strong> Primeiros 80 kWh isentos de tarifa base (100% de subsídio). O excedente será faturado na tarifa convencional.
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-2 uppercase">
                Bandeira Tarifária Aneel
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {(Object.entries(TARIFF_FLAGS) as [TariffFlag, typeof TARIFF_FLAGS[TariffFlag]][]).map(([key, flag]) => {
                  const isSelected = billConfig.flag === key;
                  return (
                    <motion.label 
                      key={key} 
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-cyan-500/80 bg-cyan-950/40 ring-1 ring-cyan-500/50 shadow-md' 
                          : 'border-slate-800 bg-[#070b13] hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="tariffFlag" 
                          value={key}
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setBillConfig({ ...billConfig, flag: key as TariffFlag });
                            }
                          }}
                          className="w-4 h-4 text-cyan-500 bg-slate-900 border-slate-700 focus:ring-cyan-400"
                        />
                        <span className={`text-xs font-mono font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {flag.label}
                        </span>
                      </div>
                      {flag.extraPer100kWh > 0 && (
                        <span className="text-[11px] font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30 whitespace-nowrap">
                          + {formatCurrency(flag.extraPer100kWh)} / 100kWh
                        </span>
                      )}
                    </motion.label>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bill Breakdown Terminal */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col justify-start"
        >
          <div className="bg-gradient-to-b from-[#0e172a] to-[#070b13] rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden border border-cyan-500/30">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-2 relative z-10">
              <h3 className="text-cyan-400 font-mono text-xs uppercase tracking-widest font-bold">Projeção Consolidada</h3>
              <span className="text-[10px] font-mono text-slate-500 border border-slate-800 px-2 py-0.5 rounded">MÊS CORRENTE</span>
            </div>

            <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight mb-8 relative z-10 text-white drop-shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              {formatCurrency(bill.total)}
            </div>

            <div className="space-y-4 relative z-10 font-mono text-sm">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <span className="text-slate-400">Consumo Faturado</span>
                <span className="font-bold text-lg flex items-center gap-1.5 text-cyan-400">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  {formatNumber(bill.billedConsumption, 1)} kWh
                </span>
              </div>
              
              {bill.billedConsumption > totalConsumption && (
                <div className="flex flex-col sm:flex-row justify-between sm:items-center text-[11px] text-amber-400/80 mt-1 mb-2 gap-1 bg-amber-950/20 p-2 rounded-lg border border-amber-500/20">
                  <span>Consumo Medido: {formatNumber(totalConsumption, 1)} kWh</span>
                  <span>(Ajuste: Custo Disponibilidade)</span>
                </div>
              )}
              
              {billConfig.isLowIncome && (
                <div className="flex justify-between items-center text-xs text-emerald-400 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-500/30">
                  <span>Desconto Tarifa Social (TSEE)</span>
                  <span className="font-bold">- {formatCurrency(bill.discount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Fornecimento de Energia (Base)</span>
                <span className="font-semibold text-white">{formatCurrency(bill.base)}</span>
              </div>
              
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  Adicional de Bandeira
                  {bill.extra > 0 && <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />}
                </span>
                <span className={`font-bold ${bill.extra > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {bill.extra > 0 ? '+' : ''}{formatCurrency(bill.extra)}
                </span>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-2">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Tributos Regulatórios Estaduais & Federais</p>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">ICMS Estadual (23%)</span>
                  <span className="font-semibold text-rose-400">+{formatCurrency(bill.icms)}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">PIS / COFINS Federal</span>
                  <span className="font-semibold text-rose-400">+{formatCurrency(bill.pis + bill.cofins)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <p className="text-[11px] font-mono text-slate-500 text-center mt-4 px-4 leading-relaxed">
            * O cálculo consolida: (Consumo Faturado &times; Tarifa Homologada) + Adicionais de Bandeira + Carga Tributária (ICMS + PIS/COFINS).
          </p>
        </motion.div>
      </div>
    </div>
  );
}

