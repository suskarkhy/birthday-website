"use client";
import { useEffect, useRef, useState } from "react";
import "@/components/scss/age27.scss";

const MAX_PART_COUNT = 100;
const REIGNITE_RATE = 2;
const MAX_PART_DOWNTIME = 15;
const ALPHA = 0.5;
const THRESHOLD = 0.09;

const Age27 = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);
  const meterRef = useRef(null);
  const streamRef = useRef(null);
  const particleCountRef = useRef(100);
  const lowpassRef = useRef(0);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState("");

  const rand = (min, max) => min + Math.random() * (max - min);

  class FlameParticle {
    constructor(x, y) {
      this.radius = 15;
      this.speed = { x: rand(-0.5, 0.5), y: 2.5 };
      this.life = rand(50, 100);
      this.alpha = 0.5;
      this.x = x;
      this.y = y;
      this.curAlpha = this.alpha;
      this.curLife = this.life;
    }

    update(ctx, cw, ch, meter, isBlowing) {
      if (this.curLife <= 90) {
        this.radius -= Math.min(this.radius, 0.25);
        this.curAlpha -= 0.005;
      }

      if (meter && isBlowing) {
        this.x += rand(-meter.volume, meter.volume) * 50;
      }

      this.curLife -= this.speed.y;
      this.y -= this.speed.y;
      this.draw(ctx);
    }

    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, Math.PI * 2, false);
      ctx.fillStyle = `rgba(254, 252, 207, ${this.curAlpha})`;
      ctx.fill();
      ctx.closePath();
    }
  }

  const drawFlameBase = (ctx, cw, ch) => {
    ctx.beginPath();
    ctx.arc(cw / 2, ch / 2, 14, Math.PI * 2, false);
    ctx.fillStyle = "rgba(185, 125, 45, 0.4)";
    ctx.fill();
    ctx.closePath();
  };

  const isBlowing = (meter) => {
    if (!meter) return false;
    lowpassRef.current =
      ALPHA * meter.volume + (1.0 - ALPHA) * lowpassRef.current;
    return lowpassRef.current > THRESHOLD;
  };

  const createAudioMeter = (audioContext) => {
    const meter = {
      volume: 0,
      clipLevel: 0.98,
      clipLag: 750,
      averaging: 0.95,
      clipCounter: 0,
    };

    const scriptProcessor = audioContext.createScriptProcessor(4096);
    scriptProcessor.onaudioprocess = (event) => {
      const input = event.inputData.getChannelData(0);
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

        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
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
          <canvas
            ref={canvasRef}
            className="block mx-auto -mb-[500px] blur-[1.5px] opacity-90"
            style={{ filter: "url('#blur') blur(1.5px)" }}
          />
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
