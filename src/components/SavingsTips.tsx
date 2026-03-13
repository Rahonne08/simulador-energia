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

    // Sort appliances by consumption
    const sortedAppliances = [...appliances]
      .map(app => ({ ...app, consumption: calculateConsumption(app) }))
      .sort((a, b) => b.consumption - a.consumption);

    const top3 = sortedAppliances.slice(0, 3);

    // Generate tips based on top 3
    top3.forEach(app => {
      const name = app.name.toLowerCase();
      if (name.includes('chuveiro')) {
        generatedTips.push({
          title: `Atenção ao ${app.name}`,
          desc: 'O chuveiro elétrico é um dos maiores vilões. Reduzir o banho em 5 minutos por dia pode economizar muito no final do mês. Considere a posição "Verão" nos dias quentes.',
          type: 'warning'
        });
      } else if (name.includes('ar condicionado') || name.includes('ar-condicionado')) {
        generatedTips.push({
          title: `Ajuste o ${app.name}`,
          desc: 'Mantenha a temperatura em 23°C ou 24°C. Cada grau a menos aumenta o consumo em cerca de 8%. Limpe os filtros mensalmente.',
          type: 'warning'
        });
      } else if (name.includes('geladeira') || name.includes('freezer') || name.includes('refrigerador')) {
        generatedTips.push({
          title: `Uso eficiente: ${app.name}`,
          desc: 'Evite abrir a porta sem necessidade. Verifique as borrachas de vedação e não coloque alimentos quentes dentro.',
          type: 'info'
        });
      } else if (name.includes('tv') || name.includes('televisão')) {
        generatedTips.push({
          title: `Economia com a ${app.name}`,
          desc: 'Evite deixar a TV ligada quando não houver ninguém assistindo. Reduzir o brilho da tela também ajuda a poupar energia.',
          type: 'info'
        });
      } else if (name.includes('ferro')) {
        generatedTips.push({
          title: `Dica para o ${app.name}`,
          desc: 'Acumule a maior quantidade de roupas possível para passar tudo de uma vez. O aquecimento inicial do ferro consome muita energia.',
          type: 'warning'
        });
      } else if (name.includes('máquina de lavar') || name.includes('lavadora')) {
        generatedTips.push({
          title: `Otimize a ${app.name}`,
          desc: 'Lave o máximo de roupas possível de uma só vez, respeitando a capacidade da máquina. Use a dosagem correta de sabão para evitar enxágues extras.',
          type: 'info'
        });
      } else if (name.includes('incandescente') || name.includes('lâmpada')) {
        generatedTips.push({
          title: `Troque suas lâmpadas`,
          desc: 'Substituir lâmpadas antigas por LED pode reduzir o consumo de iluminação em até 80%.',
          type: 'success'
        });
      } else {
        // Generic tip for high-consuming appliance
        generatedTips.push({
          title: `Cuidado com: ${app.name}`,
          desc: `Este aparelho está entre os que mais consomem energia na sua casa (${app.consumption.toFixed(1)} kWh/mês). Avalie se é possível reduzir seu tempo de uso diário.`,
          type: 'warning'
        });
      }
    });

    // Deduplicate tips by title (in case of multiple similar appliances)
    const uniqueTips = generatedTips.filter((tip, index, self) =>
      index === self.findIndex((t) => t.title === tip.title)
    );

    // If we don't have enough tips or no appliances, add phantom load and general efficiency tips
    if (uniqueTips.length < 3 || appliances.length === 0) {
      if (!uniqueTips.some(t => t.title.includes('Standby') || t.title.includes('Fantasma'))) {
        uniqueTips.push({
          title: 'Cuidado com o Consumo Fantasma (Standby)',
          desc: 'Aparelhos na tomada (TVs, micro-ondas, computadores, carregadores) continuam consumindo energia mesmo desligados. Desligue-os da tomada quando não estiverem em uso.',
          type: 'info'
        });
      }
      if (!uniqueTips.some(t => t.title.includes('luz natural'))) {
        uniqueTips.push({
          title: 'Aproveite a luz natural',
          desc: 'Abra janelas e cortinas durante o dia para evitar acender lâmpadas desnecessariamente. Pinte as paredes internas com cores claras.',
          type: 'success'
        });
      }
      if (uniqueTips.length < 4 && !uniqueTips.some(t => t.title.includes('Eficiência'))) {
        uniqueTips.push({
          title: 'Atenção à Eficiência Energética',
          desc: 'Ao comprar novos eletrodomésticos, procure sempre pelo Selo Procel A, que indica os modelos mais eficientes e econômicos do mercado.',
          type: 'success'
        });
      }
    }

    return uniqueTips.slice(0, 4);
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
