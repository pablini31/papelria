import { create } from "zustand"
import type { CartItem, Product } from "../types"

interface CartStore {
  items: CartItem[]
  discount: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updateDiscount: (productId: string, discount: number) => void
  setGlobalDiscount: (discount: number) => void
  clearCart: () => void
  getSubtotal: () => number
  getTotal: () => number
  getTotalItems: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  discount: 0,

  addItem: (product, quantity = 1) => {
    const { items } = get()
    const existingItem = items.find((item) => item.product.id === product.id)

    if (existingItem) {
      set({
        items: items.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        ),
      })
    } else {
      set({
        items: [...items, { product, quantity, discount: 0 }],
      })
    }
  },

  removeItem: (productId) => {
    set({
      items: get().items.filter((item) => item.product.id !== productId),
    })
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId)
      return
    }

    set({
      items: get().items.map((item) => (item.product.id === productId ? { ...item, quantity } : item)),
    })
  },

  updateDiscount: (productId, discount) => {
    set({
      items: get().items.map((item) => (item.product.id === productId ? { ...item, discount } : item)),
    })
  },

  setGlobalDiscount: (discount) => {
    set({ discount })
  },

  clearCart: () => {
    set({ items: [], discount: 0 })
  },

  getSubtotal: () => {
    return get().items.reduce((total, item) => {
      const itemTotal = item.product.salePrice * item.quantity
      const itemDiscount = itemTotal * (item.discount / 100)
      return total + (itemTotal - itemDiscount)
    }, 0)
  },

  getTotal: () => {
    const subtotal = get().getSubtotal()
    const globalDiscount = subtotal * (get().discount / 100)
    return subtotal - globalDiscount
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0)
  },
}))
