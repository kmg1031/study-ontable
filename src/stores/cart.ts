import { defineStore } from 'pinia'
import type { CartItem, CartState, PaymentMethod } from '@/types'
import type { OrderCreateRequest } from '@/types/api'
import { orderApiService } from '@/services/orderApi'
import { globalErrorHandler } from '@/composables/useErrorHandler'

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
    tableNumber: 7,
    isLoading: false,
    error: null
  }),

  getters: {
    itemCount: (state): number => state.items.length,

    totalPrice: (state): number => {
      const total = state.items.reduce((total, item) => total + item.totalPrice, 0)
      return Math.round(total) // 소수점 제거하여 정수로 반환
    },

    getItemById: (state): ((id: string) => CartItem | undefined) => {
      return (id: string) => state.items.find(item => item.id === id)
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
    },

    async submitOrder(paymentMethod: PaymentMethod): Promise<void> {
      const { withErrorHandling, showSuccess } = globalErrorHandler

      if (this.items.length === 0) {
        throw new Error('장바구니가 비어있습니다.')
      }

      const orderData: OrderCreateRequest = {
        tableNumber: this.tableNumber,
        items: this.items.map(item => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
          selectedSize: item.selectedSize,
          selectedExtras: item.selectedExtras,
          unitPrice: item.totalPrice / item.quantity,
          totalPrice: item.totalPrice
        })),
        paymentMethod,
        totalAmount: this.totalPrice
      }

      const result = await withErrorHandling(
        async () => {
          const response = await orderApiService.create(orderData)

          if (response.success) {
            showSuccess(`주문이 완료되었습니다! 주문번호: ${response.data.orderNumber}`)
            return true
          } else {
            throw new Error('주문 처리에 실패했습니다.')
          }
        },
        '주문 제출',
        () => this.submitOrder(paymentMethod)
      )

      if (!result) {
        this.error = '주문 처리 중 오류가 발생했습니다.'
        throw new Error(this.error)
      }
    },

    async getCurrentTableOrder(): Promise<any> {
      const { withErrorHandling } = globalErrorHandler

      return await withErrorHandling(
        async () => {
          const response = await orderApiService.getTableOrder(this.tableNumber)

          if (response.success) {
            return response.data
          } else {
            return null
          }
        },
        '현재 주문 조회'
      )
    },

    clearError(): void {
      this.error = null
    }
  }
})