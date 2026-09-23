import { BUSINESS } from '../config';

export default function Footer() {
  return (
    <footer className="bg-navy text-white px-4 md:px-8 pt-16 pb-8">
      <p className="font-display font-extrabold leading-none" style={{ fontSize: 'clamp(2.25rem, 10vw, 9rem)' }}>
        {BUSINESS.name}
      </p>
      <p className="mt-3 text-xs uppercase tracking-[0.3em] font-bold text-accent">{BUSINESS.tagline}</p>
      <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-xs text-white/60">
        <p>© {new Date().getFullYear()} {BUSINESS.name}. …for coolness you can count on!</p>
        <nav className="flex gap-6 flex-wrap">
          <a href="#shop" className="hover:text-white">Shop</a>
          <a href="#faq" className="hover:text-white">FAQ</a>
          <a href="#contact" className="hover:text-white">Contact</a>
          <a href="#top" className="hover:text-white">Back to top ↑</a>
        </nav>
      </div>
    </footer>
  );
}
