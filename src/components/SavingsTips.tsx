import { useMemo } from 'react';
import { Appliance } from '../types';
import { calculateConsumption } from '../utils';
import { Lightbulb, Info, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  appliances: Appliance[];
}

export default function SavingsTips({ appliances }: Props) {
  const tips = useMemo(() => {
    const generatedTips: { title: string; desc: string; type: 'warning' | 'info' | 'success' }[] = [];

    // Calculate total consumption for percentages
    const totalCons = appliances.reduce((acc, app) => acc + calculateConsumption(app), 0);

    // Sort appliances by consumption
    const sortedAppliances = [...appliances]
      .map(app => ({ ...app, consumption: calculateConsumption(app) }))
      .sort((a, b) => b.consumption - a.consumption)
      .filter(app => app.consumption > 0);

    // Generate tips based on the highest consuming appliances
    sortedAppliances.forEach(app => {
      const name = app.name.toLowerCase();
      const percent = totalCons > 0 ? ((app.consumption / totalCons) * 100).toFixed(1) : '0';
      const consText = `${app.consumption.toFixed(1)} kWh/mês (${percent}%)`;

      if (name.includes('chuveiro') || name.includes('ducha')) {
        generatedTips.push({
          title: `Atenção ao ${app.name}`,
          desc: `Representa ${consText} do seu consumo. Reduzir o banho em 5 minutos por dia e usar a posição "Verão" nos dias quentes pode gerar grande economia.`,
          type: 'warning'
        });
      } else if (name.includes('ar condicionado') || name.includes('ar-condicionado')) {
        generatedTips.push({
          title: `Ajuste o ${app.name}`,
          desc: `Consome ${consText}. Mantenha a temperatura em 23°C ou 24°C. Cada grau a menos aumenta o consumo em cerca de 8%. Limpe os filtros mensalmente.`,
          type: 'warning'
        });
      } else if (name.includes('geladeira') || name.includes('freezer') || name.includes('refrigerador')) {
        generatedTips.push({
          title: `Uso eficiente: ${app.name}`,
          desc: `Responsável por ${consText}. Evite abrir a porta sem necessidade, verifique as borrachas de vedação e nunca coloque alimentos quentes dentro.`,
          type: 'info'
        });
      } else if (name.includes('tv') || name.includes('televisão') || name.includes('televisor')) {
        generatedTips.push({
          title: `Economia com a ${app.name}`,
          desc: `Consome ${consText}. Evite deixar a TV ligada quando não houver ninguém assistindo. Reduzir o brilho da tela também ajuda a poupar energia.`,
          type: 'info'
        });
      } else if (name.includes('ferro')) {
        generatedTips.push({
          title: `Dica para o ${app.name}`,
          desc: `Consome ${consText}. Acumule a maior quantidade de roupas possível para passar tudo de uma vez. O aquecimento inicial do ferro consome muita energia.`,
          type: 'warning'
        });
      } else if (name.includes('máquina de lavar') || name.includes('lavadora')) {
        generatedTips.push({
          title: `Otimize a ${app.name}`,
          desc: `Representa ${consText}. Lave o máximo de roupas possível de uma só vez, respeitando a capacidade. Use a dosagem correta de sabão para evitar enxágues extras.`,
          type: 'info'
        });
      } else if (name.includes('secadora')) {
        generatedTips.push({
          title: `Economize com a ${app.name}`,
          desc: `Consome ${consText}. Secadoras são grandes consumidoras. Sempre que possível, utilize o varal e a luz solar para secar suas roupas.`,
          type: 'warning'
        });
      } else if (name.includes('incandescente') || name.includes('lâmpada') || name.includes('iluminação')) {
        generatedTips.push({
          title: `Troque suas lâmpadas`,
          desc: `A iluminação consome ${consText}. Substituir lâmpadas antigas por LED pode reduzir o consumo de iluminação em até 80%.`,
          type: 'success'
        });
      } else if (name.includes('micro-ondas') || name.includes('microondas')) {
        generatedTips.push({
          title: `Uso do ${app.name}`,
          desc: `Consome ${consText}. Desligue-o da tomada quando não estiver em uso para evitar o consumo em modo standby (relógio).`,
          type: 'info'
        });
      } else if (name.includes('computador') || name.includes('pc') || name.includes('notebook')) {
        generatedTips.push({
          title: `Gerencie o ${app.name}`,
          desc: `Responsável por ${consText}. Configure o sistema para desligar a tela após 5 minutos de inatividade e suspender após 15 minutos.`,
          type: 'info'
        });
      } else if (name.includes('ventilador')) {
        generatedTips.push({
          title: `Atenção ao ${app.name}`,
          desc: `Consome ${consText}. Desligue o aparelho sempre que sair do ambiente. Ventiladores refrescam pessoas, não ambientes fechados vazios.`,
          type: 'success'
        });
      } else if (name.includes('air fryer') || name.includes('fritadeira') || name.includes('forno')) {
        generatedTips.push({
          title: `Cuidado com o ${app.name}`,
          desc: `Aparelhos que geram calor consomem muita energia (${consText}). Evite abrir a gaveta/porta durante o preparo para não perder calor.`,
          type: 'warning'
        });
      } else if (name.includes('cooktop') || name.includes('fogão')) {
        generatedTips.push({
          title: `Dica para o ${app.name}`,
          desc: `Representa ${consText}. Utilize panelas com fundo plano que cubram toda a área da chapa e use a tampa para acelerar o cozimento.`,
          type: 'warning'
        });
      } else if (name.includes('bomba') || name.includes('motor')) {
        generatedTips.push({
          title: `Eficiência na ${app.name}`,
          desc: `Consome ${consText}. Verifique se não há vazamentos na tubulação que forçam o motor a trabalhar mais tempo desnecessariamente.`,
          type: 'info'
        });
      } else if (name.includes('lava-louças') || name.includes('lava louças')) {
        generatedTips.push({
          title: `Otimize a ${app.name}`,
          desc: `Consome ${consText}. Utilize-a apenas quando estiver com a carga completa e evite a função de secagem extra se possível.`,
          type: 'info'
        });
      } else if (name.includes('boiler') || name.includes('aquecedor')) {
        generatedTips.push({
          title: `Ajuste o ${app.name}`,
          desc: `Responsável por ${consText}. Mantenha o termostato entre 45°C e 50°C e verifique o isolamento térmico do reservatório.`,
          type: 'warning'
        });
      } else if (name.includes('videogame') || name.includes('console') || name.includes('playstation') || name.includes('xbox')) {
        generatedTips.push({
          title: `Uso do ${app.name}`,
          desc: `Consome ${consText}. Evite deixar o console ligado ou em modo de suspensão baixando jogos quando não estiver usando. Desligue-o completamente.`,
          type: 'info'
        });
      } else if (name.includes('cafeteira')) {
        generatedTips.push({
          title: `Dica para a ${app.name}`,
          desc: `Representa ${consText}. Se a sua cafeteira tiver base aquecedora, não a deixe ligada por muito tempo. É mais econômico armazenar o café em uma garrafa térmica.`,
          type: 'warning'
        });
      } else if (name.includes('secador') || name.includes('chapinha') || name.includes('prancha')) {
        generatedTips.push({
          title: `Atenção ao ${app.name}`,
          desc: `Aparelhos de aquecimento rápido consomem muita energia (${consText}). Seque bem o cabelo com a toalha antes de usar o secador para diminuir o tempo de uso.`,
          type: 'warning'
        });
      } else if (name.includes('aspirador')) {
        generatedTips.push({
          title: `Uso eficiente: ${app.name}`,
          desc: `Consome ${consText}. Limpe os filtros e o reservatório regularmente. Um aspirador com filtro sujo precisa fazer mais força e consome mais energia.`,
          type: 'info'
        });
      } else if (name.includes('purificador') || name.includes('bebedouro')) {
        generatedTips.push({
          title: `Ajuste o ${app.name}`,
          desc: `Responsável por ${consText}. Em dias mais frios, desligue a refrigeração do aparelho ou ajuste o termostato para o mínimo.`,
          type: 'success'
        });
      } else if (name.includes('roteador') || name.includes('modem')) {
        generatedTips.push({
          title: `Economia com o ${app.name}`,
          desc: `Apesar da baixa potência, fica ligado 24h, consumindo ${consText}. Se for viajar ou passar o fim de semana fora, desligue-o da tomada.`,
          type: 'info'
        });
      } else if (name.includes('sanduicheira') || name.includes('grill') || name.includes('torradeira')) {
        generatedTips.push({
          title: `Dica para a ${app.name}`,
          desc: `Consome ${consText}. Ligue o aparelho apenas quando o alimento já estiver pronto para ser colocado, evitando o tempo ocioso de aquecimento.`,
          type: 'warning'
        });
      } else if (name.includes('panela elétrica')) {
        generatedTips.push({
          title: `Uso da ${app.name}`,
          desc: `Representa ${consText}. Mantenha a tampa fechada durante o cozimento e aproveite o calor residual desligando um pouco antes do alimento ficar pronto.`,
          type: 'success'
        });
      } else if (name.includes('som') || name.includes('home theater')) {
        generatedTips.push({
          title: `Atenção ao ${app.name}`,
          desc: `Consome ${consText}. Aparelhos de áudio potentes consomem bastante energia. Desligue-os da tomada quando não estiverem em uso para evitar o consumo em standby.`,
          type: 'info'
        });
      } else {
        // Generic tip for high-consuming appliance
        if (app.consumption > 15) {
          generatedTips.push({
            title: `Alto consumo: ${app.name}`,
            desc: `Este aparelho consome ${consText}, o que é significativo. Avalie se é possível reduzir seu tempo de uso diário ou substituí-lo por um modelo mais eficiente.`,
            type: 'warning'
          });
        }
      }
    });

    // Deduplicate tips by title (in case of multiple similar appliances)
    const uniqueTips = generatedTips.filter((tip, index, self) =>
      index === self.findIndex((t) => t.title === tip.title)
    );

    // If we don't have enough tips or no appliances, add phantom load and general efficiency tips
    if (uniqueTips.length < 4 || appliances.length === 0) {
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
      if (uniqueTips.length < 4 && !uniqueTips.some(t => t.title.includes('Manutenção'))) {
        uniqueTips.push({
          title: 'Manutenção Preventiva',
          desc: 'Fiações antigas ou emendas mal feitas podem gerar fuga de corrente (desperdício de energia em forma de calor). Revise suas instalações elétricas a cada 5 anos.',
          type: 'warning'
        });
      }
    }

    return uniqueTips.slice(0, 6);
  }, [appliances]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-8">
        <Lightbulb className="w-6 h-6 text-amber-500" />
        <h2 className="text-xl font-bold text-slate-800">Dicas de Economia Inteligentes</h2>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {tips.map((tip, index) => (
          <motion.div 
            key={index}
            variants={itemVariants}
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
          </motion.div>
        ))}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-10 bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden border border-transparent"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-indigo-500 opacity-20 rounded-full blur-3xl"></div>
        <h3 className="text-xl font-bold mb-4 relative z-10">Simulação de Troca de Aparelhos</h3>
        <p className="text-slate-300 mb-6 max-w-2xl relative z-10">
          Veja o impacto financeiro de trocar aparelhos antigos por versões mais eficientes (Selo Procel A).
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-slate-400">Chuveiro Elétrico</p>
              <p className="font-semibold">5500W</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-500 mx-2" />
            <div className="text-right">
              <p className="text-sm text-emerald-400">Aquecedor Solar</p>
              <p className="font-semibold text-emerald-300">-80% consumo</p>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-slate-400">Lâmpada Comum</p>
              <p className="font-semibold">60W</p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-500 mx-2" />
            <div className="text-right">
              <p className="text-sm text-emerald-400">Lâmpada LED</p>
              <p className="font-semibold text-emerald-300">9W (-85%)</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
