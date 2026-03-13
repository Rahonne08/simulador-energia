import { useMemo } from 'react';
import { Appliance } from '../types';
import { calculateConsumption } from '../utils';
import { Lightbulb, Info, AlertCircle, ArrowRight } from 'lucide-react';

interface Props {
  appliances: Appliance[];
}

export default function SavingsTips({ appliances }: Props) {
  const tips = useMemo(() => {
    const generatedTips: { title: string; desc: string; type: 'warning' | 'info' | 'success' }[] = [];

    const shower = appliances.find(a => a.name.toLowerCase().includes('chuveiro'));
    if (shower && calculateConsumption(shower) > 50) {
      generatedTips.push({
        title: 'Reduza o tempo no banho',
        desc: 'O chuveiro elétrico é um dos maiores vilões. Reduzir o banho em 5 minutos por dia pode economizar muito no final do mês. Considere a posição "Verão" nos dias quentes.',
        type: 'warning'
      });
    }

    const ac = appliances.find(a => a.name.toLowerCase().includes('ar condicionado'));
    if (ac && calculateConsumption(ac) > 100) {
      generatedTips.push({
        title: 'Ajuste o Ar Condicionado',
        desc: 'Mantenha a temperatura em 23°C ou 24°C. Cada grau a menos aumenta o consumo em cerca de 8%. Limpe os filtros mensalmente.',
        type: 'warning'
      });
    }

    const fridge = appliances.find(a => a.name.toLowerCase().includes('geladeira'));
    if (fridge) {
      generatedTips.push({
        title: 'Uso eficiente da Geladeira',
        desc: 'Evite abrir a porta sem necessidade. Verifique as borrachas de vedação e não coloque alimentos quentes dentro.',
        type: 'info'
      });
    }

    const incand = appliances.find(a => a.name.toLowerCase().includes('incandescente'));
    if (incand) {
      generatedTips.push({
        title: 'Troque suas lâmpadas',
        desc: 'Substituir lâmpadas incandescentes por LED pode reduzir o consumo de iluminação em até 80%.',
        type: 'success'
      });
    }

    if (generatedTips.length === 0) {
      generatedTips.push({
        title: 'Desligue aparelhos em Standby',
        desc: 'Aparelhos na tomada (TVs, micro-ondas, computadores) continuam consumindo energia. Desligue-os quando não estiverem em uso.',
        type: 'info'
      });
      generatedTips.push({
        title: 'Aproveite a luz natural',
        desc: 'Abra janelas e cortinas durante o dia para evitar acender lâmpadas desnecessariamente.',
        type: 'success'
      });
    }

    return generatedTips;
  }, [appliances]);

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-8">
        <Lightbulb className="w-6 h-6 text-amber-500" />
        <h2 className="text-xl font-bold text-slate-800">Dicas de Economia Inteligentes</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tips.map((tip, index) => (
          <div 
            key={index}
            className={`p-6 rounded-2xl border ${
              tip.type === 'warning' ? 'bg-amber-50 border-amber-200' :
              tip.type === 'success' ? 'bg-emerald-50 border-emerald-200' :
              'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-full ${
                tip.type === 'warning' ? 'bg-amber-100 text-amber-600' :
                tip.type === 'success' ? 'bg-emerald-100 text-emerald-600' :
                'bg-blue-100 text-blue-600'
              }`}>
                {tip.type === 'warning' ? <AlertCircle className="w-5 h-5" /> :
                 tip.type === 'success' ? <Lightbulb className="w-5 h-5" /> :
                 <Info className="w-5 h-5" />}
              </div>
              <div>
                <h3 className={`font-semibold mb-2 ${
                  tip.type === 'warning' ? 'text-amber-900' :
                  tip.type === 'success' ? 'text-emerald-900' :
                  'text-blue-900'
                }`}>{tip.title}</h3>
                <p className={`text-sm leading-relaxed ${
                  tip.type === 'warning' ? 'text-amber-800' :
                  tip.type === 'success' ? 'text-emerald-800' :
                  'text-blue-800'
                }`}>{tip.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500 opacity-20 rounded-full blur-3xl"></div>
        <h3 className="text-xl font-bold mb-4 relative z-10">Simulação de Troca de Aparelhos</h3>
        <p className="text-slate-300 mb-6 max-w-2xl relative z-10">
          Veja o impacto financeiro de trocar aparelhos antigos por versões mais eficientes (Selo Procel A).
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Chuveiro Elétrico</p>
              <p className="font-semibold">5500W</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-500 mx-2" />
            <div className="text-right">
              <p className="text-sm text-emerald-400">Aquecedor Solar</p>
              <p className="font-semibold text-emerald-300">-80% consumo</p>
            </div>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Lâmpada Comum</p>
              <p className="font-semibold">60W</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-500 mx-2" />
            <div className="text-right">
              <p className="text-sm text-emerald-400">Lâmpada LED</p>
              <p className="font-semibold text-emerald-300">9W (-85%)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
