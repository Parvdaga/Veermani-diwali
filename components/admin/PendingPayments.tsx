"use client";

import { useEffect, useState } from 'react';
import { supabase, type Order } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { sendInvoiceViaWhatsApp } from '@/lib/whatsapp';
import { Wallet, QrCode, MessageSquare } from 'lucide-react';

export default function PendingPayments() {
  const { toast } = useToast();
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingOrders();

    const subscription = supabase
      .channel('pending-orders-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => fetchPendingOrders()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchPendingOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('payment_method', 'pending')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setPendingOrders(data || []);
    } catch (error) {
      console.error('Error fetching pending orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (order: Order, paymentMethod: 'cash' | 'upi') => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_method: paymentMethod, status: 'completed' })
        .eq('id', order.id);

      if (error) throw error;

      fetchPendingOrders();

      toast({
        title: 'Payment Completed',
        description: `Order ${order.order_number} has been marked as paid with ${paymentMethod}.`,
        action: (
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full flex items-center justify-center bg-green-600 text-white hover:bg-green-700"
            onClick={() =>
              sendInvoiceViaWhatsApp({
                phone: order.customer_phone.trim(),
                orderNumber: order.order_number,
                customerName: order.customer_name,
                items: order.items,
                totalAmount: order.total_amount,
                createdAt: order.created_at,
                fulfillmentType: order.fulfillment_type,
              })
            }
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Send WhatsApp
          </Button>
        ),
      });
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: 'Update Failed',
        description: 'Could not update the payment status.',
        variant: 'destructive',
      });
    }
  };

  const handleSendWhatsApp = (order: Order) => {
    if (!order.customer_phone) {
      toast({
        title: 'Missing Phone Number',
        description: 'This order does not have a valid phone number.',
        variant: 'destructive',
      });
      return;
    }

    sendInvoiceViaWhatsApp({
      phone: order.customer_phone.trim(),
      orderNumber: order.order_number,
      customerName: order.customer_name,
      items: order.items,
      totalAmount: order.total_amount,
      createdAt: order.created_at,
      fulfillmentType: order.fulfillment_type,
    });
  };

  if (loading) {
    return <div className="text-center py-12">Loading pending payments...</div>;
  }

  return (
    <Card className="border-2 border-orange-300">
      <CardHeader>
        <CardTitle>Orders with Pending Payments</CardTitle>
      </CardHeader>
      <CardContent>
        {pendingOrders.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No pending payments found.</p>
        ) : (
          <div className="space-y-4">
            {pendingOrders.map((order) => (
              <div
                key={order.id}
                className="border-2 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4"
              >
                <div className="flex-1">
                  <p className="font-bold">
                    {order.customer_name} ({order.customer_phone})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Order: {order.order_number}
                  </p>
                  <p className="text-lg font-bold text-orange-600 mt-1">
                    ₹{order.total_amount.toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-2">
                  <Button
                    onClick={() => markAsPaid(order, 'cash')}
                    className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
                  >
                    <Wallet className="w-4 h-4 mr-2" /> Paid by Cash
                  </Button>
                  <Button
                    onClick={() => markAsPaid(order, 'upi')}
                    className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
                  >
                    <QrCode className="w-4 h-4 mr-2" /> Paid by UPI
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSendWhatsApp(order)}
                    className="border-green-600 text-green-700 hover:bg-green-50 w-full md:w-auto"
                  >
                    <MessageSquare className="w-4 h-4 mr-2" /> Send WhatsApp
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
