export class FlameParticle {
  radius: number;
  speed: { x: number; y: number };
  life: number;
  alpha: number;
  x: number;
  y: number;
  curAlpha: number;
  curLife: number;
  rand = (min: number, max: number) => min + Math.random() * (max - min);

  constructor(x: number, y: number) {
    this.radius = 15;
    this.speed = { x: this.rand(-0.5, 0.5), y: 2.5 };
    this.life = this.rand(50, 100);
    this.alpha = 0.5;
    this.x = x;
    this.y = y;
    this.curAlpha = this.alpha;
    this.curLife = this.life;
  }

  update(
    ctx: CanvasRenderingContext2D,
    cw: number,
    ch: number,
    meter: { volume: number } | null,
    isBlowing: boolean
  ) {
    if (this.curLife <= 90) {
      this.radius -= Math.min(this.radius, 0.25);
      this.curAlpha -= 0.005;
    }

    if (meter && isBlowing) {
      this.x += this.rand(-meter.volume, meter.volume) * 50;
    }

    this.curLife -= this.speed.y;
    this.y -= this.speed.y;
    this.draw(ctx);
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(254, 252, 207, ${this.curAlpha})`;
    ctx.fill();
    ctx.closePath();
  }
}
