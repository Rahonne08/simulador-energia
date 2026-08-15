import { useMemo } from 'react';
import { Appliance } from '../types';
import { Lightbulb, Info, AlertCircle, ArrowRight, Zap, Sparkles } from 'lucide-react';
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
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="p-6 sm:p-8 text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-950/60 rounded-xl border border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Lightbulb className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Otimização Energética & Diretrizes
            </h2>
            <p className="text-xs font-mono text-slate-400">Recomendações técnicas para redução de perdas e mitigação de consumo</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-cyan-950/40 px-3.5 py-1.5 rounded-full border border-cyan-500/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ALGORITMO DE EFICIÊNCIA</span>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {tips.map((tip, index) => {
          const isWarning = tip.type === 'warning';
          const isSuccess = tip.type === 'success';

          return (
            <motion.div 
              key={index}
              variants={itemVariants}
              className={`p-6 rounded-3xl border transition-all ${
                isWarning 
                  ? 'bg-[#150d0a]/90 border-amber-500/30 hover:border-amber-500/60' 
                  : isSuccess 
                  ? 'bg-[#081812]/90 border-emerald-500/30 hover:border-emerald-500/60' 
                  : 'bg-[#0b111e]/90 border-cyan-500/30 hover:border-cyan-500/60'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl border shrink-0 ${
                  isWarning 
                    ? 'bg-amber-950/80 border-amber-500/40 text-amber-400' 
                    : isSuccess 
                    ? 'bg-emerald-950/80 border-emerald-500/40 text-emerald-400' 
                    : 'bg-cyan-950/80 border-cyan-500/40 text-cyan-400'
                }`}>
                  {isWarning ? <AlertCircle className="w-5 h-5" /> :
                   isSuccess ? <Lightbulb className="w-5 h-5" /> :
                   <Info className="w-5 h-5" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                      isWarning ? 'bg-amber-950/60 border-amber-500/30 text-amber-300' :
                      isSuccess ? 'bg-emerald-950/60 border-emerald-500/30 text-emerald-300' :
                      'bg-cyan-950/60 border-cyan-500/30 text-cyan-300'
                    }`}>
                      {tip.type.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-base mb-2 font-sans">{tip.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">{tip.desc}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-10 bg-gradient-to-b from-[#0e172a] to-[#070b13] rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden border border-cyan-500/30 shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <h3 className="text-lg font-bold mb-2 relative z-10 text-cyan-400 flex items-center gap-2 font-mono">
          <Zap className="w-5 h-5 text-cyan-400" />
          SIMULAÇÃO DE RETROFIT & EFICIÊNCIA ENERGÉTICA
        </h3>
        <p className="text-xs font-mono text-slate-400 mb-6 max-w-2xl relative z-10">
          Impacto imediato da substituição de equipamentos obsoletos por tecnologia de alta eficiência (Selo Procel A / Inverter).
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10 font-mono">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-[#070b13] p-4 rounded-2xl border border-slate-800 flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-slate-400">Chuveiro Elétrico Comum</p>
              <p className="font-bold text-white text-base">5500 W</p>
            </div>
            <ArrowRight className="w-5 h-5 text-cyan-400 mx-2 shrink-0" />
            <div className="text-right">
              <p className="text-xs font-bold text-emerald-400">Aquecedor Solar / Híbrido</p>
              <p className="font-bold text-cyan-300 text-sm">-80% consumo</p>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-[#070b13] p-4 rounded-2xl border border-slate-800 flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-slate-400">Lâmpada Incandescente</p>
              <p className="font-bold text-white text-base">60 W</p>
            </div>
            <ArrowRight className="w-5 h-5 text-cyan-400 mx-2 shrink-0" />
            <div className="text-right">
              <p className="text-xs font-bold text-emerald-400">Lâmpada LED Filamento</p>
              <p className="font-bold text-cyan-300 text-sm">9 W (-85%)</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

