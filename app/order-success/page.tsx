"use client";

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CircleCheck as CheckCircle2, MapPin } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-2 border-green-400 shadow-2xl">
        <CardContent className="p-6 sm:p-12 text-center">
          <CheckCircle2 className="w-24 h-24 text-green-600 mx-auto mb-6" />

          <h1 className="text-4xl font-bold text-green-700 mb-4">Order Placed Successfully!</h1>

          {orderNumber && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
              <p className="text-sm text-muted-foreground mb-2">Your Order Number</p>
              <p className="text-3xl font-bold text-green-700">{orderNumber}</p>
            </div>
          )}

          <div className="space-y-4 text-lg text-muted-foreground mb-8">
            <p>Thank you! We have received your order and will prepare it fresh for you.</p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="font-semibold text-yellow-800 mb-2">💰 Payment Information</p>
              <p className="text-sm">
                Payment will be collected in-store via <strong>Cash</strong> or <strong>UPI</strong> when you pick up your order.
              </p>
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Pickup Location</h3>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <div className="w-32 h-32 bg-white p-1 rounded-md border shrink-0">
                    <Image src="/location qr.png" alt="Location QR Code" width={128} height={128} />
                </div>
                <div className="text-left">
                    <p className="font-semibold">Veermani Kitchen's</p>
                    <p className="text-muted-foreground text-sm">
                        Vardhman Manglik Bhavan, Tilak nagar Extension, Tilak Nagar, Indore
                    </p>
                    <a 
                        href="https://share.google/IsmC9CtfQ19zmrhzx" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-orange-600 hover:underline mt-2 inline-flex items-center gap-1"
                    >
                        <MapPin className="w-4 h-4"/>
                        Get Directions
                    </a>
                </div>
            </div>
          </div>
          
          <div className="mt-8">
            <Link href="/">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                Back to Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}