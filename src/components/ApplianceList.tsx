import React, { useState } from 'react';
import { Plus, Trash2, Zap, Scale, X } from 'lucide-react';
import { Appliance } from '../types';
import { COMMON_APPLIANCES } from '../constants';
import { calculateConsumption } from '../utils';

interface Props {
  appliances: Appliance[];
  setAppliances: React.Dispatch<React.SetStateAction<Appliance[]>>;
}

export default function ApplianceList({ appliances, setAppliances }: Props) {
  const [newAppliance, setNewAppliance] = useState<Partial<Appliance>>({
    name: '',
    quantity: 1,
    power: 0,
    hoursPerDay: 0,
    daysPerMonth: 30,
  });

  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [compareApp1, setCompareApp1] = useState<string>(COMMON_APPLIANCES[0].name);
  const [compareApp2, setCompareApp2] = useState<string>(COMMON_APPLIANCES[1].name);

  const handleAdd = () => {
    if (!newAppliance.name || !newAppliance.power || !newAppliance.hoursPerDay) return;
    
    setAppliances([
      ...appliances,
      {
        id: Math.random().toString(36).substr(2, 9),
        name: newAppliance.name,
        quantity: Number(newAppliance.quantity) || 1,
        power: Number(newAppliance.power),
        hoursPerDay: Number(newAppliance.hoursPerDay),
        daysPerMonth: Number(newAppliance.daysPerMonth) || 30,
      }
    ]);
    
    setNewAppliance({ name: '', quantity: 1, power: 0, hoursPerDay: 0, daysPerMonth: 30 });
  };

  const handleRemove = (id: string) => {
    setAppliances(appliances.filter(app => app.id !== id));
  };

  const handleAddCommon = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = COMMON_APPLIANCES.find(app => app.name === e.target.value);
    if (selected) {
      setNewAppliance({ ...selected });
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-slate-800">Seus Aparelhos</h2>
          <span className="bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full text-sm font-medium">
            {appliances.length} aparelhos
          </span>
        </div>
        <button
          onClick={() => setIsCompareModalOpen(true)}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Scale className="w-4 h-4" />
          Comparar Aparelhos
        </button>
      </div>

      {/* Add Form */}
      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-8">
        <h3 className="text-sm font-semibold text-slate-600 mb-4 uppercase tracking-wider">Adicionar Aparelho</h3>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-700 mb-1">Aparelhos Comuns</label>
          <select 
            className="w-full rounded-lg border-slate-300 border p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            onChange={handleAddCommon}
            defaultValue=""
          >
            <option value="" disabled>Selecione um aparelho para preencher...</option>
            {COMMON_APPLIANCES.map(app => (
              <option key={app.name} value={app.name}>{app.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">Nome</label>
            <input 
              type="text" 
              value={newAppliance.name}
              onChange={e => setNewAppliance({...newAppliance, name: e.target.value})}
              className="w-full rounded-lg border-slate-300 border p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ex: Ventilador"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Qtd</label>
            <input 
              type="number" 
              min="1"
              value={newAppliance.quantity || ''}
              onChange={e => setNewAppliance({...newAppliance, quantity: Number(e.target.value)})}
              className="w-full rounded-lg border-slate-300 border p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ex: 1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Potência (W)</label>
            <input 
              type="number" 
              value={newAppliance.power || ''}
              onChange={e => setNewAppliance({...newAppliance, power: Number(e.target.value)})}
              className="w-full rounded-lg border-slate-300 border p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ex: 100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Horas/dia</label>
            <input 
              type="number" 
              value={newAppliance.hoursPerDay || ''}
              onChange={e => setNewAppliance({...newAppliance, hoursPerDay: Number(e.target.value)})}
              className="w-full rounded-lg border-slate-300 border p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ex: 8"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Dias/mês</label>
            <input 
              type="number" 
              value={newAppliance.daysPerMonth || ''}
              onChange={e => setNewAppliance({...newAppliance, daysPerMonth: Number(e.target.value)})}
              className="w-full rounded-lg border-slate-300 border p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Ex: 30"
            />
          </div>
        </div>
        
        <button 
          onClick={handleAdd}
          disabled={!newAppliance.name || !newAppliance.power || !newAppliance.hoursPerDay}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar Aparelho
        </button>
      </div>

      {/* Appliance List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-sm text-slate-500">
              <th className="pb-3 font-medium">Aparelho</th>
              <th className="pb-3 font-medium">Qtd</th>
              <th className="pb-3 font-medium">Potência</th>
              <th className="pb-3 font-medium">Uso</th>
              <th className="pb-3 font-medium">Consumo Mensal</th>
              <th className="pb-3 font-medium text-right">Ação</th>
            </tr>
          </thead>
          <tbody>
            {appliances.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  Nenhum aparelho adicionado.
                </td>
              </tr>
            ) : (
              appliances.map(app => {
                const consumption = calculateConsumption(app);
                return (
                  <tr key={app.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-4 font-medium text-slate-800">{app.name}</td>
                    <td className="py-4 text-slate-600">{app.quantity}</td>
                    <td className="py-4 text-slate-600">{app.power} W</td>
                    <td className="py-4 text-slate-600">{app.hoursPerDay}h/dia × {app.daysPerMonth} dias</td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 text-indigo-700 font-semibold">
                        <Zap className="w-4 h-4" />
                        {consumption.toFixed(1)} kWh
                      </div>
                    </td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => handleRemove(app.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remover"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Compare Modal */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-600" />
                Comparador de Consumo
              </h3>
              <button 
                onClick={() => setIsCompareModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <p className="text-sm text-slate-500 mb-6">
                Selecione dois aparelhos abaixo para comparar o consumo mensal estimado (baseado no uso médio padrão).
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Aparelho A</label>
                  <select 
                    value={compareApp1}
                    onChange={(e) => setCompareApp1(e.target.value)}
                    className="w-full rounded-xl border-slate-300 border py-2.5 px-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                  >
                    {COMMON_APPLIANCES.map(app => (
                      <option key={`a1-${app.name}`} value={app.name}>{app.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Aparelho B</label>
                  <select 
                    value={compareApp2}
                    onChange={(e) => setCompareApp2(e.target.value)}
                    className="w-full rounded-xl border-slate-300 border py-2.5 px-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-50"
                  >
                    {COMMON_APPLIANCES.map(app => (
                      <option key={`a2-${app.name}`} value={app.name}>{app.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {(() => {
                const app1 = COMMON_APPLIANCES.find(a => a.name === compareApp1) || COMMON_APPLIANCES[0];
                const app2 = COMMON_APPLIANCES.find(a => a.name === compareApp2) || COMMON_APPLIANCES[1];
                
                const cons1 = (app1.power * app1.hoursPerDay * app1.daysPerMonth) / 1000;
                const cons2 = (app2.power * app2.hoursPerDay * app2.daysPerMonth) / 1000;
                
                const maxCons = Math.max(cons1, cons2) || 1;
                const pct1 = (cons1 / maxCons) * 100;
                const pct2 = (cons2 / maxCons) * 100;

                const diff = Math.abs(cons1 - cons2);
                const moreApp = cons1 > cons2 ? app1.name : app2.name;
                const lessApp = cons1 > cons2 ? app2.name : app1.name;
                const timesMore = cons1 > cons2 ? (cons1 / (cons2 || 1)) : (cons2 / (cons1 || 1));

                return (
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
                    <div className="space-y-6">
                      {/* Bar 1 */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-slate-700">{app1.name}</span>
                          <span className="font-bold text-indigo-600">{cons1.toFixed(1)} kWh/mês</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-indigo-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${pct1}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {app1.power}W • {app1.hoursPerDay}h/dia • {app1.daysPerMonth} dias/mês
                        </p>
                      </div>

                      {/* Bar 2 */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium text-slate-700">{app2.name}</span>
                          <span className="font-bold text-emerald-600">{cons2.toFixed(1)} kWh/mês</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                          <div 
                            className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${pct2}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {app2.power}W • {app2.hoursPerDay}h/dia • {app2.daysPerMonth} dias/mês
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 p-4 bg-indigo-50 text-indigo-800 rounded-lg text-sm">
                      {cons1 === cons2 ? (
                        <p>Ambos os aparelhos possuem o mesmo consumo mensal estimado.</p>
                      ) : (
                        <p>
                          O aparelho <strong>{moreApp}</strong> consome cerca de <strong>{timesMore.toFixed(1)}x mais</strong> energia que o aparelho <strong>{lessApp}</strong>, resultando em uma diferença de <strong>{diff.toFixed(1)} kWh</strong> por mês.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })()}
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="px-6 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
