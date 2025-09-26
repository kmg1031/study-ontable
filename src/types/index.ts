// 메뉴 관련 타입 정의
export interface MenuOption {
  name: string
  price: number
}

export interface MenuOptions {
  sizes?: MenuOption[]
  extras?: MenuOption[]
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  options?: MenuOptions
}

// 장바구니 관련 타입 정의
export interface CartItem {
  id: string
  menuItem: MenuItem
  quantity: number
  selectedSize?: string
  selectedExtras?: string[]
  totalPrice: number
}

// 화면/라우팅 관련 타입 정의
export type Screen = 'menu' | 'option' | 'cart' | 'order'

// 결제 관련 타입 정의
export type PaymentMethod = 'card' | 'mobile' | 'cash'

export interface PaymentInfo {
  method: PaymentMethod
  amount: number
  tableNumber: number
}

// API 응답 타입 정의
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// 주문 관련 타입 정의
export interface Order {
  id: string
  tableNumber: number
  items: CartItem[]
  totalPrice: number
  paymentMethod: PaymentMethod
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed'
  createdAt: Date
  estimatedTime?: number
}

// 컴포넌트 Props 타입 정의
export interface MenuScreenProps {
  menuItems: MenuItem[]
  tableNumber: number
  cartItemCount: number
  onMenuItemSelect: (item: MenuItem) => void
  onCartClick: () => void
}

export interface OptionScreenProps {
  menuItem: MenuItem
  onConfirm: (cartItem: CartItem) => void
  onBack: () => void
}

export interface CartScreenProps {
  cartItems: CartItem[]
  totalPrice: number
  onUpdateItem: (id: string, updates: Partial<CartItem>) => void
  onRemoveItem: (id: string) => void
  onBack: () => void
  onOrder: () => void
}

export interface OrderScreenProps {
  cartItems: CartItem[]
  totalPrice: number
  tableNumber: number
  onBack: () => void
  onOrderComplete: () => void
}

// UI 컴포넌트 Props 타입 정의
export interface ButtonProps {
  variant?: 'default' | 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  icon?: any
  fullWidth?: boolean
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
  onQuantityChange: (quantity: number) => void
}

// 비즈니스 컴포넌트 Props 타입 정의
export interface MenuCardProps {
  menuItem: MenuItem
  onClick: (item: MenuItem) => void
}

export interface CartItemProps {
  cartItem: CartItem
  onQuantityChange: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}