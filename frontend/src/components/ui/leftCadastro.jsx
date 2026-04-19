"use client";

import dynamic from "next/dynamic";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false },
);

export default function LeftCards() {
  return (
<div className="relative w-full lg:w-[100%] max-w-[1100px] h-screen max-h-screen ml-0 flex items-center justify-center">
      <div className="absolute w-[90%] h-full bg-[#00357a] rounded-r-3xl -top-15 -left-8 z-0" />

      {/* Front card */}
      <div className="absolute w-[90%] h-[95%] bg-[#004aad] rounded-r-3xl -top- z-10 overflow-hidden  items-end justify-end relative">
        <Player
          autoplay
          loop ={false}
          speed={0.5}
          src="animations/analytics.json"
          className="absolute inset-0 w-full h-full opacity-90"
          style={{
            filter: "grayscale(1) brightness(1.2)",
          }}
           keepLastFrame
        />
      </div>
    </div>
  );
}
