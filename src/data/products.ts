import { BUSINESS } from '../config';

export interface Note { label: string; ingredient: string }

export interface Product {
  id: string;
  name: string;
  size: string;
  blocks: number;
  price: number;
  image: string;
  blurb: string;
  notes: Note[];
}

const block = (n: number) => n * BUSINESS.pricePerBlock;

export const PRODUCTS: Product[] = [
  {
    id: 'single-block',
    name: 'Ice Block',
    size: '1 block',
    blocks: 1,
    price: block(1),
    image: '/blocks-2.jpg',
    blurb: 'One solid, crystal-clear block. Perfect for the home freezer, a cooler or a small gathering.',
    notes: [
      { label: 'Water', ingredient: 'TREATED & SAFE' },
      { label: 'Melt', ingredient: 'SLOW & LONG LASTING' },
      { label: 'Finish', ingredient: 'CRYSTAL CLEAR' },
    ],
  },
  {
    id: 'party-pack',
    name: 'Party Pack',
    size: '10 blocks',
    blocks: 10,
    price: block(10),
    image: '/blocks-1.jpg',
    blurb: 'Ten blocks for parties, owambe, church events and weekend coolers.',
    notes: [
      { label: 'For', ingredient: 'PARTIES & EVENTS' },
      { label: 'Melt', ingredient: 'SLOW & LONG LASTING' },
      { label: 'Finish', ingredient: 'PERFECTLY SHAPED' },
    ],
  },
  {
    id: 'wholesale',
    name: 'Wholesale Bundle',
    size: '50 blocks',
    blocks: 50,
    price: block(50),
    image: '/machine.jpg',
    blurb: 'Straight off the machine for shops, fish sellers, drink vendors and industries.',
    notes: [
      { label: 'For', ingredient: 'SHOPS & INDUSTRY' },
      { label: 'Supply', ingredient: 'RELIABLE DAILY' },
      { label: 'Finish', ingredient: 'EXTRA STRONG' },
    ],
  },
];

export const getProduct = (id: string) => PRODUCTS.find((p) => p.id === id);
