"use client";
import { getAgeSuffix } from "@/utils";
import Fireworks from "@fireworks-js/react";
import { useRef, useState } from "react";
import "@/components/scss/age28.scss";

const AGE = 28;

const PHOTOS = [
  { id: 1, src: "/tounges.png", alt: "Memory 1" },
  { id: 2, src: "/chris_dina_1.jpeg", alt: "Memory 2" },
  { id: 3, src: "/glasses-cats.jpg", alt: "Memory 3" },
  { id: 3, src: "/chris_dina_2.jpeg", alt: "Memory 3" },
  { id: 3, src: "/kitties.jpg", alt: "Memory 3" },
  { id: 3, src: "/chris_dina_3.jpeg", alt: "Memory 3" },
];

// Marquee loops seamlessly by rendering the set twice and scrolling by -50%.
const MARQUEE_PHOTOS = [...PHOTOS, ...PHOTOS];

const FLOATING_GIFS = [
  { src: "/fighting.gif", className: "top-4 left-4 lg:top-10 lg:left-10" },
  { src: "/yippie.gif", className: "top-4 right-4 lg:top-10 lg:right-10" },
  {
    src: "/cat_candle.gif",
    className: "bottom-24 left-4 lg:bottom-16 lg:left-10",
  },
  {
    src: "/doggo_smile.gif",
    className: "bottom-24 right-4 lg:bottom-16 lg:right-10",
  },
];

const PhotoCard = ({ src, alt }: { src: string; alt: string }) => {
  const [failed, setFailed] = useState(false);

  return (
    <div className="age28-photo-card">
      {!failed ? (
        <img src={src} alt={alt} onError={() => setFailed(true)} />
      ) : (
        <div className="age28-photo-placeholder">
          <span>📸</span>
          <p>{alt}</p>
        </div>
      )}
    </div>
  );
};

const Age28 = () => {
  const [show, setShow] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const reveal = () => {
    setShow(true);
    audioRef.current?.play().catch(() => {});
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden flex flex-col items-center justify-center gap-6 sm:gap-8 py-10 px-4 text-center">
      {show &&
        FLOATING_GIFS.map((gif) => (
          <img
            key={gif.src}
            src={gif.src}
            alt=""
            className={`age28-floating-gif ${gif.className}`}
          />
        ))}

      {show && (
        <Fireworks className="fixed inset-0 h-full w-full pointer-events-none z-0" />
      )}

      {!show && (
        <button
          onClick={reveal}
          className="relative z-[1] rounded-full bg-gradient-to-br from-pink-400 via-rose-400 to-purple-500 px-8 py-5 text-base sm:text-xl font-bold font-mono text-white shadow-[0_0.5em_1em_-0.2em_rgba(150,50,60,0.5)] outline outline-[6px] outline-pink-300/40 transition active:translate-y-[2px] active:shadow-none"
        >
          Click for a surprise 🎂
        </button>
      )}

      {show && (
        <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8 w-full">
          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold font-mono">
            Happy {AGE + getAgeSuffix(AGE)} Birthday Chris and Dina 🎉
          </h1>

          <div className="age28-marquee-wrapper w-full max-w-4xl">
            <div className="age28-marquee-track">
              {MARQUEE_PHOTOS.map((photo, i) => (
                <PhotoCard
                  key={`${photo.id}-${i}`}
                  src={photo.src}
                  alt={photo.alt}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 w-full max-w-md px-2">
            <h2 className="text-base sm:text-lg font-mono font-bold">
              Play your song below
            </h2>
            <audio ref={audioRef} controls className="w-full">
              <source src="/hazy-bazy-yoyo.mp3" type="audio/mpeg" />
            </audio>
          </div>
        </div>
      )}
    </div>
  );
};

export default Age28;
