import { useEffect, useRef, useState } from 'react';
import { Butterfly } from './ButterflyField';

/**
 * Click the butterfly on the hero portrait and a swarm flies out across the
 * screen. Any component can trigger it with `releaseSwarm(x, y)`; this overlay,
 * mounted once on the home page, does the drawing.
 */
const EVENT = 'butterfly-swarm';
const COLORS = ['#7c3aed', '#a78bfa', '#f472b6', '#34d399', '#fbbf24'];
const COUNT = 30;

export const releaseSwarm = (x: number, y: number) => {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { x, y } }));
};

type Flyer = { id: number; size: number; color: string };

const ButterflySwarm = () => {
  const [flyers, setFlyers] = useState<Flyer[]>([]);
  const nodes = useRef<Map<number, HTMLDivElement>>(new Map());
  const nextId = useRef(0);

  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)');

    const launch = (event: Event) => {
      if (still.matches) return;
      const { x: ox, y: oy } = (event as CustomEvent<{ x: number; y: number }>).detail;
      const batch: Flyer[] = Array.from({ length: COUNT }, (_, i) => ({
        id: nextId.current++,
        size: 22 + Math.random() * 30,
        color: COLORS[i % COLORS.length],
      }));
      setFlyers(current => [...current, ...batch]);

      const W = window.innerWidth;
      const H = window.innerHeight;
      // Wait one frame so React has attached the nodes before animating them.
      requestAnimationFrame(() => {
        batch.forEach((flyer, i) => {
          const el = nodes.current.get(flyer.id);
          if (!el) return;
          const angle = -Math.PI * 0.9 + Math.random() * Math.PI * 1.8;
          const speed = 1.4 + Math.random() * 2.6;
          let vx = Math.cos(angle) * speed;
          let vy = Math.sin(angle) * speed - 0.5;
          let x = ox;
          let y = oy;
          const wobble = Math.random() * 6;
          const life = 3600 + Math.random() * 1400;
          const start = performance.now() + i * 30;

          const step = (now: number) => {
            const t = now - start;
            if (t < 0) {
              requestAnimationFrame(step);
              return;
            }
            vx += (Math.random() - 0.5) * 0.14;
            vy += (Math.random() - 0.5) * 0.14 - 0.004;
            x += vx * 1.5 + Math.sin(t / 260 + wobble) * 0.9;
            y += vy * 1.5 + Math.cos(t / 310 + wobble) * 0.7;
            const rotate = (Math.atan2(vy, vx) * 180) / Math.PI + 90;
            const fadeIn = Math.min(1, t / 300);
            const fadeOut = Math.max(0, 1 - (t - (life - 900)) / 900);
            el.style.transform = `translate(${x - flyer.size / 2}px, ${y - flyer.size * 0.4}px) rotate(${rotate}deg)`;
            el.style.opacity = String(Math.min(fadeIn, fadeOut));
            const inBounds = x > -100 && x < W + 100 && y > -100 && y < H + 100;
            if (t < life && inBounds) {
              requestAnimationFrame(step);
            } else {
              nodes.current.delete(flyer.id);
              setFlyers(current => current.filter(f => f.id !== flyer.id));
            }
          };
          requestAnimationFrame(step);
        });
      });
    };

    window.addEventListener(EVENT, launch);
    return () => window.removeEventListener(EVENT, launch);
  }, []);

  if (flyers.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[150] overflow-hidden" aria-hidden="true">
      {flyers.map(flyer => (
        <div
          key={flyer.id}
          ref={el => {
            if (el) nodes.current.set(flyer.id, el);
          }}
          className="swarm-fly absolute left-0 top-0 will-change-transform"
          style={{ width: flyer.size, height: flyer.size * 0.8, color: flyer.color, opacity: 0 }}
        >
          <Butterfly className="h-full w-full" />
        </div>
      ))}
    </div>
  );
};

export default ButterflySwarm;
