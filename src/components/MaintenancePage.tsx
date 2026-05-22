import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert } from 'lucide-react';

interface MaintenancePageProps {
  onDisable?: () => void;
}

export default function MaintenancePage({ onDisable }: MaintenancePageProps) {
  const [duckX, setDuckX] = useState(-100);
  const [duckY, setDuckY] = useState(0);
  const [isFacingRight, setIsFacingRight] = useState(true);
  const [quack, setQuack] = useState<{ x: number; y: number; text: string; id: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animação de caminhada do pato: atualizando coordenadas
  useEffect(() => {
    let speed = 2.2;
    let x = -80;
    let direction = 1;
    let frameId: number;

    // Coloca a altura do pato na metade inferior da tela de forma responsiva
    const initialY = window.innerHeight * 0.65;
    setDuckY(initialY);

    const updatePosition = () => {
      const width = window.innerWidth;
      x += speed * direction;

      // Se bater no lado direito, vira e volta
      if (x > width + 50 && direction === 1) {
        direction = -1;
        setIsFacingRight(false);
      }
      // Se bater no lado esquerdo, vira e vai para a direita
      else if (x < -120 && direction === -1) {
        direction = 1;
        setIsFacingRight(true);
      }

      setDuckX(x);
      frameId = requestAnimationFrame(updatePosition);
    };

    frameId = requestAnimationFrame(updatePosition);

    const handleResize = () => {
      setDuckY(window.innerHeight * 0.65);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Sons de Quack divertidos ao interagir
  const quacks = ['Quack!', 'Quack quack!', 'QUACK! 🦆', 'Quack? ⚡', 'Quaaack!'];

  const handleDuckClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const randomQuack = quacks[Math.floor(Math.random() * quacks.length)];
    setQuack({
      x: duckX + 40,
      y: duckY - 30,
      text: randomQuack,
      id: Date.now()
    });
  };

  useEffect(() => {
    if (quack) {
      const timer = setTimeout(() => {
        setQuack(null);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [quack]);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen bg-[#070a13] text-[#f8fafc] flex flex-col items-center justify-between overflow-hidden px-4 py-8 font-sans selection:bg-indigo-500 selection:text-white"
    >
      {/* Background elegante com atmosfera de energia */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-indigo-500/10 to-transparent rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Header simples sem o link de preview */}
      <header className="relative z-10 w-full max-w-7xl flex justify-between items-center px-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/30">
            <span className="text-yellow-400 font-bold">⚡</span>
          </div>
          <span className="font-bold text-base text-slate-400 tracking-tight">
            EnerControl
          </span>
        </div>
      </header>

      {/* Conteúdo Central Exclusivamente com a mensagem solicitada */}
      <main className="relative z-10 w-full max-w-3xl flex flex-col items-center justify-center text-center my-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="flex flex-col items-center"
        >
          {/* Alerta minimalista */}
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-2xl mb-8 animate-pulse">
            <ShieldAlert className="w-8 h-8 text-red-400" />
          </div>

          {/* Título Principal estrito, conforme solicitado */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent px-4">
            site retirado do ar!
          </h1>
          
          <p className="mt-4 text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            Nossos servidores corporativos entraram em hibernação temporária para melhorias de infraestrutura.
          </p>
        </motion.div>
      </main>

      {/* O Pato passeando pela tela */}
      <div
        className="absolute z-20 cursor-pointer select-none transition-transform duration-100"
        style={{
          left: `${duckX}px`,
          top: `${duckY}px`,
          transform: isFacingRight ? 'scaleX(1)' : 'scaleX(-1)'
        }}
        onClick={handleDuckClick}
      >
        {/* Renderização do Pato com CSS Waddling (rebolado) animado */}
        <div className="animate-waddle text-center">
          <svg viewBox="0 0 100 100" className="w-[84px] h-[84px] drop-shadow-[0_4px_12px_rgba(251,191,36,0.35)]">
            {/* Patas traseiras/dianteiras com rotação simulada de caminhada */}
            <g className="animate-pata-esquerdaOrigin">
              <path d="M 42 70 Q 42 86 34 84" stroke="#f97316" strokeWidth="6.5" strokeLinecap="round" fill="none" />
              <path d="M 34 84 L 28 84" stroke="#f97316" strokeWidth="5" strokeLinecap="round" />
            </g>
            <g className="animate-pata-direitaOrigin">
              <path d="M 58 70 Q 58 86 64 84" stroke="#f97316" strokeWidth="6.5" strokeLinecap="round" fill="none" />
              <path d="M 64 84 L 70 84" stroke="#f97316" strokeWidth="5" strokeLinecap="round" />
            </g>

            {/* Corpo robusto e rechonchudo d'água */}
            <ellipse cx="50" cy="52" rx="30" ry="22" fill="#fbbf24" />

            {/* Asa graciosa */}
            <path d="M 32 50 Q 46 38 52 50 Q 44 62 32 50" fill="#f59e0b" className="origin-center animate-asa" />

            {/* Pescoço robusto & Cabeça redonda */}
            <path d="M 64 48 Q 78 40 73 24" stroke="#fbbf24" strokeWidth="18" strokeLinecap="round" fill="none" />
            <circle cx="70" cy="22" r="15" fill="#fbbf24" />

            {/* Olho fofo do Patinho */}
            <circle cx="74" cy="18" r="3.5" fill="#0f172a" />
            <circle cx="75" cy="17" r="1" fill="#ffffff" /> {/* brilho nos olhos */}

            {/* Bico de pato macio */}
            <path d="M 83 17 Q 95 21 84 27 Z" fill="#f97316" />
          </svg>
        </div>
      </div>

      {/* Balão de quack animado em cima do Pato */}
      <AnimatePresence>
        {quack && (
          <motion.div
            key={quack.id}
            initial={{ opacity: 0, scale: 0.6, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute z-30 bg-indigo-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-lg border border-indigo-400/30 whitespace-nowrap"
            style={{
              left: `${quack.x}px`,
              top: `${quack.y}px`
            }}
          >
            {quack.text}
            {/* Setinha apontando p/ pato */}
            <div className="absolute top-full left-4 w-2 h-2 bg-indigo-600 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer simples e minimalista */}
      <footer className="relative z-10 w-full text-center text-xs text-slate-700 pb-2">
        <p>© {new Date().getFullYear()} EnerControl — Todos os direitos reservados</p>
      </footer>

      {/* Estilos para animações de waddle, patas e asas */}
      <style>{`
        @keyframes waddle {
          0%, 100% { transform: rotate(-5deg) translateY(0px); }
          50% { transform: rotate(5deg) translateY(-4px); }
        }
        @keyframes pataEsquerda {
          0%, 100% { transform: rotate(-15deg); }
          50% { transform: rotate(20deg); }
        }
        @keyframes pataDireita {
          0%, 100% { transform: rotate(20deg); }
          50% { transform: rotate(-15deg); }
        }
        @keyframes asaMoving {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-8deg); }
        }
        .animate-waddle {
          animation: waddle 0.6s infinite ease-in-out;
        }
        .animate-pata-esquerdaOrigin {
          animation: pataEsquerda 0.6s infinite ease-in-out;
          transform-origin: 42px 70px;
        }
        .animate-pata-direitaOrigin {
          animation: pataDireita 0.6s infinite ease-in-out;
          transform-origin: 58px 70px;
        }
        .animate-asa {
          animation: asaMoving 0.4s infinite ease-in-out;
          transform-origin: 32px 50px;
        }
      `}</style>
    </div>
  );
}
