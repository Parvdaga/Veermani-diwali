"use client";

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CircleCheck as CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full border-2 border-green-400 shadow-2xl">
        <CardContent className="p-12 text-center">
          <CheckCircle2 className="w-24 h-24 text-green-600 mx-auto mb-6" />

          <h1 className="text-4xl font-bold text-green-700 mb-4">Order Placed Successfully!</h1>

          {orderNumber && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6 mb-6">
              <p className="text-sm text-muted-foreground mb-2">Your Order Number</p>
              <p className="text-3xl font-bold text-green-700">{orderNumber}</p>
            </div>
          )}

          <div className="space-y-4 text-lg text-muted-foreground mb-8">
            <p>Thank you for your order! We have received your order and will prepare it fresh for you.</p>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="font-semibold text-yellow-800 mb-2">💰 Payment Information</p>
              <p className="text-sm">
                Payment will be collected in-store via <strong>Cash</strong> or <strong>UPI</strong> when you pick up your order.
              </p>
            </div>

            <p className="text-sm">
              We will contact you on the phone number you provided to confirm your order details.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
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
