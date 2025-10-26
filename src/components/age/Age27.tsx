"use client";
import "@/components/scss/age27.scss";
import { getAgeSuffix } from "@/utils";
import { FlameParticle } from "@/utils/age27";
import Fireworks from "@fireworks-js/react";
import { useEffect, useRef, useState } from "react";

const MAX_PART_COUNT = 100;
const REIGNITE_RATE = 2;
// const MAX_PART_DOWNTIME = 15;
const ALPHA = 0.5;
const THRESHOLD = 0.015;

const Age27 = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const particlesRef = useRef<FlameParticle[]>([]);
  const meterRef = useRef<{
    volume: number;
    clipLevel: number;
    clipLag: number;
    averaging: number;
    clipCounter: number;
  } | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const particleCountRef = useRef(100);
  const [flameOut, setIsFlameOut] = useState(false);
  const lowpassRef = useRef(0);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");

  const drawFlameBase = (
    ctx: CanvasRenderingContext2D,
    cw: number,
    ch: number
  ) => {
    ctx.beginPath();
    ctx.arc(cw / 2, ch / 2, 14, Math.PI * 2, 0);
    ctx.fillStyle = "rgba(185, 125, 45, 0)";
    ctx.fill();
    ctx.closePath();
  };

  const isBlowing = (meter: { volume: number } | null) => {
    if (!meter) return false;
    lowpassRef.current =
      ALPHA * meter.volume + (1.0 - ALPHA) * lowpassRef.current;
    return lowpassRef.current > THRESHOLD;
  };

  useEffect(() => {
    const requestAudioAccess = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

        streamRef.current = stream;

        const audioContext = new (window.AudioContext || window.AudioContext)();
        const microphone = audioContext.createMediaStreamSource(stream);

        await audioContext.audioWorklet.addModule("/worklet.js");

        // store volume meter
        meterRef.current = {
          volume: 0,
          clipLevel: 0.98,
          clipLag: 750,
          averaging: 0.95,
          clipCounter: 0,
        };

        // create processor node
        const meterNode = new AudioWorkletNode(
          audioContext,
          "volume-processor"
        );

        meterNode.port.onmessage = (event) => {
          const volume = event.data.volume;
          // simple smoothing
          meterRef.current!.volume = Math.max(
            volume,
            meterRef.current!.volume * meterRef.current!.averaging
          );
        };

        // optional: filter to remove high-frequency noise
        const filter = audioContext.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 400;

        // connect chain
        microphone
          .connect(filter)
          .connect(meterNode)
          .connect(audioContext.destination);

        setIsListening(true);
      } catch (err) {
        setError("Microphone access denied");
        console.error(err);
      }
    };

    requestAudioAccess();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const cw = (canvas.width = 800);
    const ch = (canvas.height = 400);

    // Initialize particles
    particlesRef.current = [];
    for (let i = 0; i < MAX_PART_COUNT; i++) {
      particlesRef.current.push(new FlameParticle(cw / 2, ch / 2));
    }

    // Recovery interval
    const recoveryInterval = setInterval(() => {
      if (particleCountRef.current < MAX_PART_COUNT) {
        particleCountRef.current += REIGNITE_RATE;
      }
    }, 200);

    const animate = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, cw, ch);

      const blowing = isBlowing(meterRef.current);
      if (blowing) {
        const intensity = Math.min(meterRef.current!.volume * 200, 10); // scale volume to 0–10 range
        particleCountRef.current -= intensity;
      }

      // Detect flame-out / reignite
      if (!flameOut && particleCountRef.current <= 0) setIsFlameOut(true);
      if (flameOut && particleCountRef.current > 0) setIsFlameOut(false);

      // Update and draw particles
      for (
        let i = 0;
        i < particleCountRef.current && i < particlesRef.current.length;
        i++
      ) {
        const particle = particlesRef.current[i];
        if (!particle) continue;
        if (particle.curLife < 0) {
          particlesRef.current[i] = new FlameParticle(cw / 2, ch / 2);
        }
        particlesRef.current[i].update(ctx, cw, ch, meterRef.current, blowing);
      }
      // Draw base
      drawFlameBase(ctx, cw, ch);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      clearInterval(recoveryInterval);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full overflow-hidden">
      {!flameOut && (
        <>
          <h1 className="text-2xl lg:text-4xl font-bold font-mono text-center mt-10">
            Blow into the microphone!
          </h1>
          <h1 className="text-2xl lg:text-4xl font-bold font-mono text-center mt-10">
            Make a wish!🎉
          </h1>
        </>
      )}
      {flameOut && (
        <div className="p-2 space-y-10">
          <h1 className="text-2xl lg:text-4xl font-bold font-mono text-center mt-10">
            Happy {27 + getAgeSuffix(27)} Birthday Chris and Dina 🎉
          </h1>
          <div className="grid grid-cols-3 gap-2 lg:w-1/2 mx-auto align-middle justify-items-center">
            <img
              src="/cat-kiss.gif"
              alt="I love u"
              className="w-[150px] h-[150px]"
            />
            <img
              src="/shrek.gif"
              alt="I love u"
              className="w-[150px] h-[150px]"
            />
            <img
              src="/grumpy.gif"
              alt="I love u"
              className="w-[150px] h-[150px]"
            />
          </div>
        </div>
      )}

      {flameOut && <Fireworks />}

      <div className="absolute bottom-32 m-auto px-2 w-full space-y-3 flex flex-col items-center">
        <h2 className="text-lg font-mono font-bold">Play your song below</h2>
        <audio ref={audioRef} controls className="w-full">
          <source src="/hazy-bazy-yoyo.mp3" type="audio/mpeg" />
        </audio>
      </div>

      <div className="h-screen w-full flex items-center justify-center overflow-hidden -mb-20">
        <div className="cake">
          <div className="plate"></div>
          <div className="layer layer-bottom"></div>
          <div className="layer layer-middle"></div>
          <div className="layer layer-top"></div>
          <div className="icing"></div>
          <div className="drip drip1"></div>
          <div className="drip drip2"></div>
          <div className="drip drip3"></div>
          <div className="relative w-full h-full z-[100000]">
            <canvas
              ref={canvasRef}
              className="absolute left-1/2 top-[20%] -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px]"
              style={{ filter: "url('#blur') blur(1.5px)" }}
            />
          </div>
        </div>
      </div>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      {!isListening && !error && (
        <p className="text-gray-400 mb-4 text-sm">Waiting for microphone...</p>
      )}
    </div>
  );
};

export default Age27;
