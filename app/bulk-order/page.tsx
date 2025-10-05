"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';

export default function BulkOrderPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [itemsDescription, setItemsDescription] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName || !customerPhone || !itemsDescription) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from('bulk_orders').insert({
        customer_name: customerName,
        customer_phone: customerPhone,
        items_description: itemsDescription,
        special_instructions: specialInstructions || null,
        status: 'new',
      });

      if (error) throw error;

      toast({
        title: 'Bulk Order Submitted!',
        description: 'We will contact you shortly to confirm your order details.',
      });

      router.push('/');
    } catch (error) {
      console.error('Error submitting bulk order:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your order. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50 p-4">
      <div className="container mx-auto max-w-3xl">
        <Link href="/">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>

        <Card className="border-2 border-orange-400 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100">
            <CardTitle className="text-3xl font-bold text-orange-800 flex items-center gap-3">
              <Package className="w-8 h-8" />
              Bulk Order Form
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              For large orders, please fill in the form below and we will contact you to confirm details and pricing.
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div>
                <Label htmlFor="items">List of Items & Quantities *</Label>
                <Textarea
                  id="items"
                  value={itemsDescription}
                  onChange={(e) => setItemsDescription(e.target.value)}
                  required
                  className="mt-1"
                  rows={6}
                  placeholder="Example:&#10;- Kaju Katli: 10 Kg&#10;- Besan Chakki: 5 Kg&#10;- Chane Ki Dal: 8 Kg"
                />
              </div>

              <div>
                <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                <Textarea
                  id="instructions"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="mt-1"
                  rows={4}
                  placeholder="Any special requests, delivery date preferences, etc."
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-6"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit Bulk Order'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
