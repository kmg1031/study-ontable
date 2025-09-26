import { defineStore } from 'pinia'
import type { CartItem } from '@/types'

interface CartState {
  items: CartItem[]
  tableNumber: number
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
    tableNumber: 7
  }),

  getters: {
    itemCount: (state): number => state.items.length,

    totalPrice: (state): number => {
      return state.items.reduce((total, item) => total + item.totalPrice, 0)
    },

    getItemById: (state) => (id: string): CartItem | undefined => {
      return state.items.find(item => item.id === id)
    }
  },

  actions: {
    addItem(cartItem: Omit<CartItem, 'id'>): void {
      this.items.push({
        ...cartItem,
        id: Date.now().toString()
      })
    },

    updateItem(id: string, updates: Partial<CartItem>): void {
      const index = this.items.findIndex(item => item.id === id)
      if (index !== -1) {
        this.items[index] = { ...this.items[index], ...updates }
      }
    },

    removeItem(id: string): void {
      this.items = this.items.filter(item => item.id !== id)
    },

    clearCart(): void {
      this.items = []
    },

    updateQuantity(id: string, newQuantity: number): void {
      if (newQuantity <= 0) {
        this.removeItem(id)
        return
      }

      const item = this.getItemById(id)
      if (!item) return

      const basePrice = item.menuItem.price
      const sizePrice = item.selectedSize && item.menuItem.options?.sizes
        ? item.menuItem.options.sizes.find(s => s.name === item.selectedSize)?.price || 0
        : 0
      const extrasPrice = item.selectedExtras && item.menuItem.options?.extras
        ? item.selectedExtras.reduce((total, extraName) => {
            const extra = item.menuItem.options?.extras?.find(e => e.name === extraName)
            return total + (extra?.price || 0)
          }, 0)
        : 0

      const unitPrice = basePrice + sizePrice + extrasPrice
      const newTotalPrice = unitPrice * newQuantity

      this.updateItem(id, {
        quantity: newQuantity,
        totalPrice: newTotalPrice
      })
    }
  }
})