// =============================================================================
// Core Data Types
// =============================================================================

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  isAvailable?: boolean
  prepTime?: number
  options?: MenuOptions
}

export interface MenuOptions {
  sizes?: MenuOption[]
  extras?: MenuOption[]
}

export interface MenuOption {
  name: string
  price: number
}

export interface CartItem {
  id: string
  menuItem: MenuItem
  quantity: number
  selectedSize?: string
  selectedExtras?: string[]
  totalPrice: number
}

// =============================================================================
// Component Props Types
// =============================================================================

export interface ButtonProps {
  variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  icon?: any // Vue component type
}

export interface CardProps {
  title?: string
  description?: string
  footer?: string
  padding?: 'sm' | 'md' | 'lg'
  clickable?: boolean
}

export interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export interface QuantityControlProps {
  quantity: number
  min?: number
  max?: number
  disabled?: boolean
}

export interface MenuCardProps {
  menuItem: MenuItem
}

export interface CartItemCardProps {
  cartItem: CartItem
}

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  centered?: boolean
}

export interface SkeletonCardProps {
  padding?: 'sm' | 'md' | 'lg'
  showHeader?: boolean
  showContent?: boolean
  showFooter?: boolean
  showImage?: boolean
}

export interface ErrorMessageProps {
  title?: string
  message: string
  type?: 'error' | 'warning' | 'info'
  padding?: 'sm' | 'md' | 'lg'
  showRetry?: boolean
}

export interface EmptyStateProps {
  title?: string
  description?: string
  icon?: any // Vue component type
  emoji?: string
  size?: 'sm' | 'md' | 'lg'
  centered?: boolean
}

export interface ToastProps {
  title?: string
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  duration?: number
  closable?: boolean
}

// =============================================================================
// Store Types
// =============================================================================

export interface MenuState {
  menuItems: MenuItem[]
  isLoading: boolean
  error: string | null
}

export interface CartState {
  items: CartItem[]
  tableNumber: number
  isLoading: boolean
  error: string | null
}

// =============================================================================
// Utility Types
// =============================================================================

export type PaymentMethod = 'card' | 'mobile' | 'cash'

export interface TossPaymentsConfig {
  clientKey: string
  customerKey: string
}

export interface OrderInfo {
  orderName: string
  amount: number
  customerName: string
  customerEmail: string
  customerMobilePhone: string
}

// =============================================================================
// Event Types
// =============================================================================

export interface QuantityChangeEvent {
  itemId: string
  quantity: number
}

export interface MenuSelectEvent {
  menuItem: MenuItem
}

export interface CartUpdateEvent {
  cartItem: CartItem
}