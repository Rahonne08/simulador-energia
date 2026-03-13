import React, { useState } from 'react';
import { Plus, Trash2, Zap } from 'lucide-react';
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
        <h2 className="text-xl font-bold text-slate-800">Seus Aparelhos</h2>
        <span className="bg-indigo-100 text-indigo-700 py-1 px-3 rounded-full text-sm font-medium">
          {appliances.length} aparelhos
        </span>
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
    </div>
  );
}
