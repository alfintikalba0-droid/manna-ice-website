import { useState, type FormEvent } from 'react';
import { BUSINESS } from '../config';
import { whatsappLink } from '../lib/whatsapp';

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get('name') ?? '').trim();
    const topic = String(f.get('topic') ?? '');
    const message = String(f.get('message') ?? '').trim();
    if (!name || message.length < 5) {
      setError('Please add your name and a short message.');
      return;
    }
    setError('');
    window.open(whatsappLink(`Hi ${BUSINESS.name}, I'm ${name}.\nTopic: ${topic}\n\n${message}`), '_blank', 'noopener');
    setSent(true);
    e.currentTarget.reset();
  };

  const field = 'w-full border border-navy/20 rounded-lg bg-frost px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-accent placeholder:text-navy/50';

  return (
    <section id="contact" className="px-4 md:px-8 py-20 md:py-28 bg-royal text-white">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] font-bold text-accent mb-4">Contact</p>
          <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">Talk to us.</h2>
          <p className="text-sm mt-6 max-w-sm text-white/80">Wholesale pricing, standing orders, events or a quick question — we reply fast.</p>
          <dl className="mt-10 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-sm">
            <dt className="text-xs font-bold uppercase tracking-widest pt-0.5 text-accent">Call</dt>
            <dd><a className="underline" href={`tel:+${BUSINESS.whatsapp}`}>{BUSINESS.phoneDisplay}</a></dd>
            <dt className="text-xs font-bold uppercase tracking-widest pt-0.5 text-accent">WhatsApp</dt>
            <dd><a className="underline" href={whatsappLink(`Hi ${BUSINESS.name}!`)} target="_blank" rel="noreferrer">Chat now</a></dd>
            <dt className="text-xs font-bold uppercase tracking-widest pt-0.5 text-accent">Email</dt>
            <dd><a className="underline" href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a></dd>
            <dt className="text-xs font-bold uppercase tracking-widest pt-0.5 text-accent">Address</dt>
            <dd>{BUSINESS.address}</dd>
            <dt className="text-xs font-bold uppercase tracking-widest pt-0.5 text-accent">Hours</dt>
            <dd>{BUSINESS.hours}</dd>
          </dl>
        </div>

        <form onSubmit={submit} noValidate className="flex flex-col gap-4 bg-white text-navy rounded-2xl p-6 md:p-8 shadow-2xl">
          <input name="name" placeholder="Your name" autoComplete="name" className={field} />
          <select name="topic" className={field} defaultValue="General question">
            <option>General question</option>
            <option>Wholesale / standing order</option>
            <option>Event quote</option>
            <option>Delivery issue</option>
          </select>
          <textarea name="message" rows={4} placeholder="Your message" className={field} />
          {error && <p className="text-xs text-red-700">{error}</p>}
          {sent && <p className="text-xs">Opening WhatsApp with your message — just hit send.</p>}
          <button type="submit" className="self-start text-xs font-bold uppercase tracking-widest px-8 py-4 rounded-full bg-royal text-white hover:bg-navy transition-colors">
            Send message
          </button>
        </form>
      </div>
    </section>
  );
}
