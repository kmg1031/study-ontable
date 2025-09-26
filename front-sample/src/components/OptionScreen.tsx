import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { MenuItem, CartItem } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface OptionScreenProps {
  menuItem: MenuItem;
  onConfirm: (cartItem: CartItem) => void;
  onBack: () => void;
}

export function OptionScreen({ menuItem, onConfirm, onBack }: OptionScreenProps) {
  const [selectedSize, setSelectedSize] = useState<string>(
    menuItem.options?.sizes?.[0]?.name || ''
  );
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);

  const getSizePrice = () => {
    if (!menuItem.options?.sizes || !selectedSize) return 0;
    const size = menuItem.options.sizes.find(s => s.name === selectedSize);
    return size?.price || 0;
  };

  const getExtrasPrice = () => {
    if (!menuItem.options?.extras) return 0;
    return selectedExtras.reduce((total, extraName) => {
      const extra = menuItem.options?.extras?.find(e => e.name === extraName);
      return total + (extra?.price || 0);
    }, 0);
  };

  const getTotalPrice = () => {
    return (menuItem.price + getSizePrice() + getExtrasPrice()) * quantity;
  };

  const handleExtraToggle = (extraName: string) => {
    setSelectedExtras(prev => 
      prev.includes(extraName)
        ? prev.filter(name => name !== extraName)
        : [...prev, extraName]
    );
  };

  const handleConfirm = () => {
    const cartItem: CartItem = {
      id: `${menuItem.id}-${Date.now()}`,
      menuItem,
      quantity,
      selectedSize: selectedSize || undefined,
      selectedExtras: selectedExtras.length > 0 ? selectedExtras : undefined,
      totalPrice: getTotalPrice()
    };
    onConfirm(cartItem);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1>옵션 선택</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Menu Item Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                <ImageWithFallback 
                  src={menuItem.image}
                  alt={menuItem.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="mb-1">{menuItem.name}</h2>
                    <p className="text-muted-foreground text-sm">
                      {menuItem.description}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs ml-2">
                    {menuItem.category}
                  </Badge>
                </div>
                <div className="mt-2">
                  <span className="text-lg text-primary">
                    {menuItem.price.toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Size Options */}
        {menuItem.options?.sizes && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">사이즈 선택</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
                {menuItem.options.sizes.map((size) => (
                  <div key={size.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value={size.name} id={size.name} />
                      <Label htmlFor={size.name}>{size.name}</Label>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {size.price > 0 ? `+${size.price.toLocaleString()}원` : '기본'}
                    </span>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        )}

        {/* Extra Options */}
        {menuItem.options?.extras && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">추가 옵션</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {menuItem.options.extras.map((extra) => (
                  <div key={extra.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={extra.name}
                        checked={selectedExtras.includes(extra.name)}
                        onCheckedChange={() => handleExtraToggle(extra.name)}
                      />
                      <Label htmlFor={extra.name}>{extra.name}</Label>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      +{extra.price.toLocaleString()}원
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quantity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">수량</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-xl w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Fixed Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <Button 
          onClick={handleConfirm}
          className="w-full"
          size="lg"
        >
          장바구니에 담기 · {getTotalPrice().toLocaleString()}원
        </Button>
      </div>

      {/* Bottom Spacing */}
      <div className="h-20"></div>
    </div>
  );
}