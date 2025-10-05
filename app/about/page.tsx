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
                Welcome to <strong className="text-orange-700">Veermani Kitchen's</strong>, your trusted source for authentic,
                homemade sweets and namkeen since generations. We take pride in preparing traditional Indian delicacies
                with the finest ingredients and time-honored recipes passed down through our family.
              </p>

              <p>
                Our Diwali Special collection features an exquisite range of premium sweets and savory snacks,
                carefully crafted to make your festivals truly memorable. From the rich and creamy Kaju Katli to
                the crispy and flavorful namkeen varieties, every item is prepared with love and attention to detail.
              </p>

              <p>
                We use only pure ghee, premium dry fruits, and the highest quality ingredients to ensure that every
                bite delivers authentic taste and superior quality. Our commitment to hygiene and freshness is unwavering,
                and we prepare everything in small batches to maintain the perfect texture and flavor.
              </p>

              <p className="font-semibold text-orange-700">
                Whether it's for Diwali celebrations, special occasions, or simply treating yourself to something delicious,
                Veermani Kitchen's is here to serve you with the best traditional sweets and namkeen.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-400 bg-gradient-to-r from-orange-100 to-amber-100 shadow-xl">
          <CardContent className="p-8 text-center">
            <Phone className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-orange-800 mb-4">Get in Touch</h3>
            <p className="text-lg mb-2">For orders and inquiries:</p>
            <p className="text-2xl font-bold text-orange-700 mb-4">
              📞 9425314543, 9425314545
            </p>
            <p className="text-sm text-muted-foreground">
              We're here to make your celebrations sweeter!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
