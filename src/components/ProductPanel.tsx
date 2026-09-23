import { useState } from 'react';
import { BUSINESS, money } from '../config';
import type { Note } from '../data/products';
import { anim, TEXT_COLOR } from '../lib/anim';

interface Props {
  bg: string;
  product: { name: string; size: string; blocks: number; price: number; blurb: string };
  notes: Note[];
  visible: boolean;
  /** Light text + cyan button, for dark backgrounds. */
  dark?: boolean;
  onAdd: (qty: number) => void;
}

export default function ProductPanel({ bg, product, notes, visible, dark = false, onAdd }: Props) {
  const [qty, setQty] = useState(1);
  const color = dark ? '#FFFFFF' : TEXT_COLOR;
  const line = dark ? 'rgba(255,255,255,.3)' : 'rgba(11,27,69,.2)';

  return (
    <div
      className="relative flex flex-col justify-center px-6 md:px-12 lg:px-16 py-14 md:py-20"
      style={{ backgroundColor: bg, color, minHeight: '100%' }}
    >
      <span
        className="self-start text-[11px] font-bold uppercase tracking-[0.2em] rounded-full border px-4 py-1.5"
        style={{ borderColor: line, ...anim(visible, 0, { y: 12, duration: 1400 }).style }}
      >
        {product.size}
      </span>

      <h2
        className="mt-6 font-extrabold leading-[1.02]"
        style={{ fontSize: 'clamp(2.25rem, 5vw, 4.25rem)', ...anim(visible, 150, { y: 30, duration: 1600 }).style }}
      >
        {product.name}
      </h2>

      <div className="mt-5 flex items-baseline gap-3 flex-wrap" {...anim(visible, 300, { y: 16, duration: 1400 })}>
        <span className={`font-display font-extrabold text-3xl md:text-4xl ${dark ? 'text-accent' : 'text-royal'}`}>
          {money(product.price)}
        </span>
        {product.blocks > 1 && (
          <span className="text-sm opacity-70">
            {product.blocks} × {money(BUSINESS.pricePerBlock)} per block
          </span>
        )}
      </div>

      <p className="mt-5 max-w-md text-base leading-relaxed opacity-80" {...anim(visible, 450, { y: 16, duration: 1400 })}>
        {product.blurb}
      </p>

      <dl className="mt-10 grid grid-cols-3 gap-4 max-w-lg" {...anim(visible, 600, { y: 16, duration: 1400 })}>
        {notes.map((note) => (
          <div key={note.ingredient} className="border-t pt-3" style={{ borderColor: line }}>
            <dt className="text-[11px] uppercase tracking-widest opacity-60">{note.label}</dt>
            <dd className="mt-1 text-xs md:text-sm font-bold leading-snug capitalize">{note.ingredient.toLowerCase()}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 flex items-stretch gap-3 flex-wrap" {...anim(visible, 750, { y: 16, duration: 1400 })}>
        <div className="flex items-center rounded-full border overflow-hidden" style={{ borderColor: line }}>
          <button type="button" className="w-10 h-full text-lg" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
          <span className="w-8 text-center font-bold" aria-live="polite">{qty}</span>
          <button type="button" className="w-10 h-full text-lg" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(999, q + 1))}>+</button>
        </div>
        <button
          type="button"
          onClick={() => { onAdd(qty); setQty(1); }}
          className={`text-xs font-bold tracking-widest uppercase px-8 py-4 rounded-full transition-colors ${
            dark ? 'bg-accent text-navy hover:bg-white' : 'bg-royal text-white hover:bg-navy'
          }`}
        >
          Add to cart · {money(product.price * qty)}
        </button>
      </div>
    </div>
  );
}
