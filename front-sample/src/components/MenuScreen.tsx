import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ShoppingCart, MapPin } from 'lucide-react';
import { MenuItem } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MenuScreenProps {
  menuItems: MenuItem[];
  tableNumber: number;
  cartItemCount: number;
  onMenuItemSelect: (item: MenuItem) => void;
  onCartClick: () => void;
}

export function MenuScreen({ 
  menuItems, 
  tableNumber, 
  cartItemCount, 
  onMenuItemSelect, 
  onCartClick 
}: MenuScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  
  const categories = ['전체', ...Array.from(new Set(menuItems.map(item => item.category)))];
  
  const filteredItems = selectedCategory === '전체' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="text-lg">테이블 {tableNumber}</span>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onCartClick}
            className="relative"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="ml-2">장바구니</span>
            {cartItemCount > 0 && (
              <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {cartItemCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-16 z-10 bg-background border-b border-border px-4 py-3">
        <div className="flex gap-2 overflow-x-auto">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-4">
        {filteredItems.map((item) => (
          <Card 
            key={item.id} 
            className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
            onClick={() => onMenuItemSelect(item)}
          >
            <CardContent className="p-0">
              <div className="flex">
                <div className="flex-1 p-4">
                  <h3 className="mb-2">{item.name}</h3>
                  <p className="text-muted-foreground mb-3 text-sm leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg text-primary">{item.price.toLocaleString()}원</span>
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                </div>
                
                <div className="w-24 h-24 flex-shrink-0">
                  <ImageWithFallback 
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom Spacing */}
      <div className="h-20"></div>
    </div>
  );
}