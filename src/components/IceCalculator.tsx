import { useMemo, useState } from 'react';
import { BUSINESS, money } from '../config';
import { useCart } from '../context/CartContext';
import { anim, BG_ICE } from '../lib/anim';
import { useInView } from '../lib/useInView';

type Use = 'drinks' | 'cooler' | 'both';
const WEATHER = { cool: 1, warm: 1.25, hot: 1.5 } as const;

/** Rough guide: 1 block per 10 guests for drinks over ~3 hours, 1 per 12 guests for coolers. */
export function recommendBlocks(guests: number, hours: number, weather: keyof typeof WEATHER, use: Use) {
  const drinks = (guests / 10) * (1 + Math.max(0, hours - 3) * 0.15);
  const cooler = guests / 12;
  const base = use === 'drinks' ? drinks : use === 'cooler' ? cooler : drinks + cooler;
  return Math.max(1, Math.ceil(base * WEATHER[weather]));
}

export default function IceCalculator() {
  const { ref, visible } = useInView<HTMLElement>(0.15);
  const { add, open } = useCart();
  const [guests, setGuests] = useState(50);
  const [hours, setHours] = useState(4);
  const [weather, setWeather] = useState<keyof typeof WEATHER>('hot');
  const [use, setUse] = useState<Use>('both');

  const blocks = useMemo(() => recommendBlocks(guests, hours, weather, use), [guests, hours, weather, use]);
  const cost = blocks * BUSINESS.pricePerBlock;

  const pill = (active: boolean) =>
    `text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-navy transition-colors ${
      active ? 'bg-navy text-white' : 'hover:bg-white'
    }`;

  return (
    <section id="calculator" ref={ref} className="px-4 md:px-8 py-20 md:py-28" style={{ backgroundColor: BG_ICE }}>
      <div className="grid md:grid-cols-2 gap-12">
        <div {...anim(visible, 0, { y: 20, duration: 1400 })}>
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-royal mb-4">Ice calculator</p>
          <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">How many blocks do you need?</h2>
          <p className="text-sm mt-6 max-w-md text-navy/80">
            Tell us about your event and we'll work out the right number of blocks — then drop them straight into your cart.
          </p>
        </div>

        <div className="flex flex-col gap-6" {...anim(visible, 300, { y: 30, duration: 1600 })}>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest flex justify-between">
              Guests <span className="font-display text-royal">{guests}</span>
            </span>
            <input type="range" min={5} max={500} step={5} value={guests} onChange={(e) => setGuests(+e.target.value)} className="accent-royal" />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest flex justify-between">
              Duration <span className="font-display text-royal">{hours} hrs</span>
            </span>
            <input type="range" min={1} max={12} value={hours} onChange={(e) => setHours(+e.target.value)} className="accent-royal" />
          </label>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest">Weather</span>
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(WEATHER) as (keyof typeof WEATHER)[]).map((w) => (
                <button key={w} type="button" className={pill(weather === w)} onClick={() => setWeather(w)}>{w}</button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest">Ice for</span>
            <div className="flex gap-2 flex-wrap">
              {([['drinks', 'Drinks'], ['cooler', 'Coolers'], ['both', 'Both']] as [Use, string][]).map(([u, l]) => (
                <button key={u} type="button" className={pill(use === u)} onClick={() => setUse(u)}>{l}</button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 flex flex-col gap-3 shadow-[0_10px_40px_-15px_rgba(11,27,69,.35)]" aria-live="polite">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold uppercase tracking-widest">You need about</span>
              <span className="font-display text-4xl font-extrabold text-royal">
                {blocks} <span className="text-base">block{blocks === 1 ? '' : 's'}</span>
              </span>
            </div>
            <p className="text-sm text-navy/70">
              {blocks} × {money(BUSINESS.pricePerBlock)} = <b className="text-navy">{money(cost)}</b>
            </p>
            <button
              type="button"
              onClick={() => { add('single-block', blocks); open(); }}
              className="text-xs font-bold tracking-widest uppercase py-3.5 rounded-full bg-royal text-white hover:bg-navy transition-colors"
            >
              Add {blocks} block{blocks === 1 ? '' : 's'} to cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
