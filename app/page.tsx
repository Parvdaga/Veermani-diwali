"use client";

import { useEffect, useState } from 'react';
import { supabase, type Product } from '@/lib/supabase';
import { useCartStore } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Sparkles, User, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);
  const { items, addItem } = useCartStore();
  const { toast } = useToast();

  useEffect(() => {
    setHydrated(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast({
      title: "Product Added",
      description: `${product.name} has been added to your cart.`,
      action: (
        <Link href="/cart">
          <Button variant="secondary" size="sm">
            View Cart
          </Button>
        </Link>
      ),
    });
  };

  const sweets = products.filter((p) => p.category === 'sweets');
  const namkeen = products.filter((p) => p.category === 'namkeen');
  const onOrder = products.filter((p) => p.is_on_order);

  const cartItemCount = hydrated ? items.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 shadow-lg border-b-4 border-orange-600">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white font-script tracking-wide">
                Veermani Kitchen's
              </h1>
              <p className="text-xs text-orange-100">श्री तिलकेश्वर पार्श्वनाथ नमः</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/cart">
              <Button variant="secondary" size="sm" className="relative shadow-md">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="secondary" size="sm" className="shadow-md">
                <User className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 font-script mb-2">
            Diwali Special 2025
          </h2>
          <p className="text-2xl md:text-3xl font-bold text-red-600 mt-4">
            SWEETS & NAMKEEN
          </p>
          <div className="flex gap-4 justify-center mt-6">
            <Link href="/bulk-order">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 shadow-lg">
                Place Bulk Order
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="shadow-lg border-2 border-orange-400">
                About Us
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Loading products...</p>
          </div>
        ) : (
          <>
            <section className="mb-12">
              <h3 className="text-3xl font-bold text-orange-700 mb-6 flex items-center gap-2">
                <Sparkles className="w-8 h-8" />
                Top Selling Sweets
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sweets.filter(s => !s.is_on_order).slice(0, 3).map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                ))}
              </div>
            </section>

            <section className="mb-12">
              <div className="bg-gradient-to-r from-orange-200 via-amber-200 to-yellow-200 rounded-3xl p-8 border-4 border-orange-400 shadow-2xl">
                <h3 className="text-4xl font-bold text-orange-800 mb-8 text-center font-script">
                  All Sweets
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sweets.filter(s => !s.is_on_order).map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                  ))}
                </div>
              </div>
            </section>

            <section className="mb-12">
              <div className="bg-gradient-to-r from-yellow-200 via-amber-200 to-orange-200 rounded-3xl p-8 border-4 border-orange-400 shadow-2xl">
                <h3 className="text-4xl font-bold text-orange-800 mb-8 text-center font-script">
                  Premium Namkeen
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {namkeen.filter(n => !n.is_on_order).map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                  ))}
                </div>
              </div>
            </section>

            {onOrder.length > 0 && (
              <section className="mb-12">
                <div className="bg-gradient-to-r from-red-100 via-orange-100 to-yellow-100 rounded-3xl p-8 border-4 border-red-400 shadow-2xl">
                  <h3 className="text-4xl font-bold text-red-700 mb-4 text-center font-script">
                    ON ORDER
                  </h3>
                  <p className="text-center text-red-600 font-semibold mb-8">
                    (Order by Oct 14th)
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {onOrder.map((product) => (
                      <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} isOnOrder />
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <footer className="bg-gradient-to-r from-orange-600 via-orange-700 to-amber-700 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4 font-script">Contact Us</h3>
          <p className="text-lg mb-2">📞 9425314543, 9425314545</p>
          <p className="text-sm opacity-90 mt-4">
            © 2025 Veermani Kitchen's. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function ProductCard({
  product,
  onAddToCart,
  isOnOrder = false,
}: {
  product: Product;
  onAddToCart: (product: Product) => void;
  isOnOrder?: boolean;
}) {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 border-orange-300 bg-white">
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <h4 className="text-xl font-bold text-orange-800 mb-1">{product.name}</h4>
            <p className="text-sm text-muted-foreground mb-3">({product.name_english})</p>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold text-orange-600">₹{product.price_per_kg}</span>
              <span className="text-sm text-muted-foreground">/ Kg</span>
            </div>
            {isOnOrder && (
              <Badge variant="destructive" className="mb-3">
                Advance Order Only
              </Badge>
            )}
          </div>
          <Button
            onClick={() => onAddToCart(product)}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}