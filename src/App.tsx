import CartDrawer from './components/CartDrawer';
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import IceCalculator from './components/IceCalculator';
import Navbar from './components/Navbar';
import ProductGrid from './components/ProductGrid';
import ShowcaseSection from './components/ShowcaseSection';
import { VIDEOS } from './config';
import { CartProvider, useCart } from './context/CartContext';
import { getProduct } from './data/products';
import { BG_ICE, BG_ROYAL } from './lib/anim';

function Toast() {
  const { toast } = useCart();
  return (
    <div
      role="status"
      className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-navy text-white text-xs uppercase tracking-widest px-5 py-3 transition-all duration-300 ${
        toast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      {toast}
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <Navbar />
      <main>
        <Hero />
        {/* Party Pack: text panel left (ice blue), framed photo cards right */}
        <ShowcaseSection
          bg={BG_ICE}
          product={getProduct('party-pack')!}
          video={VIDEOS.finder}
          gallery={[
            { src: '/blocks-1.jpg', caption: 'Perfectly shaped for longer use' },
            { src: '/blocks-clear.jpg', caption: 'Crystal clear. Extra strong.' },
          ]}
          panelSide="left"
        />
        {/* Single block: machine photo left, panel right (royal blue), flex-col-reverse on mobile */}
        <ShowcaseSection
          bg={BG_ROYAL}
          dark
          product={getProduct('single-block')!}
          video={VIDEOS.wild}
          image="/machine.jpg"
          imageAlt="Manna Ice block ice machine"
          panelSide="right"
        />
        <ProductGrid />
        <IceCalculator />
        <HowItWorks />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <CartDrawer />
      <Toast />
    </CartProvider>
  );
}
