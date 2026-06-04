"use client";

export default function LeftCards() {
  return (
    <div className="relative w-full h-full flex items-center justify-end p-8 overflow-hidden">
      
      <style>{`
        @keyframes geoScan {
          0% { transform: translateY(-20%); opacity: 0; }
          10%, 90% { opacity: 0.4; }
          100% { transform: translateY(120%); opacity: 0; }
        }
        @keyframes nodePulse {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.12); opacity: 0.8; }
        }
        @keyframes orbitCW {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Card de Fundo */}
      <div className="absolute w-[70%] h-[83%] bg-slate-950 border border-blue-950 rounded-2xl -translate-x-10 -translate-y-10 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_bottom,transparent_96%,#0044cc_96%)] bg-[size:100%_24px]" />
      </div>
      
      {/* Card Principal */}
      <div className="relative w-[65%] h-[86%] bg-[#001430] border border-blue-500/30 rounded-2xl z-10 overflow-hidden flex items-center justify-center shadow-[-25px_25px_50px_rgba(0,0,0,0.7)]">
        
        {/* Grid de Fundo */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(to right, #0066ff 1px, transparent 1px), linear-gradient(to bottom, #0066ff 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        {/* Espirais Brancas Regulares */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10 overflow-hidden">
          <div 
            className="w-[160%] h-[160%] rounded-full"
            style={{
              animation: 'orbitCW 60s linear infinite',
              background: 'repeating-radial-gradient(circle at center, transparent, transparent 10px, #fff 11px, #fff 13px, transparent 14px, transparent 24px), conic-gradient(from 0deg, transparent, rgba(255,255,255,0.2) 50%, transparent)',
              backgroundBlendMode: 'multiply'
            }}
          />
        </div>

        {/* Moldura e Conteúdo Interno */}
        <div className="relative z-10 w-[90%] h-[86%] border border-blue-500/10 bg-slate-950/30 flex items-center justify-center p-6 rounded-xl">
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-blue-400/70" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-blue-400/70" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-blue-400/70" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-blue-400/70" />

          <div className="relative w-full h-full max-w-[320px] max-h-[320px] flex items-center justify-center">

            {/* Gráficos HUD Circulares */}
            <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full opacity-60 pointer-events-none">
              <line x1="10" y1="100" x2="190" y2="100" stroke="#0033aa" strokeWidth="0.1" strokeDasharray="4 4" />
              <line x1="100" y1="10" x2="100" y2="190" stroke="#0033aa" strokeWidth="0.1" strokeDasharray="4 4" />
              
              <g style={{ transformOrigin: '100px 100px', animation: 'orbitCW 30s linear infinite' }}>
                <circle cx="100" cy="100" r="75" stroke="#0066ff" strokeWidth="0.1" strokeDasharray="6 6" opacity="0.4" />
                <rect x="97" y="22" width="6" height="6" fill="#0066ff" opacity="0.8" />
                <rect x="97" y="172" width="6" height="6" fill="#0066ff" opacity="0.8" />
              </g>

              <g style={{ transformOrigin: '100px 100px', animation: 'orbitCW 20s linear infinite reverse' }}>
                <polygon points="100,45 155,100 100,155 45,100" stroke="#0066ff" strokeWidth="0.1" fill="none" opacity="0.5" />
              </g>
            </svg>

            {/* Logo */}
            <div className="relative z-20 w-50 h-50 flex items-center justify-center select-none">
              <img 
                src="/logo.svg" 
                alt="Logo" 
                className="w-full h-full brightness-0 invert object-contain drop-shadow-[0_0_35px_rgba(0,240,255,0.5)]"
              />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}