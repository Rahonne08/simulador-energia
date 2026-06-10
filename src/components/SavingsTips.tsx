import { useMemo } from 'react';
import { Appliance } from '../types';
import { Lightbulb, Info, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { generateSavingsTips } from '../utils/tips';

interface Props {
  appliances: Appliance[];
}

export default function SavingsTips({ appliances }: Props) {
  const tips = useMemo(() => generateSavingsTips(appliances), [appliances]);

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
        className="mt-10 bg-gradient-to-br from-br-blue to-[#001c54] rounded-2xl p-8 text-white relative overflow-hidden shadow-xl"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-br-green opacity-30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-br-green via-br-yellow to-br-blue"></div>
        <h3 className="text-xl font-bold mb-4 relative z-10 text-br-yellow flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          Simulação de Troca de Aparelhos
        </h3>
        <p className="text-slate-300 mb-6 max-w-2xl relative z-10">
          Veja o impacto financeiro de trocar aparelhos antigos por versões mais eficientes (Selo Procel A).
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between backdrop-blur-sm"
          >
            <div>
              <p className="text-sm text-slate-300">Chuveiro Elétrico</p>
              <p className="font-semibold text-white">5500W</p>
            </div>
            <ArrowRight className="w-5 h-5 text-white/40 mx-2" />
            <div className="text-right">
              <p className="text-sm font-bold text-br-green">Aquecedor Solar</p>
              <p className="font-semibold text-br-yellow">-80% consumo</p>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-white/5 p-4 rounded-xl border border-white/10 flex items-center justify-between backdrop-blur-sm"
          >
            <div>
              <p className="text-sm text-slate-300">Lâmpada Comum</p>
              <p className="font-semibold text-white">60W</p>
            </div>
            <ArrowRight className="w-5 h-5 text-white/40 mx-2" />
            <div className="text-right">
              <p className="text-sm font-bold text-br-green">Lâmpada LED</p>
              <p className="font-semibold text-br-yellow">9W (-85%)</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
