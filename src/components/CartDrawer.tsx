import { useEffect, useRef, useState, type FormEvent } from 'react';
import { BUSINESS, money } from '../config';
import { useCart, type CartLine } from '../context/CartContext';
import { load, save } from '../lib/storage';
import { whatsappLink } from '../lib/whatsapp';

interface Order {
  id: string;
  createdAt: string;
  customer: { name: string; phone: string; address: string; date: string; slot: string; payment: string; notes: string };
  lines: { name: string; size: string; qty: number; total: number }[];
  subtotal: number;
  delivery: number;
  total: number;
}

const SLOTS = ['07:00 – 10:00', '10:00 – 13:00', '13:00 – 16:00', '16:00 – 19:00', '19:00 – 22:00'];
const PAYMENTS = ['Cash on delivery', 'Bank transfer', 'POS on delivery'];
const ORDERS_KEY = 'manna-ice-orders';

const today = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

function orderMessage(o: Order) {
  return [
    `Hello ${BUSINESS.name}! New order ${o.id}`,
    '',
    ...o.lines.map((l) => `• ${l.qty} × ${l.name} (${l.size}) — ${money(l.total)}`),
    '',
    `Subtotal: ${money(o.subtotal)}`,
    `Delivery: ${o.delivery ? money(o.delivery) : 'FREE'}`,
    `Total: ${money(o.total)}`,
    '',
    `Name: ${o.customer.name}`,
    `Phone: ${o.customer.phone}`,
    `Address: ${o.customer.address}`,
    `Delivery: ${o.customer.date}, ${o.customer.slot}`,
    `Payment: ${o.customer.payment}`,
    o.customer.notes ? `Notes: ${o.customer.notes}` : '',
  ].filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n');
}

type Step = 'cart' | 'checkout' | 'done';

export default function CartDrawer() {
  const cart = useCart();
  const [step, setStep] = useState<Step>('cart');
  const [order, setOrder] = useState<Order | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cart.isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && cart.close();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
    // Only re-run when the drawer opens/closes, so focus isn't stolen while typing.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cart.isOpen]);

  const close = () => {
    cart.close();
    if (step === 'done') setStep('cart');
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? '').trim();
    const customer = {
      name: get('name'), phone: get('phone'), address: get('address'),
      date: get('date'), slot: get('slot'), payment: get('payment'), notes: get('notes'),
    };
    const errs: Record<string, string> = {};
    if (customer.name.length < 2) errs.name = 'Please enter your name.';
    if (customer.phone.replace(/\D/g, '').length < 7) errs.phone = 'Please enter a valid phone number.';
    if (customer.address.length < 5) errs.address = 'Please enter a delivery address.';
    if (!customer.date || customer.date < today()) errs.date = 'Pick today or a future date.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const o: Order = {
      id: `MI-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      createdAt: new Date().toISOString(),
      customer,
      lines: cart.lines.map((l: CartLine) => ({ name: l.product.name, size: l.product.size, qty: l.qty, total: l.total })),
      subtotal: cart.subtotal,
      delivery: cart.delivery,
      total: cart.total,
    };
    save(ORDERS_KEY, [o, ...load<Order[]>(ORDERS_KEY, [])].slice(0, 20));
    setOrder(o);
    cart.clear();
    setStep('done');
  };

  const field = 'w-full border border-navy/25 rounded-lg px-3 py-2.5 text-sm bg-white outline-none focus:ring-2 focus:ring-accent';
  const err = (k: string) => errors[k] && <span className="text-xs text-red-600">{errors[k]}</span>;

  return (
    <div className={`fixed inset-0 z-50 ${cart.isOpen ? '' : 'pointer-events-none'}`} aria-hidden={!cart.isOpen}>
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-500 ${cart.isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={close}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`absolute right-0 top-0 h-full w-full sm:w-[440px] bg-white flex flex-col outline-none transition-transform duration-500 ${
          cart.isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
      >
        <div className="flex items-center justify-between px-5 h-14 border-b border-black/10 shrink-0">
          <p className="text-xs font-bold uppercase tracking-widest">
            {step === 'cart' ? `Your cart (${cart.count})` : step === 'checkout' ? 'Checkout' : 'Order placed'}
          </p>
          <button type="button" onClick={close} className="text-xs uppercase tracking-widest hover:opacity-60">Close</button>
        </div>

        {step === 'cart' && (
          <>
            <div className="flex-1 overflow-y-auto px-5">
              {cart.lines.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                  <p className="text-sm">Your cart is empty.</p>
                  <a href="#shop" onClick={close} className="text-xs font-bold uppercase tracking-widest border border-black px-5 py-3">
                    Browse ice
                  </a>
                </div>
              ) : (
                <ul className="divide-y divide-black/10">
                  {cart.lines.map(({ product, qty, total }) => (
                    <li key={product.id} className="flex gap-4 py-4">
                      <div className="w-16 shrink-0 overflow-hidden" style={{ aspectRatio: '220/340' }}>
                        <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover block" />
                      </div>
                      <div className="flex-1 flex flex-col gap-1">
                        <div className="flex justify-between gap-2">
                          <p className="text-sm font-bold">{product.name}</p>
                          <p className="text-sm">{money(total)}</p>
                        </div>
                        <p className="text-xs text-black/60">{product.size} · {money(product.price)} each</p>
                        <div className="flex items-center gap-3 mt-auto">
                          <div className="flex border border-black">
                            <button type="button" className="w-8 h-8" aria-label="Decrease" onClick={() => cart.setQty(product.id, qty - 1)}>−</button>
                            <span className="w-8 h-8 flex items-center justify-center text-sm">{qty}</span>
                            <button type="button" className="w-8 h-8" aria-label="Increase" onClick={() => cart.setQty(product.id, qty + 1)}>+</button>
                          </div>
                          <button type="button" className="text-xs underline" onClick={() => cart.setQty(product.id, 0)}>Remove</button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {cart.lines.length > 0 && (
              <div className="border-t border-black/10 p-5 flex flex-col gap-2 shrink-0">
                <Totals subtotal={cart.subtotal} delivery={cart.delivery} total={cart.total} />
                {cart.delivery > 0 && (
                  <p className="text-xs text-black/60">
                    Add {money(BUSINESS.freeDeliveryOver - cart.subtotal)} more for free delivery.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setStep('checkout')}
                  className="mt-2 text-xs font-bold uppercase tracking-widest py-4 rounded-full bg-royal text-white hover:bg-navy transition-colors"
                >
                  Checkout
                </button>
              </div>
            )}
          </>
        )}

        {step === 'checkout' && (
          <form onSubmit={submit} noValidate className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
              <label className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-widest">Full name</span>
                <input name="name" autoComplete="name" className={field} />
                {err('name')}
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-widest">Phone</span>
                <input name="phone" type="tel" autoComplete="tel" className={field} />
                {err('phone')}
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-widest">Delivery address</span>
                <textarea name="address" rows={2} autoComplete="street-address" className={field} />
                {err('address')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-widest">Date</span>
                  <input name="date" type="date" min={today()} defaultValue={today()} className={field} />
                  {err('date')}
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs uppercase tracking-widest">Time</span>
                  <select name="slot" className={field}>
                    {SLOTS.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </label>
              </div>
              <label className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-widest">Payment</span>
                <select name="payment" className={field}>
                  {PAYMENTS.map((p) => <option key={p}>{p}</option>)}
                </select>
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-xs uppercase tracking-widest">Notes (optional)</span>
                <textarea name="notes" rows={2} placeholder="Gate code, landmark, event name…" className={field} />
              </label>
            </div>
            <div className="border-t border-black/10 p-5 flex flex-col gap-2 shrink-0">
              <Totals subtotal={cart.subtotal} delivery={cart.delivery} total={cart.total} />
              <div className="grid grid-cols-[auto_1fr] gap-2 mt-2">
                <button type="button" onClick={() => setStep('cart')} className="text-xs uppercase tracking-widest px-5 rounded-full border border-navy">
                  Back
                </button>
                <button type="submit" className="text-xs font-bold uppercase tracking-widest py-4 rounded-full bg-royal text-white hover:bg-navy transition-colors">
                  Place order · {money(cart.total)}
                </button>
              </div>
            </div>
          </form>
        )}

        {step === 'done' && order && (
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
            <div className="p-5 rounded-2xl bg-ice">
              <p className="text-xs uppercase tracking-widest">Order number</p>
              <p className="font-display text-3xl font-extrabold text-royal mt-1">{order.id}</p>
              <p className="text-sm mt-3">
                Thanks, {order.customer.name.split(' ')[0]}! Send your order to us on WhatsApp to confirm your delivery slot.
              </p>
            </div>
            <ul className="text-sm divide-y divide-black/10">
              {order.lines.map((l) => (
                <li key={l.name} className="flex justify-between py-2">
                  <span>{l.qty} × {l.name}</span>
                  <span>{money(l.total)}</span>
                </li>
              ))}
            </ul>
            <Totals subtotal={order.subtotal} delivery={order.delivery} total={order.total} />
            <p className="text-xs text-black/60">
              Delivering to {order.customer.address} on {order.customer.date}, {order.customer.slot}. Payment: {order.customer.payment}.
            </p>
            <a
              href={whatsappLink(orderMessage(order))}
              target="_blank"
              rel="noreferrer"
              className="text-center text-xs font-bold uppercase tracking-widest py-4 rounded-full bg-[#25D366] text-navy"
            >
              Confirm on WhatsApp
            </a>
            <a
              href={`mailto:${BUSINESS.email}?subject=${encodeURIComponent(`Order ${order.id}`)}&body=${encodeURIComponent(orderMessage(order))}`}
              className="text-center text-xs font-bold uppercase tracking-widest py-4 rounded-full border border-navy"
            >
              Or send by email
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

function Totals({ subtotal, delivery, total }: { subtotal: number; delivery: number; total: number }) {
  return (
    <dl className="text-sm flex flex-col gap-1">
      <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(subtotal)}</dd></div>
      <div className="flex justify-between"><dt>Delivery</dt><dd>{delivery ? money(delivery) : 'Free'}</dd></div>
      <div className="flex justify-between font-bold"><dt>Total</dt><dd>{money(total)}</dd></div>
    </dl>
  );
}
