"use client";

import { useState, useEffect } from 'react';
import { supabase, type OtherPayment } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { DollarSign, Wallet, QrCode } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function OtherPayments() {
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [showUPIModal, setShowUPIModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [payments, setPayments] = useState<OtherPayment[]>([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('other_payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const handlePayment = async (paymentMethod: 'cash' | 'upi') => {
    if (!customerName || !amount || !description) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount.',
        variant: 'destructive',
      });
      return;
    }

    if (paymentMethod === 'upi') {
      setShowUPIModal(true);
      return;
    }

    await processPayment(paymentMethod);
  };

  const processPayment = async (paymentMethod: 'cash' | 'upi') => {
    setProcessing(true);

    try {
      const { error } = await supabase.from('other_payments').insert({
        customer_name: customerName,
        customer_phone: customerPhone || null,
        amount: parseFloat(amount),
        payment_method: paymentMethod,
        description: description,
      });

      if (error) throw error;

      toast({
        title: 'Payment Recorded',
        description: `Payment of ₹${amount} has been saved.`,
      });

      setCustomerName('');
      setCustomerPhone('');
      setAmount('');
      setDescription('');
      setShowUPIModal(false);
      fetchPayments();
    } catch (error) {
      console.error('Error recording payment:', error);
      toast({
        title: 'Error',
        description: 'Failed to record payment.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="border-2 border-orange-300">
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No payments recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="border-2 border-gray-200 p-4 rounded-lg hover:border-orange-300 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-bold">{payment.customer_name}</p>
                        {payment.customer_phone && (
                          <p className="text-sm text-muted-foreground">{payment.customer_phone}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-orange-600">
                          ₹{payment.amount.toFixed(2)}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {payment.payment_method}
                        </p>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 rounded-md">
                      <p className="text-sm">{payment.description}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(payment.created_at).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-4 border-2 border-orange-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Record Payment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Customer Name *</Label>
              <Input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter name"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Phone Number (Optional)</Label>
              <Input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Phone number"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Amount (₹) *</Label>
              <Input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Description *</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this payment for?"
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="border-t pt-4">
              <p className="text-2xl font-bold text-orange-600 mb-4 text-center">
                ₹{amount || '0.00'}
              </p>

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
            <p className="text-lg font-semibold mb-2">₹{amount}</p>
            <p className="text-sm text-muted-foreground mb-6">
              Customer can scan this QR code to pay
            </p>
            <Button
              onClick={() => processPayment('upi')}
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Payment Received - Record'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
