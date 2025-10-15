"use client";

import { useEffect, useState } from 'react';
import { supabase, type Product } from '@/lib/supabase';
import { useCartStore } from '@/lib/cart-store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Sparkles, Info, Package, MapPin, Phone } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

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
            <Link href="/about">
              <Button variant="secondary" size="sm" className="shadow-md hidden md:inline-flex">
                <Info className="w-5 h-5 mr-2" />
                About Us
              </Button>
            </Link>
             <Link href="/bulk-order">
              <Button variant="secondary" size="sm" className="shadow-md hidden md:inline-flex">
                <Package className="w-5 h-5 mr-2" />
                Bulk Order
              </Button>
            </Link>
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
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-red-500 to-orange-600 font-script leading-tight mb-2">
            Diwali Special 2025
          </h2>
          <p className="text-2xl md:text-3xl font-bold text-red-600 mt-4 leading-snug">
            SWEETS & NAMKEEN
          </p>
          <div className="flex gap-4 justify-center mt-6 md:hidden">
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
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {sweets.filter(s => !s.is_on_order).slice(0, 4).map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                ))}
              </div>
            </section>

            <section className="mb-12">
              <div className="bg-gradient-to-r from-orange-200 via-amber-200 to-yellow-200 rounded-3xl p-4 md:p-8 border-4 border-orange-400 shadow-2xl">
                <h3 className="text-4xl font-bold text-orange-800 mb-8 text-center font-script">
                  All Sweets
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {sweets.filter(s => !s.is_on_order).map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                  ))}
                </div>
              </div>
            </section>

            <section className="mb-12">
              <div className="bg-gradient-to-r from-yellow-200 via-amber-200 to-orange-200 rounded-3xl p-4 md:p-8 border-4 border-orange-400 shadow-2xl">
                <h3 className="text-4xl font-bold text-orange-800 mb-8 text-center font-script">
                  Premium Namkeen
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {namkeen.filter(n => !n.is_on_order).map((product) => (
                    <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
                  ))}
                </div>
              </div>
            </section>

            {onOrder.length > 0 && (
              <section className="mb-12">
                <div className="bg-gradient-to-r from-red-100 via-orange-100 to-yellow-100 rounded-3xl p-4 md:p-8 border-4 border-red-400 shadow-2xl">
                  <h3 className="text-4xl font-bold text-red-700 mb-4 text-center font-script">
                    ON ORDER
                  </h3>
                  <p className="text-center text-red-600 font-semibold mb-8">
                    (Order by Oct 14th)
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

      <footer className="bg-gradient-to-r from-orange-600 via-orange-700 to-amber-700 text-white pt-16 pb-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div>
              <h3 className="text-2xl font-bold mb-4 font-script">Veermani Kitchen's</h3>
              <p className="text-sm opacity-90">
                Your trusted source for authentic, homemade sweets and namkeen prepared with the finest ingredients and time-honored recipes.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="opacity-90 hover:opacity-100 transition-opacity">Home</Link></li>
                <li><Link href="/about" className="opacity-90 hover:opacity-100 transition-opacity">About Us</Link></li>
                <li><Link href="/bulk-order" className="opacity-90 hover:opacity-100 transition-opacity">Bulk Orders</Link></li>
                <li><Link href="/cart" className="opacity-90 hover:opacity-100 transition-opacity">Your Cart</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact & Visit</h3>
              <div className="space-y-2 text-sm">
                <a href="tel:9425314543" className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity">
                  <Phone className="w-4 h-4" />
                  <span>9425314543, 9425314545</span>
                </a>
                <a href="https://share.google/IsmC9CtfQ19zmrhzx" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 opacity-90 hover:opacity-100 transition-opacity">
                  <MapPin className="w-4 h-4" />
                  <span>[Your Address Here], Indore, MP</span>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-orange-500/50 mt-8 pt-6 text-center text-sm opacity-80">
            <p>© {new Date().getFullYear()} Veermani Kitchen's. All rights reserved.</p>
          </div>
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
    <Card className="overflow-hidden rounded-xl border-2 border-orange-200/80 hover:border-orange-400 transition-all duration-300 shadow-sm hover:shadow-xl bg-white flex flex-col">
      <CardContent className="p-0 flex flex-col flex-grow">
        <div className="relative w-full aspect-square overflow-hidden">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-orange-50 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-orange-200"/>
            </div>
          )}
           {isOnOrder && (
              <Badge variant="destructive" className="absolute top-2 right-2 text-xs">
                On Order
              </Badge>
            )}
        </div>
        <div className="p-4 bg-white flex flex-col flex-grow">
          <div className="flex-grow">
            <h4 className="text-base md:text-lg font-bold text-orange-900 leading-tight">{product.name}</h4>
            <p className="text-xs text-muted-foreground">({product.name_english})</p>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-orange-600">₹{product.price_per_kg}</span>
              <span className="text-xs text-muted-foreground">/ Kg</span>
            </div>
             <Button
              onClick={() => onAddToCart(product)}
              size="sm"
              className="bg-orange-500 hover:bg-orange-600 rounded-lg"
            >
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}