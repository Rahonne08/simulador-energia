import { useState } from 'react';
import { Users, ThermometerSun, Droplets, Zap, ChevronRight } from 'lucide-react';
import { formatCurrency, calculateBill } from '../utils';

export default function QuickEstimate() {
  const [people, setPeople] = useState(2);
  const [hasAC, setHasAC] = useState(false);
  const [hasElectricShower, setHasElectricShower] = useState(true);
  const [showResult, setShowResult] = useState(false);

  // Base calculation logic
  // Base per person (fridge, lights, tv, etc): ~40 kWh/person
  // AC: ~100 kWh per unit
  // Electric Shower: ~60 kWh per person
  const calculateEstimate = () => {
    let kwh = people * 40;
    if (hasAC) kwh += 120; // Assume 1 AC used moderately
    if (hasElectricShower) kwh += (people * 50); // 1 shower per person per day

    const bill = calculateBill(kwh, {
      tariff: 0.84318,
      flag: 'verde',
      isLowIncome: false,
      connectionType: 'monofasico',
      city: 'Codó' // Defaulting to Codó to include the new CIP table
    });
    
    return { kwh, estimatedBill: bill.total };
  };

  const { kwh, estimatedBill } = calculateEstimate();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
          <Zap className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Estimativa Inteligente</h2>
        <p className="text-slate-500">Responda 3 perguntas rápidas para ter uma ideia do seu consumo mensal.</p>
      </div>

      <div className="space-y-6">
        {/* Question 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Quantas pessoas moram na casa?</h3>
              <p className="text-sm text-slate-500">Impacta no uso de chuveiro, luzes e eletrônicos.</p>
            </div>
          </div>
          <div className="flex items-center gap-4 pl-16">
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={people} 
              onChange={(e) => { setPeople(Number(e.target.value)); setShowResult(false); }}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <span className="font-bold text-xl text-indigo-600 w-8 text-center">{people}</span>
          </div>
        </div>

        {/* Question 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl">
                <ThermometerSun className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Vocês usam Ar Condicionado?</h3>
                <p className="text-sm text-slate-500">Um dos aparelhos que mais consome energia.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={hasAC}
                onChange={(e) => { setHasAC(e.target.checked); setShowResult(false); }}
              />
              <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        {/* Question 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Droplets className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Possuem Chuveiro Elétrico?</h3>
                <p className="text-sm text-slate-500">O maior vilão da conta de luz na maioria das casas.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={hasElectricShower}
                onChange={(e) => { setHasElectricShower(e.target.checked); setShowResult(false); }}
              />
              <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        {!showResult ? (
          <button 
            onClick={() => setShowResult(true)}
            className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-lg"
          >
            Gerar Estimativa
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <div className="mt-8 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-xl text-center transform transition-all animate-in fade-in slide-in-from-bottom-4">
            <h3 className="text-indigo-200 font-medium mb-2">Sua Conta Estimada</h3>
            <div className="text-5xl font-bold tracking-tight mb-6">
              {formatCurrency(estimatedBill)}
            </div>
            
            <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium">
              <Zap className="w-4 h-4 text-yellow-300" />
              Consumo aprox. de {kwh} kWh/mês
            </div>
            
            <p className="text-xs text-indigo-200 mt-6 opacity-80">
              * Cálculo baseado em médias nacionais (R$ 0,84/kWh). Para um valor exato, use o Simulador Completo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
