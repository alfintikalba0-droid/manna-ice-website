import type React from 'react';
import { useCart } from '../context/CartContext';
import type { Product } from '../data/products';
import { anim } from '../lib/anim';
import { useInView } from '../lib/useInView';
import ProductPanel from './ProductPanel';

interface GalleryItem { src: string; caption: string }

interface Props {
  id?: string;
  bg: string;
  product: Product;
  video: string;
  /** Full-bleed photo for the media half (also the video poster). Ignored when `gallery` is set. */
  image?: string;
  imageAlt?: string;
  /** Show photos as framed cards instead of one full-bleed image (better for small photos). */
  gallery?: GalleryItem[];
  galleryBg?: string;
  /** 'left' = panel on the left, media right (flex-col). 'right' = media left, panel right (flex-col-reverse). */
  panelSide: 'left' | 'right';
  dark?: boolean;
}

function FullBleed({ video, image, alt, className, style }: { video: string; image: string; alt: string; className: string; style: React.CSSProperties }) {
  return (
    <div className={`${className} relative overflow-hidden bg-navy`} style={style}>
      {video ? (
        <video autoPlay muted loop playsInline poster={image} className="absolute inset-0 w-full h-full object-cover">
          <source src={video} type="video/mp4" />
        </video>
      ) : (
        <img src={image} alt={alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
      )}
    </div>
  );
}

function Gallery({ items, bg, visible }: { items: GalleryItem[]; bg: string; visible: boolean }) {
  return (
    <div className="relative overflow-hidden flex items-center justify-center px-6 py-12 md:px-10 lg:px-16" style={{ backgroundColor: bg }}>
      <div
        aria-hidden="true"
        className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full blur-3xl opacity-50"
        style={{ background: 'radial-gradient(circle, #3FD0F2 0%, transparent 70%)' }}
      />
      <div className="relative grid grid-cols-2 md:grid-cols-1 gap-4 md:gap-6 w-full max-w-[380px] md:max-w-[360px]">
        {items.map((it, i) => (
          <figure
            key={it.src}
            className={`rounded-2xl overflow-hidden bg-white shadow-2xl ${i % 2 ? 'md:translate-x-10' : 'md:-translate-x-6'}`}
            {...anim(visible, 300 + i * 250, { y: 40, duration: 1600 })}
          >
            <img src={it.src} alt={it.caption} loading="lazy" className="w-full aspect-[360/316] object-cover block" />
            <figcaption className="bg-royal text-white font-display font-bold text-[10px] md:text-xs uppercase tracking-wide px-4 py-3">
              {it.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}

export default function ShowcaseSection({ id, bg, product, video, image = '', imageAlt = '', gallery, galleryBg = '#0B1B45', panelSide, dark = false }: Props) {
  const { ref, visible } = useInView<HTMLElement>(0.15);
  const { add } = useCart();

  const panel = (
    <ProductPanel
      bg={bg}
      product={product}
      notes={product.notes}
      visible={visible}
      dark={dark}
      onAdd={(qty) => add(product.id, qty, true)}
    />
  );

  // A gallery renders once and flows naturally on every screen size.
  const media = gallery
    ? [<Gallery key="g" items={gallery} bg={galleryBg} visible={visible} />]
    : [
        <FullBleed key="d" video={video} image={image} alt={imageAlt} className="hidden md:block" style={{ minHeight: '100%' }} />,
        <FullBleed key="m" video={video} image={image} alt={imageAlt} className="md:hidden" style={{ height: '75vw' }} />,
      ];

  return (
    <section id={id} ref={ref} className="relative w-full">
      {panelSide === 'right' ? (
        // DOM: [media…, panel]. flex-col-reverse puts the panel on top on mobile.
        <div className="flex flex-col-reverse md:grid md:min-h-[85vh]" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {media}
          {panel}
        </div>
      ) : (
        <div className="flex flex-col md:grid md:min-h-[85vh]" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {panel}
          {[...media].reverse()}
        </div>
      )}
    </section>
  );
}
