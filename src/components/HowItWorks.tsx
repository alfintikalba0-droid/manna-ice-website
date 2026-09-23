import { anim } from '../lib/anim';
import { useInView } from '../lib/useInView';

// The four promises from the Manna Ice flyer.
const PROMISES = [
  { n: '01', title: '100% Clean & Hygienic', body: 'Made with safe, treated water.' },
  { n: '02', title: 'Long Lasting', body: 'Slow melting for maximum cooling.' },
  { n: '03', title: 'Premium Quality', body: 'Crystal-clear ice blocks you can trust.' },
  { n: '04', title: 'Reliable Supply', body: 'For homes, shops, events and industries.' },
];

export default function HowItWorks() {
  const { ref, visible } = useInView<HTMLElement>(0.15);
  return (
    <section id="how" ref={ref} className="relative overflow-hidden bg-navy text-white px-4 md:px-8 py-20 md:py-28">
      <div
        aria-hidden="true"
        className="absolute -right-40 -top-40 w-[520px] h-[520px] rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, #1F3FB0 0%, transparent 70%)' }}
      />
      <p className="relative text-xs uppercase tracking-[0.3em] font-bold text-accent mb-4" {...anim(visible, 0, { y: 12, duration: 1400 })}>
        Why Manna Ice
      </p>
      <h2 className="relative text-3xl md:text-5xl font-extrabold mb-14 max-w-3xl" {...anim(visible, 100, { y: 12, duration: 1400 })}>
        Coolness you can count on.
      </h2>
      <ol className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {PROMISES.map((s, i) => (
          <li
            key={s.n}
            className="rounded-2xl bg-white/5 border border-white/10 p-6"
            {...anim(visible, 200 + i * 150, { y: 24, duration: 1400 })}
          >
            <span className="font-display text-sm font-bold text-accent">{s.n}</span>
            <h3 className="text-lg font-bold mt-3 mb-2">{s.title}</h3>
            <p className="text-sm text-white/70 leading-relaxed">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
