import React from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CartScreenProps {
  cartItems: CartItem[];
  totalPrice: number;
  onUpdateItem: (id: string, updates: Partial<CartItem>) => void;
  onRemoveItem: (id: string) => void;
  onBack: () => void;
  onOrder: () => void;
}

export function CartScreen({ 
  cartItems, 
  totalPrice, 
  onUpdateItem, 
  onRemoveItem, 
  onBack, 
  onOrder 
}: CartScreenProps) {

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemoveItem(id);
      return;
    }
    
    const item = cartItems.find(item => item.id === id);
    if (!item) return;
    
    const basePrice = item.menuItem.price;
    const sizePrice = item.selectedSize && item.menuItem.options?.sizes 
      ? item.menuItem.options.sizes.find(s => s.name === item.selectedSize)?.price || 0
      : 0;
    const extrasPrice = item.selectedExtras && item.menuItem.options?.extras
      ? item.selectedExtras.reduce((total, extraName) => {
          const extra = item.menuItem.options?.extras?.find(e => e.name === extraName);
          return total + (extra?.price || 0);
        }, 0)
      : 0;
    
    const unitPrice = basePrice + sizePrice + extrasPrice;
    const newTotalPrice = unitPrice * newQuantity;
    
    onUpdateItem(id, { 
      quantity: newQuantity, 
      totalPrice: newTotalPrice 
    });
  };

  const getItemDisplayName = (item: CartItem) => {
    let name = item.menuItem.name;
    if (item.selectedSize) {
      name += ` (${item.selectedSize})`;
    }
    return name;
  };

  const getItemExtrasText = (item: CartItem) => {
    if (!item.selectedExtras || item.selectedExtras.length === 0) return '';
    return item.selectedExtras.join(', ');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1>장바구니</h1>
          <Badge variant="secondary" className="ml-auto">
            {cartItems.length}개 상품
          </Badge>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-lg mb-2">장바구니가 비어있습니다</p>
          <p className="text-sm">메뉴를 선택해주세요</p>
        </div>
      ) : (
        <>
          <div className="p-4 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                      <ImageWithFallback 
                        src={item.menuItem.image}
                        alt={item.menuItem.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="truncate">{getItemDisplayName(item)}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {getItemExtrasText(item) && (
                        <p className="text-sm text-muted-foreground mb-2">
                          옵션: {getItemExtrasText(item)}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <span className="text-primary">
                          {item.totalPrice.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <div className="p-4 border-t border-border bg-muted/30">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg">총 결제금액</span>
              <span className="text-xl text-primary">
                {totalPrice.toLocaleString()}원
              </span>
            </div>
            
            <Button 
              onClick={onOrder}
              className="w-full"
              size="lg"
              disabled={cartItems.length === 0}
            >
              주문하기
            </Button>
          </div>
        </>
      )}

      {/* Bottom Spacing */}
      <div className="h-20"></div>
    </div>
  );
}