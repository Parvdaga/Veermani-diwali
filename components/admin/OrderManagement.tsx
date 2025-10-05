"use client";

import { useEffect, useState } from 'react';
import { supabase, type Order } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Clock, Package, CircleCheck as CheckCircle, Circle as XCircle, Phone, User } from 'lucide-react';

export default function OrderManagement() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();

    const subscription = supabase
      .channel('orders-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('order_type', 'online')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: 'Status Updated',
        description: `Order status changed to ${status}`,
      });

      fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: 'Error',
        description: 'Failed to update order status',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received':
        return 'bg-blue-500';
      case 'processing':
        return 'bg-yellow-500';
      case 'ready':
        return 'bg-green-500';
      case 'completed':
        return 'bg-gray-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <Card className="border-2 border-orange-300">
        <CardContent className="p-12 text-center">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Online Orders</h3>
          <p className="text-muted-foreground">New orders will appear here in real-time</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-orange-800">Online Orders</h2>
        <Badge className="text-lg px-4 py-2">{orders.length} Orders</Badge>
      </div>

      {orders.map((order) => (
        <Card key={order.id} className="border-2 border-orange-300 hover:border-orange-500 transition-colors">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-orange-700 mb-1">
                      {order.order_number}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {new Date(order.created_at).toLocaleString()}
                    </div>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.toUpperCase()}
                  </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-orange-50 p-3 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-orange-600" />
                      <span className="font-semibold">Customer</span>
                    </div>
                    <p className="text-sm">{order.customer_name}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <Phone className="w-3 h-3" />
                      {order.customer_phone}
                    </div>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-md">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">Fulfillment</span>
                    </div>
                    <p className="text-sm capitalize">{order.fulfillment_type.replace('_', ' ')}</p>
                    {order.pickup_datetime && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Pickup: {new Date(order.pickup_datetime).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-md mb-4">
                  <h4 className="font-semibold mb-2">Order Items</h4>
                  <div className="space-y-1">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>
                          {item.product_name} × {item.quantity_kg}kg
                        </span>
                        <span className="font-semibold">₹{item.subtotal.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-2 pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-orange-600">₹{order.total_amount.toFixed(2)}</span>
                  </div>
                </div>

                {order.special_instructions && (
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md mb-4">
                    <p className="text-sm font-semibold mb-1">Special Instructions:</p>
                    <p className="text-sm">{order.special_instructions}</p>
                  </div>
                )}

                {order.custom_packing && (
                  <Badge variant="outline" className="mb-4">Custom Packing Requested</Badge>
                )}
              </div>

              <div className="lg:w-48 space-y-2">
                <p className="text-sm font-semibold mb-2">Update Status</p>
                <Button
                  onClick={() => updateOrderStatus(order.id, 'processing')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={order.status === 'processing' || order.status === 'completed'}
                >
                  Processing
                </Button>
                <Button
                  onClick={() => updateOrderStatus(order.id, 'ready')}
                  variant="outline"
                  size="sm"
                  className="w-full"
                  disabled={order.status === 'ready' || order.status === 'completed'}
                >
                  Ready
                </Button>
                <Button
                  onClick={() => updateOrderStatus(order.id, 'completed')}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="sm"
                  disabled={order.status === 'completed'}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete
                </Button>
                <Button
                  onClick={() => updateOrderStatus(order.id, 'cancelled')}
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  disabled={order.status === 'completed' || order.status === 'cancelled'}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
