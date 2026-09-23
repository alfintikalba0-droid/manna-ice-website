import { useState } from 'react';
import { BUSINESS, money } from '../config';
import { useCart } from '../context/CartContext';
import { PRODUCTS, type Product } from '../data/products';
import { anim } from '../lib/anim';
import { useInView } from '../lib/useInView';

function Card({ product, visible, index }: { product: Product; visible: boolean; index: number }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <article
      className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-[0_10px_40px_-15px_rgba(11,27,69,.35)]"
      {...anim(visible, 150 * index, { y: 30, duration: 1400 })}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-ice">
        <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover block" />
        <span className="absolute top-3 left-3 bg-navy text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
          {product.size}
        </span>
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-lg font-bold">{product.name}</h3>
          <span className="font-display font-bold text-royal">{money(product.price)}</span>
        </div>
        {product.blocks > 1 && (
          <p className="text-xs text-navy/60">{product.blocks} × {money(BUSINESS.pricePerBlock)}</p>
        )}
        <p className="text-sm leading-relaxed flex-1 text-navy/80">{product.blurb}</p>
        <div className="flex items-stretch gap-2">
          <div className="flex border border-navy/20 rounded-full overflow-hidden">
            <button type="button" className="w-9 text-sm hover:bg-ice" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <input
              type="number"
              min={1}
              max={999}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Math.min(999, Number(e.target.value) || 1)))}
              className="w-10 text-center text-sm outline-none bg-transparent [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
              aria-label={`${product.name} quantity`}
            />
            <button type="button" className="w-9 text-sm hover:bg-ice" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(999, q + 1))}>+</button>
          </div>
          <button
            type="button"
            onClick={() => { add(product.id, qty); setQty(1); }}
            className="flex-1 text-xs font-bold tracking-widest uppercase py-3 rounded-full bg-royal text-white hover:bg-navy transition-colors"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}

export default function ProductGrid() {
  const { ref, visible } = useInView<HTMLElement>(0.1);
  return (
    <section id="shop" ref={ref} className="px-4 md:px-8 py-20 md:py-28 bg-frost">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10" {...anim(visible, 0, { y: 12, duration: 1400 })}>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-royal mb-3">Shop</p>
          <h2 className="text-3xl md:text-5xl font-extrabold">Ice blocks for every need</h2>
        </div>
        <p className="text-sm max-w-sm text-navy/70">
          Every block is {money(BUSINESS.pricePerBlock)} — buy one, or grab a pack. Free delivery on orders over{' '}
          {money(BUSINESS.freeDeliveryOver)}.
        </p>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p, i) => <Card key={p.id} product={p} visible={visible} index={i} />)}
      </div>
    </section>
  );
}
