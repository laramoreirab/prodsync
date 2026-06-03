"use client";

import dynamic from "next/dynamic";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false },
);

export default function LeftCards() {
  return (
    <div className="relative w-full h-full flex items-center justify-end">

      {/* Back card */}
      <div className="absolute w-[80%] h-[85%] bg-[#00357a] rounded-3xl -translate-x-6 -translate-y-6 z-0 overflow-hidden shadow-lg">

      </div>

      {/* Front card */}
      <div className="relative w-[85%] h-[80%] bg-[var(--azul-cobalto)] rounded-3xl z-10 overflow-hidden flex items-center justify-center shadow-2xl border border-white/10">

        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* Player Lottie */}
        {/* <div className="relative z-20 w-full h-full">
          <iframe
            src="/animations/prodsync.html"
            className="w-full h-full border-0"
          />
        </div> */}

        <div className="relative z-20 w-full h-full flex items-center justify-center">
            <Player
              autoplay
              loop={false}
              speed={0.5}
              src="animations/analytics.json"
              className="w-full h-full" 
              style={{
                filter: "grayscale(1) brightness(1.2)",
              }}
              keepLastFrame
            />
        </div>

        {/* Gradiente */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent pointer-events-none" />
      </div>
    </div>
  );
}