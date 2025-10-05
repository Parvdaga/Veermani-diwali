"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cart-store';
import { supabase, type OrderItem } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const { items, customPacking, getTotalAmount, clearCart } = useCartStore();
  const { toast } = useToast();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [fulfillmentType, setFulfillmentType] = useState<'take_away' | 'parcel'>('take_away');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && items.length === 0) {
      router.push('/cart');
    }
  }, [hydrated, items, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !customerPhone) {
      toast({
        title: 'Missing Information',
        description: 'Please provide your name and phone number.',
        variant: 'destructive',
      });
      return;
    }

    if (fulfillmentType === 'take_away' && (!pickupDate || !pickupTime)) {
      toast({
        title: 'Missing Pickup Details',
        description: 'Please select pickup date and time.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      const orderNumber = `VK${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

      const orderItems: OrderItem[] = items.map((item) => ({
        product_id: item.id,
        product_name: item.name,
        quantity_kg: item.quantity_kg,
        price_per_kg: item.price_per_kg,
        subtotal: item.price_per_kg * item.quantity_kg,
      }));

      const pickupDatetime = fulfillmentType === 'take_away' && pickupDate && pickupTime
        ? new Date(`${pickupDate}T${pickupTime}`).toISOString()
        : null;

      const { error } = await supabase.from('orders').insert({
        order_number: orderNumber,
        customer_name: customerName,
        customer_phone: customerPhone,
        order_type: 'online',
        items: orderItems,
        total_amount: getTotalAmount(),
        status: 'received',
        payment_method: 'pending',
        fulfillment_type: fulfillmentType,
        pickup_datetime: pickupDatetime,
        custom_packing: customPacking,
        special_instructions: specialInstructions || null,
      });

      if (error) throw error;

      clearCart();

      toast({
        title: 'Order Placed Successfully!',
        description: `Your order number is ${orderNumber}. Payment will be collected in-store.`,
      });

      router.push(`/order-success?order=${orderNumber}`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: 'Order Failed',
        description: 'There was an error placing your order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <Link href="/cart">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
        </Link>

        <h1 className="text-4xl font-bold text-orange-700 mb-6 font-script">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-2 border-orange-300">
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      required
                      className="mt-1"
                      placeholder="9425314543"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-300">
                <CardHeader>
                  <CardTitle>Fulfillment Option</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={fulfillmentType} onValueChange={(v) => setFulfillmentType(v as any)}>
                    <div className="flex items-center space-x-2 mb-4">
                      <RadioGroupItem value="take_away" id="take_away" />
                      <Label htmlFor="take_away" className="flex-1 cursor-pointer">Take Away</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="parcel" id="parcel" />
                      <Label htmlFor="parcel" className="flex-1 cursor-pointer">Parcel</Label>
                    </div>
                  </RadioGroup>

                  {fulfillmentType === 'take_away' && (
                    <div className="mt-6 space-y-4 p-4 bg-orange-50 rounded-lg">
                      <div>
                        <Label htmlFor="pickup-date" className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Pickup Date *
                        </Label>
                        <Input
                          id="pickup-date"
                          type="date"
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.target.value)}
                          required
                          className="mt-1"
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      <div>
                        <Label htmlFor="pickup-time" className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Pickup Time *
                        </Label>
                        <Input
                          id="pickup-time"
                          type="time"
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                          required
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  {fulfillmentType === 'parcel' && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        📦 <strong>Note:</strong> Parcel charges will be added afterwards based on your location.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-2 border-orange-300">
                <CardHeader>
                  <CardTitle>Special Instructions (Optional)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any special requests or instructions..."
                    rows={4}
                  />
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-4 border-2 border-orange-400">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {items.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>{item.name} ({item.quantity_kg}kg)</span>
                        <span>₹{(item.price_per_kg * item.quantity_kg).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {customPacking && (
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Custom Packing</span>
                      <span>Included</span>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-orange-600">₹{getTotalAmount().toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
                    <p className="font-semibold mb-1">💰 Payment Information</p>
                    <p className="text-muted-foreground">
                      Payment will be collected in-store via Cash or UPI when you pick up your order.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6"
                    disabled={submitting}
                  >
                    {submitting ? 'Placing Order...' : 'Place Order'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
