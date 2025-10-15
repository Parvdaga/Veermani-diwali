"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Phone, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 p-4">
      <div className="container mx-auto max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-orange-700 font-script mb-2">
            Veermani Kitchen's
          </h1>
          <p className="text-xl text-orange-600">श्री तिलकेश्वर पार्श्वनाथ नमः</p>
        </div>

        <Card className="border-2 border-orange-300 shadow-xl mb-6">
          <CardContent className="p-8">
            <h2 className="text-3xl font-bold text-orange-800 mb-6">About Us</h2>

            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                Welcome to <strong className="text-orange-700">Veermani Kitchen's</strong>, your trusted
                catering and tiffin service dedicated to serving premium-quality, homely food at
                affordable prices. Established in <strong>2023</strong>, we started with a simple
                mission — to deliver authentic, freshly prepared meals that taste just like home.
              </p>

              <p>
                At Veermani Kitchen’s, we believe that food should bring comfort, joy, and togetherness.
                Whether you’re a student missing home-cooked meals, a working professional looking for
                healthy tiffin options, or someone hosting an event, we prepare every dish with care,
                using only fresh and high-quality ingredients.
              </p>

              <p>
                Our team takes pride in maintaining the perfect balance between taste, nutrition, and hygiene.
                Every meal is cooked in small batches to preserve freshness, using traditional recipes and
                premium ingredients that ensure a wholesome dining experience.
              </p>

              <p>
                During the <strong>festive seasons</strong>, especially <strong>Diwali</strong>, we bring to you
                a special collection of <strong>sweets and namkeen</strong> — from rich, creamy
                <em> Kaju Katli </em> to our crispy, flavorful namkeen varieties. Each item is made
                using <strong>pure ghee, premium dry fruits</strong>, and authentic family recipes passed
                down through generations.
              </p>

              <p className="font-semibold text-orange-700">
                Whether it’s your everyday meal, an event, or festive celebrations, Veermani Kitchen’s
                is here to serve you with love, tradition, and taste that feels like home.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-400 bg-gradient-to-r from-orange-100 to-amber-100 shadow-xl">
          <CardContent className="p-8 text-center">
            <Phone className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-orange-800 mb-4">Get in Touch</h3>
            <p className="text-lg mb-2">For orders, catering, or inquiries:</p>
            <p className="text-2xl font-bold text-orange-700 mb-4">
              📞 9425314543, 9425314545
            </p>
            <p className="text-sm text-muted-foreground">
              Bringing you the taste of home — one meal at a time!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
