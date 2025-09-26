import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import {
  ArrowLeft,
  MapPin,
  Clock,
  CreditCard,
  Smartphone,
  Banknote,
} from "lucide-react";
import { CartItem } from "../App";

interface OrderScreenProps {
  cartItems: CartItem[];
  totalPrice: number;
  tableNumber: number;
  onBack: () => void;
  onOrderComplete: () => void;
}

export function OrderScreen({
  cartItems,
  totalPrice,
  tableNumber,
  onBack,
  onOrderComplete,
}: OrderScreenProps) {
  const [paymentMethod, setPaymentMethod] =
    useState<string>("card");
  const [isOrdering, setIsOrdering] = useState(false);

  const getItemDisplayName = (item: CartItem) => {
    let name = item.menuItem.name;
    if (item.selectedSize) {
      name += ` (${item.selectedSize})`;
    }
    return name;
  };

  const getItemExtrasText = (item: CartItem) => {
    if (
      !item.selectedExtras ||
      item.selectedExtras.length === 0
    )
      return "";
    return item.selectedExtras.join(", ");
  };

  const handleOrder = async () => {
    setIsOrdering(true);

    // 주문 처리 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsOrdering(false);
    onOrderComplete();
  };

  const paymentMethods = [
    { id: "card", name: "신용카드", icon: CreditCard },
    { id: "mobile", name: "모바일페이", icon: Smartphone },
    { id: "cash", name: "현금", icon: Banknote },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1>주문하기</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Table Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <h3>테이블 {tableNumber}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>예상 조리시간: 15-20분</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              주문 내역
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cartItems.map((item, index) => (
                <div key={item.id}>
                  {index > 0 && <Separator className="my-3" />}
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span>{getItemDisplayName(item)}</span>
                        <Badge
                          variant="outline"
                          className="text-xs"
                        >
                          {item.quantity}개
                        </Badge>
                      </div>
                      {getItemExtrasText(item) && (
                        <p className="text-sm text-muted-foreground">
                          옵션: {getItemExtrasText(item)}
                        </p>
                      )}
                    </div>
                    <span className="text-sm">
                      {item.totalPrice.toLocaleString()}원
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              결제 방법
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={paymentMethod}
              onValueChange={setPaymentMethod}
            >
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <div
                    key={method.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent/50"
                  >
                    <RadioGroupItem
                      value={method.id}
                      id={method.id}
                    />
                    <Icon className="w-5 h-5 text-muted-foreground" />
                    <Label
                      htmlFor={method.id}
                      className="flex-1 cursor-pointer"
                    >
                      {method.name}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Price Summary */}
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>주문 금액</span>
                <span>{totalPrice.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>배달비</span>
                <span>0원</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>총 결제금액</span>
                <span className="text-lg text-primary">
                  {totalPrice.toLocaleString()}원
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Fixed Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border">
        <Button
          onClick={handleOrder}
          disabled={isOrdering}
          className="w-full"
          size="lg"
        >
          {isOrdering
            ? "주문 처리중..."
            : `${totalPrice.toLocaleString()}원 결제하기`}
        </Button>
      </div>

      {/* Bottom Spacing */}
      <div className="h-20"></div>
    </div>
  );
}