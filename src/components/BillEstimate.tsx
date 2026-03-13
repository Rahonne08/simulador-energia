import React from 'react';
import { Appliance, BillConfig, TariffFlag } from '../types';
import { TARIFF_FLAGS } from '../constants';
import { formatCurrency, formatNumber } from '../utils';
import { Settings, Zap, AlertTriangle, MapPin } from 'lucide-react';
import { MARANHAO_CITIES } from '../data/maranhaoCities';

interface Props {
  appliances: Appliance[];
  billConfig: BillConfig;
  setBillConfig: React.Dispatch<React.SetStateAction<BillConfig>>;
  totalConsumption: number;
  bill: { base: number; extra: number; cip: number; total: number; discount: number };
}

export default function BillEstimate({ appliances, billConfig, setBillConfig, totalConsumption, bill }: Props) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-slate-800">Estimativa da Conta</h2>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
          <Settings className="w-4 h-4" />
          Configuração Tarifária
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        {/* Configuration Panel */}
        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-600 mb-5 uppercase tracking-wider">Tarifa e Bandeira</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cidade (Maranhão)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <MapPin className="w-4 h-4" />
                </span>
                <select
                  value={billConfig.city}
                  onChange={e => setBillConfig({ ...billConfig, city: e.target.value })}
                  className="w-full rounded-xl border-slate-300 border py-3 pl-10 pr-4 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow appearance-none bg-white"
                >
                  {MARANHAO_CITIES.map(city => (
                    <option key={city.name} value={city.name}>{city.name}</option>
                  ))}
                </select>
              </div>
              <p className="text-xs text-slate-500 mt-2">Define o valor da Contribuição de Iluminação Pública (CIP).</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
              <div>
                <h4 className="font-medium text-slate-800">Cliente Baixa Renda</h4>
                <p className="text-xs text-slate-500 mt-1">Tarifa Social (até 80 kWh grátis)</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
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
                    className="w-full rounded-xl border-slate-300 border py-3 pl-10 pr-4 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">Valor cobrado pela distribuidora por cada kWh consumido.</p>
              </div>
            )}

            {billConfig.isLowIncome && (
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <p className="text-sm text-emerald-800">
                  <strong>Regra Tarifa Social:</strong> Os primeiros 80 kWh são gratuitos. O consumo acima de 80 kWh será cobrado a <strong>R$ 0,74/kWh</strong>.
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Bandeira Tarifária Atual
              </label>
              <div className="grid grid-cols-1 gap-2">
                {(Object.entries(TARIFF_FLAGS) as [TariffFlag, typeof TARIFF_FLAGS[TariffFlag]][]).map(([key, flag]) => (
                  <label 
                    key={key} 
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      billConfig.flag === key 
                        ? `border-${flag.color.split('-')[1]}-500 ${flag.bg} ring-1 ring-${flag.color.split('-')[1]}-500` 
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="tariffFlag" 
                        value={key}
                        checked={billConfig.flag === key}
                        onChange={() => setBillConfig({ ...billConfig, flag: key as TariffFlag })}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                      />
                      <span className={`font-medium ${billConfig.flag === key ? flag.color : 'text-slate-700'}`}>
                        {flag.label}
                      </span>
                    </div>
                    {flag.extraPer100kWh > 0 && (
                      <span className="text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100">
                        + {formatCurrency(flag.extraPer100kWh)} / 100kWh
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bill Breakdown */}
        <div className="flex flex-col justify-center">
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl"></div>
            
            <h3 className="text-indigo-100 font-medium mb-1 relative z-10">Valor Estimado da Conta</h3>
            <div className="text-5xl font-bold tracking-tight mb-8 relative z-10">
              {formatCurrency(bill.total)}
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-center pb-4 border-b border-indigo-500/30">
                <span className="text-indigo-100">Consumo Mensal</span>
                <span className="font-semibold text-lg flex items-center gap-1">
                  <Zap className="w-4 h-4 text-yellow-300" />
                  {formatNumber(totalConsumption, 1)} kWh
                </span>
              </div>
              
              {billConfig.isLowIncome && (
                <div className="flex justify-between items-center text-sm text-emerald-300">
                  <span>Desconto Tarifa Social</span>
                  <span className="font-medium">- {formatCurrency(bill.discount)}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm">
                <span className="text-indigo-200">
                  Custo Base ({billConfig.isLowIncome ? 'R$ 0,74' : formatCurrency(billConfig.tariff)}/kWh)
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

              <div className="flex justify-between items-center text-sm">
                <span className="text-indigo-200">Iluminação Pública (CIP)</span>
                <span className="font-medium text-yellow-300">+{formatCurrency(bill.cip)}</span>
              </div>
            </div>
          </div>
          
          <p className="text-xs text-slate-400 text-center mt-4 px-4">
            * Esta é uma estimativa baseada no consumo dos aparelhos informados. O valor real da conta inclui impostos (ICMS, PIS/COFINS) e taxas de iluminação pública que variam por município.
          </p>
        </div>
      </div>
    </div>
  );
}
