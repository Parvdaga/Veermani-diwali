"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  id: string;
  name: string;
  name_english: string;
  price_per_kg: number;
  quantity_kg: number;
  category: string;
};

type CartStore = {
  items: CartItem[];
  customPacking: boolean;
  addItem: (item: Omit<CartItem, 'quantity_kg'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity_kg: number) => void;
  setCustomPacking: (value: boolean) => void;
  clearCart: () => void;
  getTotalAmount: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      customPacking: false,

      addItem: (item) => {
        const existingItem = get().items.find((i) => i.id === item.id);
        if (existingItem) {
          set((state) => ({
            items: state.items.map((i) =>
              i.id === item.id ? { ...i, quantity_kg: i.quantity_kg + 0.5 } : i
            ),
          }));
        } else {
          set((state) => ({
            items: [...state.items, { ...item, quantity_kg: 0.5 }],
          }));
        }
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity_kg) => {
        if (quantity_kg <= 0) {
          get().removeItem(id);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity_kg } : item
          ),
        }));
      },

      setCustomPacking: (value) => {
        set({ customPacking: value });
      },

      clearCart: () => {
        set({ items: [], customPacking: false });
      },

      getTotalAmount: () => {
        return get().items.reduce(
          (total, item) => total + item.price_per_kg * item.quantity_kg,
          0
        );
      },
    }),
    {
      name: 'veermani-cart',
      skipHydration: true,
    }
  )
);
