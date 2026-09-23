// ─── Business settings — edit these to match MANNA ICE ───────────────────────
export const BUSINESS = {
  name: 'MANNA ICE',
  tagline: 'Pure. Fresh. Reliable.',
  // International format, digits only (no +, spaces or dashes). Used for WhatsApp orders.
  whatsapp: '2349049101070',
  // Numbers customers can call. `tel` is what the phone dials, `label` is what they read.
  phones: [
    { tel: '+2347035590020', label: '0703 559 0020' },
    { tel: '+2349049101070', label: '0904 910 1070' },
  ],
  email: 'mannaicecompany@gmail.com',
  address: 'Navy Estate, Patrick Koshoni, Karshi',
  hours: 'Mon–Sun · 7:00 AM – 9:00 PM', // placeholder — replace with your real hours
  currency: '₦',
  pricePerBlock: 700,
  deliveryFee: 1000,
  freeDeliveryOver: 14000,
};

// Showcase videos. Swap in your own ice footage any time.
// Leave a value empty ('') to show the photo instead.
export const VIDEOS = {
  // The original template video (fragrance footage) — paste it back in if you want it:
  // 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_151818_65bb22c5-33ae-4e23-85ea-0a3dd89957c2.mp4'
  wild: '',
  finder: '',
};

export const money = (n: number) => `${BUSINESS.currency}${Math.round(n).toLocaleString('en-NG')}`;
