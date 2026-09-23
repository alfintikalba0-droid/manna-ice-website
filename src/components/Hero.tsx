import { useEffect, useState } from 'react';
import { BUSINESS, money } from '../config';
import { anim } from '../lib/anim';

export default function Hero() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <section id="top" className="relative min-h-screen flex items-end text-white overflow-hidden bg-navy">
      <img
        src="/machine.jpg"
        alt="Manna Ice block ice machine"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: '60% center' }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(11,27,69,.96) 0%, rgba(11,27,69,.7) 40%, rgba(31,63,176,.35) 100%)',
        }}
      />

      {/* Price seal, echoing the badge on the flyer */}
      <div
        className="absolute right-4 md:right-10 top-20 md:top-24 z-10 w-28 h-28 md:w-40 md:h-40 rounded-full bg-accent text-navy flex flex-col items-center justify-center text-center shadow-2xl ring-4 ring-white/40"
        style={{ ...anim(visible, 1200, { y: -12, duration: 1400 }).style }}
      >
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Only</span>
        <span className="font-display font-extrabold text-2xl md:text-4xl leading-none my-1">{money(BUSINESS.pricePerBlock)}</span>
        <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">per block</span>
      </div>

      <div className="relative z-10 w-full px-4 md:px-8 pb-12 md:pb-16 pt-28">
        <p className="text-xs uppercase tracking-[0.3em] mb-6 text-accent font-bold" {...anim(visible, 0, { y: 12, duration: 1400 })}>
          {BUSINESS.tagline}
        </p>
        <h1
          className="font-extrabold leading-[0.95]"
          style={{ fontSize: 'clamp(3rem, 11vw, 9.5rem)', ...anim(visible, 200, { y: 40, duration: 1800 }).style }}
        >
          MANNA
          <br />
          ICE
        </h1>
        <div className="mt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <p className="max-w-md text-sm md:text-base text-white/85" {...anim(visible, 600, { y: 16, duration: 1400 })}>
            High-quality, crystal-clear ice blocks made with safe, treated water — slow melting for maximum cooling.
            For homes, shops, events and industries.
          </p>
          <div className="flex gap-3 flex-wrap" {...anim(visible, 900, { y: 16, duration: 1400 })}>
            <a
              href="#shop"
              className="text-xs font-bold tracking-widest uppercase px-6 py-3 bg-accent text-navy rounded-full hover:bg-white transition-colors"
            >
              Order ice blocks
            </a>
            <a
              href="#calculator"
              className="text-xs font-bold tracking-widest uppercase px-6 py-3 border border-white rounded-full hover:bg-white hover:text-navy transition-colors"
            >
              How many do I need?
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
