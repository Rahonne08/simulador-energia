import React, { useState } from 'react';
import { Plus, Trash2, Zap, Scale, X, CheckCircle2, TrendingUp, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
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
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
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
        <div className="flex items-center gap-2">
          {appliances.length > 0 && (
            <button
              onClick={() => setIsClearModalOpen(true)}
              className="flex items-center gap-2 bg-rose-50 hover:bg-rose-100 text-rose-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Limpar Tudo
            </button>
          )}
          <button
            onClick={() => setIsCompareModalOpen(true)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <Scale className="w-4 h-4" />
            Comparar Aparelhos
          </button>
        </div>
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
        
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          disabled={!newAppliance.name || !newAppliance.power || !newAppliance.hoursPerDay}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar Aparelho
        </motion.button>
      </div>

      {/* Appliance List - Desktop Table / Mobile Cards */}
      <div className="mt-4">
        {/* Desktop Table Header - Hidden on Mobile */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-500">
                <th className="pb-3 font-medium">Aparelho</th>
                <th className="pb-3 font-medium">Qtd</th>
                <th className="pb-3 font-medium">Potência</th>
                <th className="pb-3 font-medium">Uso</th>
                <th className="pb-3 font-medium">Consumo Diário</th>
                <th className="pb-3 font-medium">Consumo Mensal</th>
                <th className="pb-3 font-medium text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {appliances.length === 0 ? (
                  <motion.tr
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td colSpan={7} className="py-8 text-center text-slate-500">
                      Nenhum aparelho adicionado.
                    </td>
                  </motion.tr>
                ) : (
                  appliances.map(app => {
                    const monthlyConsumption = calculateConsumption(app);
                    const dailyConsumption = (app.power * app.hoursPerDay * app.quantity) / 1000;
                    
                    return (
                      <motion.tr 
                        key={app.id} 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 font-medium text-slate-800">{app.name}</td>
                        <td className="py-4 text-slate-600">{app.quantity}</td>
                        <td className="py-4 text-slate-600">{app.power} W</td>
                        <td className="py-4 text-slate-600">{app.hoursPerDay}h/dia × {app.daysPerMonth} dias</td>
                        <td className="py-4 text-slate-600">
                          {dailyConsumption.toFixed(2)} kWh
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-1.5 text-indigo-700 font-semibold">
                            <Zap className="w-4 h-4" />
                            {monthlyConsumption.toFixed(1)} kWh
                          </div>
                        </td>
                        <td className="py-4 text-right">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRemove(app.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remover"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Mobile Cards - Hidden on Desktop */}
        <div className="md:hidden space-y-4">
          <AnimatePresence mode="popLayout">
            {appliances.length === 0 ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-8 text-center text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-300"
              >
                Nenhum aparelho adicionado.
              </motion.div>
            ) : (
              appliances.map(app => {
                const monthlyConsumption = calculateConsumption(app);
                const dailyConsumption = (app.power * app.hoursPerDay * app.quantity) / 1000;
                
                return (
                  <motion.div 
                    key={app.id} 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative"
                  >
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemove(app.id)}
                      className="absolute top-3 right-3 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                    
                    <h4 className="font-bold text-slate-800 mb-3 pr-8">{app.name}</h4>
                    
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                      <div>
                        <p className="text-slate-500 text-xs uppercase font-semibold tracking-wider mb-0.5">Qtd / Potência</p>
                        <p className="text-slate-700 font-medium">{app.quantity}x • {app.power}W</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs uppercase font-semibold tracking-wider mb-0.5">Uso</p>
                        <p className="text-slate-700 font-medium">{app.hoursPerDay}h/dia • {app.daysPerMonth}d</p>
                      </div>
                      <div>
                        <p className="text-slate-500 text-xs uppercase font-semibold tracking-wider mb-0.5">Consumo Diário</p>
                        <p className="text-slate-700 font-medium">{dailyConsumption.toFixed(2)} kWh</p>
                      </div>
                      <div>
                        <p className="text-indigo-600 text-xs uppercase font-bold tracking-wider mb-0.5">Consumo Mensal</p>
                        <p className="text-indigo-700 font-bold flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {monthlyConsumption.toFixed(1)} kWh
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Compare Modal */}
      <AnimatePresence>
        {isCompareModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
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

                const isApp1Efficient = cons1 < cons2;
                const isApp2Efficient = cons2 < cons1;
                const isEqual = cons1 === cons2;

                const getStyles = (isEfficient: boolean, isEq: boolean) => {
                  if (isEq) return { bar: 'bg-indigo-500', text: 'text-indigo-600', bg: 'bg-indigo-50/50', border: 'border-indigo-100' };
                  return isEfficient 
                    ? { bar: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-200' }
                    : { bar: 'bg-rose-500', text: 'text-rose-600', bg: 'bg-rose-50/50', border: 'border-rose-200' };
                };

                const style1 = getStyles(isApp1Efficient, isEqual);
                const style2 = getStyles(isApp2Efficient, isEqual);

                return (
                  <div className="bg-white rounded-xl">
                    <div className="space-y-4">
                      {/* Bar 1 */}
                      <div className={`p-4 rounded-xl border ${style1.border} ${style1.bg} transition-colors`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-slate-800">{app1.name}</span>
                              {isApp1Efficient && <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full"><CheckCircle2 className="w-3 h-3" /> Mais Eficiente</span>}
                              {!isApp1Efficient && !isEqual && <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full"><TrendingUp className="w-3 h-3" /> Maior Consumo</span>}
                            </div>
                            <p className="text-xs text-slate-500">
                              {app1.power}W • {app1.hoursPerDay}h/dia • {app1.daysPerMonth} dias/mês
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`font-bold text-xl ${style1.text}`}>{cons1.toFixed(1)}</span>
                            <span className={`text-xs font-medium block opacity-80 ${style1.text}`}>kWh/mês</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-200/70 rounded-full h-3 overflow-hidden border border-slate-200/50">
                          <div 
                            className={`${style1.bar} h-3 rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${pct1}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Bar 2 */}
                      <div className={`p-4 rounded-xl border ${style2.border} ${style2.bg} transition-colors`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-slate-800">{app2.name}</span>
                              {isApp2Efficient && <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full"><CheckCircle2 className="w-3 h-3" /> Mais Eficiente</span>}
                              {!isApp2Efficient && !isEqual && <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full"><TrendingUp className="w-3 h-3" /> Maior Consumo</span>}
                            </div>
                            <p className="text-xs text-slate-500">
                              {app2.power}W • {app2.hoursPerDay}h/dia • {app2.daysPerMonth} dias/mês
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`font-bold text-xl ${style2.text}`}>{cons2.toFixed(1)}</span>
                            <span className={`text-xs font-medium block opacity-80 ${style2.text}`}>kWh/mês</span>
                          </div>
                        </div>
                        <div className="w-full bg-slate-200/70 rounded-full h-3 overflow-hidden border border-slate-200/50">
                          <div 
                            className={`${style2.bar} h-3 rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${pct2}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                      <div className="p-1.5 bg-white rounded-full shadow-sm border border-slate-200 shrink-0 mt-0.5">
                        <Info className="w-4 h-4 text-indigo-500" />
                      </div>
                      <div className="text-sm text-slate-700 leading-relaxed">
                        {isEqual ? (
                          <p>Ambos os aparelhos possuem o mesmo consumo mensal estimado de <strong>{cons1.toFixed(1)} kWh</strong>.</p>
                        ) : (
                          <p>
                            O <strong>{moreApp}</strong> consome cerca de <strong className="text-rose-600">{timesMore.toFixed(1)}x mais</strong> energia que o <strong>{lessApp}</strong>, resultando em uma diferença de <strong className="text-indigo-600">{diff.toFixed(1)} kWh</strong> por mês.
                          </p>
                        )}
                      </div>
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
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Clear All Modal */}
      <AnimatePresence>
        {isClearModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col"
            >
              <div className="p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-2">Limpar todos os aparelhos?</h3>
              <p className="text-slate-600">Tem certeza que deseja remover todos os aparelhos da sua lista? Esta ação não pode ser desfeita.</p>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                onClick={() => setIsClearModalOpen(false)}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setAppliances([]);
                  setIsClearModalOpen(false);
                }}
                className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm font-medium hover:bg-rose-700 transition-colors"
              >
                Sim, limpar tudo
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
