import { useState } from 'react';
import { BUSINESS, money } from '../config';

const ITEMS = [
  { q: 'Is Manna ice safe to use in drinks?', a: 'Yes. Our ice blocks are 100% clean and hygienic — made with safe, treated water.' },
  { q: 'How much is one block?', a: `Each ice block is ${money(BUSINESS.pricePerBlock)}. Packs are simply priced per block, so you pay the same whether you buy 1 or 50.` },
  { q: 'How much does delivery cost?', a: `Delivery is ${money(BUSINESS.deliveryFee)}, and free on orders over ${money(BUSINESS.freeDeliveryOver)}.` },
  { q: 'How do I pay?', a: 'Pay cash, by bank transfer, or with POS on delivery. Choose your option at checkout.' },
  { q: 'How long will the ice last?', a: 'Our blocks are slow melting for maximum cooling. Keep them in a closed cooler, out of the sun, and drain meltwater to make them last longer.' },
  { q: 'Do you supply shops, events and industries?', a: 'Yes — we offer reliable supply for homes, shops, events and industries, including regular daily orders. Send us a message below.' },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="px-4 md:px-8 py-20 md:py-28 grid md:grid-cols-[1fr_2fr] gap-10 bg-frost">
      <h2 className="text-3xl md:text-5xl font-extrabold">Questions</h2>
      <div className="border-t border-navy/20">
        {ITEMS.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q} className="border-b border-navy/20">
              <button
                type="button"
                className="w-full flex items-center justify-between gap-4 py-5 text-left"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="text-sm md:text-base font-bold">{item.q}</span>
                <span className={`text-2xl text-royal transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>+</span>
              </button>
              <div className="grid transition-[grid-template-rows] duration-500" style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}>
                <p className="overflow-hidden text-sm text-navy/70">
                  <span className="block pb-5">{item.a}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
