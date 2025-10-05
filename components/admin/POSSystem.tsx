"use client";

import { useEffect, useState } from 'react';
import { supabase, type Product, type OrderItem } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plus, Minus, Trash2, ShoppingCart, Wallet, QrCode } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type CartItem = {
  product: Product;
  quantity_kg: number;
};

export default function POSSystem() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_available', true)
        .order('display_order');

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity_kg: item.quantity_kg + 0.5 }
            : item
        )
      );
    } else {
      setCart([...cart, { product, quantity_kg: 0.5 }]);
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(cart.filter((item) => item.product.id !== productId));
    } else {
      setCart(
        cart.map((item) =>
          item.product.id === productId ? { ...item, quantity_kg: quantity } : item
        )
      );
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.product.id !== productId));
  };

  const getTotalAmount = () => {
    return cart.reduce(
      (total, item) => total + item.product.price_per_kg * item.quantity_kg,
      0
    );
  };

  const handlePayment = async (paymentMethod: 'cash' | 'upi') => {
    if (!customerName || !customerPhone) {
      toast({
        title: 'Missing Information',
        description: 'Please enter customer name and phone number.',
        variant: 'destructive',
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: 'Empty Cart',
        description: 'Please add items to the cart.',
        variant: 'destructive',
      });
      return;
    }

    if (paymentMethod === 'upi') {
      setShowUPIModal(true);
      return;
    }

    await processOrder(paymentMethod);
  };

  const processOrder = async (paymentMethod: 'cash' | 'upi') => {
    setProcessing(true);

    try {
      const orderNumber = `VK${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

      const orderItems: OrderItem[] = cart.map((item) => ({
        product_id: item.product.id,
        product_name: item.product.name,
        quantity_kg: item.quantity_kg,
        price_per_kg: item.product.price_per_kg,
        subtotal: item.product.price_per_kg * item.quantity_kg,
      }));

      const { error } = await supabase.from('orders').insert({
        order_number: orderNumber,
        customer_name: customerName,
        customer_phone: customerPhone,
        order_type: 'counter',
        items: orderItems,
        total_amount: getTotalAmount(),
        status: 'completed',
        payment_method: paymentMethod,
        fulfillment_type: 'take_away',
        custom_packing: false,
      });

      if (error) throw error;

      toast({
        title: 'Order Completed!',
        description: `Order ${orderNumber} has been saved.`,
      });

      setCart([]);
      setCustomerName('');
      setCustomerPhone('');
      setShowUPIModal(false);
    } catch (error) {
      console.error('Error processing order:', error);
      toast({
        title: 'Error',
        description: 'Failed to process order.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name_english.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <Card className="border-2 border-orange-300">
          <CardHeader>
            <CardTitle>Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[60vh] overflow-y-auto">
              {filteredProducts.map((product) => (
                <Button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  variant="outline"
                  className="h-auto flex-col items-start p-4 border-2 hover:border-orange-400"
                >
                  <p className="font-bold text-sm">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.name_english}</p>
                  <p className="text-orange-600 font-semibold mt-2">₹{product.price_per_kg}/Kg</p>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-4 border-2 border-orange-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Current Bill
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Customer Name</Label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter name"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Phone Number</Label>
              <Input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Phone number"
                className="mt-1"
              />
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Items</h4>
              <div className="space-y-2 max-h-[30vh] overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No items in cart
                  </p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="bg-orange-50 p-2 rounded-md flex items-center gap-2"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{item.product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ₹{item.product.price_per_kg}/Kg
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity_kg - 0.25)
                          }
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-sm w-12 text-center">{item.quantity_kg}kg</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6"
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity_kg + 0.25)
                          }
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-6 w-6 ml-1"
                          onClick={() => removeFromCart(item.product.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-sm font-bold w-20 text-right">
                        ₹{(item.product.price_per_kg * item.quantity_kg).toFixed(2)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-2xl font-bold mb-4">
                <span>Total</span>
                <span className="text-orange-600">₹{getTotalAmount().toFixed(2)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handlePayment('cash')}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={processing}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Cash
                </Button>
                <Button
                  onClick={() => handlePayment('upi')}
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={processing}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  UPI
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showUPIModal} onOpenChange={setShowUPIModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>UPI Payment</DialogTitle>
          </DialogHeader>
          <div className="text-center p-6">
            <div className="bg-gray-100 w-64 h-64 mx-auto rounded-lg flex items-center justify-center mb-4">
              <QrCode className="w-32 h-32 text-gray-400" />
              <p className="absolute text-sm text-gray-600">QR Code Placeholder</p>
            </div>
            <p className="text-lg font-semibold mb-2">₹{getTotalAmount().toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mb-6">
              Customer can scan this QR code to pay
            </p>
            <Button
              onClick={() => processOrder('upi')}
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Payment Received - Complete Order'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
