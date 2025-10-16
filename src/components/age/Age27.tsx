"use client";
import "@/components/scss/age27.scss";
import { FlameParticle } from "@/utils/age27";
import { useEffect, useRef, useState } from "react";

const MAX_PART_COUNT = 100;
const REIGNITE_RATE = 2;
const MAX_PART_DOWNTIME = 15;
const ALPHA = 0.5;
const THRESHOLD = 0.09;

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
  const streamRef = useRef<MediaStream | null>(null);
  const particleCountRef = useRef(100);
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
    ctx.fillStyle = "rgba(185, 125, 45, 0.1)";
    ctx.fill();
    ctx.closePath();
  };

  const isBlowing = (meter: { volume: number } | null) => {
    if (!meter) return false;
    lowpassRef.current =
      ALPHA * meter.volume + (1.0 - ALPHA) * lowpassRef.current;
    return lowpassRef.current > THRESHOLD;
  };

  const createAudioMeter = (audioContext: AudioContext) => {
    const meter = {
      volume: 0,
      clipLevel: 0.98,
      clipLag: 750,
      averaging: 0.95,
      clipCounter: 0,
    };

    const scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
    scriptProcessor.onaudioprocess = (event) => {
      const input = event.inputBuffer.getChannelData(0);
      let sum = 0.0;
      for (let i = 0; i < input.length; i++) {
        sum += input[i] * input[i];
      }
      const rms = Math.sqrt(sum / input.length);
      meter.volume = Math.max(rms, meter.volume * meter.averaging);
    };

    return { scriptProcessor, meter };
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

        const { scriptProcessor, meter } = createAudioMeter(audioContext);
        meterRef.current = meter;

        const filter = audioContext.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 400;

        microphone.connect(filter);
        filter.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);

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
        if (particleCountRef.current > -MAX_PART_DOWNTIME) {
          particleCountRef.current -= 1;
        }
      }

      // Update and draw particles
      for (let i = 0; i < particleCountRef.current; i++) {
        if (particlesRef.current[i].curLife < 0) {
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
    <>
      <div className="h-screen w-full flex items-center justify-center">
        <div className="cake">
          <div className="plate"></div>
          <div className="layer layer-bottom"></div>
          <div className="layer layer-middle"></div>
          <div className="layer layer-top"></div>
          <div className="icing"></div>
          <div className="drip drip1"></div>
          <div className="drip drip2"></div>
          <div className="drip drip3"></div>
          <div className="bg-white relative">
            <canvas
              ref={canvasRef}
              className="absolute left-0 top-0"
              style={{ filter: "url('#blur') blur(1.5px)" }}
            />
          </div>
        </div>
      </div>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      {!isListening && !error && (
        <p className="text-gray-400 mb-4 text-sm">Waiting for microphone...</p>
      )}
    </>
  );
};

export default Age27;
