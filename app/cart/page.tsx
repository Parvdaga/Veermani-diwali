"use client";

import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const [hydrated, setHydrated] = useState(false);
  const { items, updateQuantity, removeItem, customPacking, setCustomPacking, getTotalAmount } = useCartStore();

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated || items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 p-4">
        <div className="container mx-auto max-w-2xl">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Card className="p-12 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some delicious items to get started!</p>
            <Link href="/">
              <Button className="bg-orange-500 hover:bg-orange-600">
                Browse Products
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>

        <h1 className="text-4xl font-bold text-orange-700 mb-6 font-script">Your Cart</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="border-2 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-orange-800">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">({item.name_english})</p>
                      <p className="text-orange-600 font-semibold mt-1">₹{item.price_per_kg}/Kg</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity_kg - 0.25)}
                        className="h-8 w-8"
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input
                        type="number"
                        value={item.quantity_kg}
                        onChange={(e) => updateQuantity(item.id, parseFloat(e.target.value) || 0)}
                        className="w-20 text-center"
                        step="0.25"
                        min="0.25"
                      />
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity_kg + 0.25)}
                        className="h-8 w-8"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-lg">₹{(item.price_per_kg * item.quantity_kg).toFixed(2)}</p>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeItem(item.id)}
                        className="mt-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Card className="border-2 border-orange-300 bg-orange-50">
              <CardContent className="p-4 flex items-center gap-3">
                <Checkbox
                  id="custom-packing"
                  checked={customPacking}
                  onCheckedChange={(checked) => setCustomPacking(checked as boolean)}
                />
                <label htmlFor="custom-packing" className="flex-1 font-medium cursor-pointer">
                  Add Custom Packing
                </label>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4 border-2 border-orange-400">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Order Summary</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{getTotalAmount().toFixed(2)}</span>
                  </div>
                  {customPacking && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Custom Packing</span>
                      <span>Included</span>
                    </div>
                  )}
                </div>
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-orange-600">₹{getTotalAmount().toFixed(2)}</span>
                  </div>
                </div>
                <Link href="/checkout">
                  <Button className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6">
                    Proceed to Checkout
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
