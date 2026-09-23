import { useEffect, useState } from 'react';
import { BUSINESS } from '../config';
import { useCart } from '../context/CartContext';

const LINKS = [
  { href: '#shop', label: 'Shop' },
  { href: '#calculator', label: 'Ice calculator' },
  { href: '#how', label: 'Why us' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contact', label: 'Contact' },
];

export default function Navbar() {
  const { count, open } = useCart();
  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-colors duration-500 ${
        scrolled || menu ? 'bg-frost/95 backdrop-blur border-b border-navy/10 text-navy' : 'bg-transparent text-white'
      }`}
    >
      <nav className="flex items-center justify-between h-14 px-4 md:px-8">
        <a href="#top" className="font-display text-sm font-extrabold tracking-[0.2em]" onClick={() => setMenu(false)}>
          {BUSINESS.name}
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="text-xs uppercase tracking-widest hover:opacity-60 transition-opacity">
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={open}
            className="text-xs font-bold uppercase tracking-widest rounded-full border border-current px-4 py-2 hover:opacity-60 transition-opacity"
            aria-label={`Open cart, ${count} items`}
          >
            Cart ({count})
          </button>
          <button
            type="button"
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
            aria-expanded={menu}
            onClick={() => setMenu((m) => !m)}
          >
            <span className={`block h-px w-5 bg-current transition-transform ${menu ? 'translate-y-[3.5px] rotate-45' : ''}`} />
            <span className={`block h-px w-5 bg-current transition-transform ${menu ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
          </button>
        </div>
      </nav>

      {menu && (
        <ul className="md:hidden px-4 pb-4 flex flex-col gap-3">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} onClick={() => setMenu(false)} className="block text-sm uppercase tracking-widest py-1">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
