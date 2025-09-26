import React, { useState } from 'react';
import { MenuScreen } from './components/MenuScreen';
import { OptionScreen } from './components/OptionScreen';
import { CartScreen } from './components/CartScreen';
import { OrderScreen } from './components/OrderScreen';

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  options?: {
    sizes?: { name: string; price: number }[];
    extras?: { name: string; price: number }[];
  };
};

export type CartItem = {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedSize?: string;
  selectedExtras?: string[];
  totalPrice: number;
};

export type Screen = 'menu' | 'option' | 'cart' | 'order';

const menuData: MenuItem[] = [
  {
    id: '1',
    name: '비빔밥',
    description: '신선한 나물과 고추장이 어우러진 전통 비빔밥',
    price: 12000,
    category: '메인 요리',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBmb29kJTIwYmliaW1iYXB8ZW58MXx8fHwxNzU2MTMzMDI3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    options: {
      extras: [
        { name: '계란후라이 추가', price: 2000 },
        { name: '고기 추가', price: 3000 }
      ]
    }
  },
  {
    id: '2',
    name: '치킨 갈비',
    description: '바삭하고 매콤한 한식 치킨 갈비',
    price: 18000,
    category: '메인 요리',
    image: 'https://images.unsplash.com/photo-1687966699414-095ca9c35593?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBmcmllZCUyMGNoaWNrZW58ZW58MXx8fHwxNzU2MTMzMDM4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    options: {
      sizes: [
        { name: '소 (1인분)', price: 0 },
        { name: '중 (2인분)', price: 8000 },
        { name: '대 (3인분)', price: 15000 }
      ]
    }
  },
  {
    id: '3',
    name: '불고기',
    description: '달콤하고 부드러운 한우 불고기',
    price: 25000,
    category: '메인 요리',
    image: 'https://images.unsplash.com/photo-1584278858536-52532423b9ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBidWxnb2dpfGVufDF8fHx8MTc1NjE5MjUwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    options: {
      sizes: [
        { name: '1인분', price: 0 },
        { name: '2인분', price: 20000 }
      ],
      extras: [
        { name: '버섯 추가', price: 3000 },
        { name: '쌈채소 추가', price: 2000 }
      ]
    }
  },
  {
    id: '4',
    name: '김치찌개',
    description: '얼큰하고 시원한 김치찌개',
    price: 8000,
    category: '찌개',
    image: 'https://images.unsplash.com/photo-1708388064278-707e85eaddc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBraW1jaGklMjBqamlnYWV8ZW58MXx8fHwxNzU2MTkyNTExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    options: {
      extras: [
        { name: '라면사리 추가', price: 1000 },
        { name: '치즈 추가', price: 2000 }
      ]
    }
  },
  {
    id: '5',
    name: '소주',
    description: '시원한 소주 한 병',
    price: 4000,
    category: '음료',
    image: 'https://images.unsplash.com/photo-1618159280021-411e72254fad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBkcmlua3MlMjBiZWVyJTIwc29qdXxlbnwxfHx8fDE3NTYxOTI1MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  },
  {
    id: '6',
    name: '맥주',
    description: '시원한 생맥주',
    price: 5000,
    category: '음료',
    image: 'https://images.unsplash.com/photo-1618159280021-411e72254fad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBkcmlua3MlMjBiZWVyJTIwc29qdXxlbnwxfHx8fDE3NTYxOTI1MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
  }
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber] = useState(7);

  const addToCart = (item: CartItem) => {
    setCart(prev => [...prev, item]);
  };

  const updateCartItem = (id: string, updates: Partial<CartItem>) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handleMenuItemSelect = (item: MenuItem) => {
    setSelectedMenuItem(item);
    setCurrentScreen('option');
  };

  const handleOptionConfirm = (cartItem: CartItem) => {
    addToCart(cartItem);
    setCurrentScreen('menu');
    setSelectedMenuItem(null);
  };

  const handleOrderComplete = () => {
    setCart([]);
    setCurrentScreen('menu');
  };

  return (
    <div className="min-h-screen bg-background">
      {currentScreen === 'menu' && (
        <MenuScreen
          menuItems={menuData}
          tableNumber={tableNumber}
          cartItemCount={cart.length}
          onMenuItemSelect={handleMenuItemSelect}
          onCartClick={() => setCurrentScreen('cart')}
        />
      )}

      {currentScreen === 'option' && selectedMenuItem && (
        <OptionScreen
          menuItem={selectedMenuItem}
          onConfirm={handleOptionConfirm}
          onBack={() => setCurrentScreen('menu')}
        />
      )}

      {currentScreen === 'cart' && (
        <CartScreen
          cartItems={cart}
          totalPrice={getTotalPrice()}
          onUpdateItem={updateCartItem}
          onRemoveItem={removeFromCart}
          onBack={() => setCurrentScreen('menu')}
          onOrder={() => setCurrentScreen('order')}
        />
      )}

      {currentScreen === 'order' && (
        <OrderScreen
          cartItems={cart}
          totalPrice={getTotalPrice()}
          tableNumber={tableNumber}
          onBack={() => setCurrentScreen('cart')}
          onOrderComplete={handleOrderComplete}
        />
      )}
    </div>
  );
}