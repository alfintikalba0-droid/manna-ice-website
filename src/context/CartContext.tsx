import { createContext, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { BUSINESS } from '../config';
import { getProduct, type Product } from '../data/products';
import { load, save } from '../lib/storage';

type Lines = Record<string, number>; // productId -> qty

type Action =
  | { type: 'add'; id: string; qty: number }
  | { type: 'set'; id: string; qty: number }
  | { type: 'clear' };

function reducer(state: Lines, action: Action): Lines {
  switch (action.type) {
    case 'add': {
      const qty = Math.min(999, (state[action.id] ?? 0) + action.qty);
      return { ...state, [action.id]: qty };
    }
    case 'set': {
      const next = { ...state };
      if (action.qty <= 0) delete next[action.id];
      else next[action.id] = Math.min(999, action.qty);
      return next;
    }
    case 'clear':
      return {};
  }
}

export interface CartLine { product: Product; qty: number; total: number }

interface CartValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  delivery: number;
  total: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (id: string, qty?: number, openDrawer?: boolean) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  toast: string | null;
}

const CartContext = createContext<CartValue | null>(null);
const KEY = 'manna-ice-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, () => load<Lines>(KEY, {}));
  const [isOpen, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => save(KEY, state), [state]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const value = useMemo<CartValue>(() => {
    const lines: CartLine[] = Object.entries(state)
      .map(([id, qty]) => {
        const product = getProduct(id);
        return product ? { product, qty, total: product.price * qty } : null;
      })
      .filter((l): l is CartLine => l !== null);
    const subtotal = lines.reduce((s, l) => s + l.total, 0);
    const delivery = subtotal === 0 || subtotal >= BUSINESS.freeDeliveryOver ? 0 : BUSINESS.deliveryFee;
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal,
      delivery,
      total: subtotal + delivery,
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      add: (id, qty = 1, openDrawer = false) => {
        dispatch({ type: 'add', id, qty });
        const p = getProduct(id);
        setToast(`${qty} × ${p?.name ?? 'item'} added`);
        if (openDrawer) setOpen(true);
      },
      setQty: (id, qty) => dispatch({ type: 'set', id, qty }),
      clear: () => dispatch({ type: 'clear' }),
      toast,
    };
  }, [state, isOpen, toast]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
