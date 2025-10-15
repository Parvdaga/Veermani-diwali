"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, type Order } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  LogOut, ShoppingCart, Package, DollarSign, ListOrdered, History, Clock, Wallet, QrCode 
} from 'lucide-react';
import POSSystem from '@/components/admin/POSSystem';
import OrderManagement from '@/components/admin/OrderManagement';

export default function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      router.push('/admin');
      return;
    }

    setUser(session.user);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-amber-50 to-yellow-50">
      <header className="bg-gradient-to-r from-orange-600 via-orange-700 to-amber-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-script">Veermani Kitchen's</h1>
            <p className="text-sm text-orange-100">Admin Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right mr-4 hidden sm:block">
              <p className="text-sm text-orange-100">Logged in as</p>
              <p className="font-semibold">{user?.email}</p>
            </div>
            <Button onClick={handleSignOut} variant="secondary" size="sm">
              <LogOut className="w-4 h-4 mr-2 sm:mr-0" />
              <span className="hidden sm:inline sm:ml-2">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="pos" className="w-full">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mb-8 bg-white border-2 border-orange-300 h-auto p-2">
            <TabsTrigger value="pos" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white py-3">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Counter Billing
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white py-3">
              <ListOrdered className="w-5 h-5 mr-2" />
              Online Orders
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white py-3">
              <Clock className="w-5 h-5 mr-2" />
              Pending Payments
            </TabsTrigger>
            <TabsTrigger value="bulk" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white py-3">
              <Package className="w-5 h-5 mr-2" />
              Bulk Orders
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white py-3">
              <History className="w-5 h-5 mr-2" />
              All Orders
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pos">
            <POSSystem />
          </TabsContent>

          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>
          
          <TabsContent value="pending">
            <PendingPayments />
          </TabsContent>

          <TabsContent value="bulk">
            <BulkOrderManagement />
          </TabsContent>

          <TabsContent value="history">
            <OrderHistory />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

function PendingPayments() {
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

  const markAsPaid = async (orderId: string, paymentMethod: 'cash' | 'upi') => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ payment_method: paymentMethod, status: 'completed' })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: 'Payment Completed',
        description: `Order has been marked as paid with ${paymentMethod}.`,
      });
      fetchPendingOrders();
    } catch (error) {
      console.error('Error updating payment status:', error);
      toast({
        title: 'Update Failed',
        description: 'Could not update the payment status.',
        variant: 'destructive',
      });
    }
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
              <div key={order.id} className="border-2 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex-1">
                  <p className="font-bold">{order.customer_name} ({order.customer_phone})</p>
                  <p className="text-sm text-muted-foreground">Order: {order.order_number}</p>
                  <p className="text-lg font-bold text-orange-600 mt-1">₹{order.total_amount.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={() => markAsPaid(order.id, 'cash')} className="bg-green-600 hover:bg-green-700">
                    <Wallet className="w-4 h-4 mr-2" /> Paid by Cash
                  </Button>
                  <Button onClick={() => markAsPaid(order.id, 'upi')} className="bg-blue-600 hover:bg-blue-700">
                    <QrCode className="w-4 h-4 mr-2" /> Paid by UPI
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

function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching all orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'processing':
        return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'ready':
        return 'bg-green-500 hover:bg-green-600 text-white';
      case 'completed':
        return 'bg-gray-500 hover:bg-gray-600 text-white';
      case 'cancelled':
        return 'bg-red-500 hover:bg-red-600 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading order history...</div>;
  }

  return (
    <Card className="border-2 border-orange-300">
      <CardHeader>
        <CardTitle>Complete Order History</CardTitle>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order #</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.order_number}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>{order.customer_name}</TableCell>
                    <TableCell>{order.customer_phone}</TableCell>
                    <TableCell>
                      <Badge
                        className={order.order_type === 'online' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
                      >
                        {order.order_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">₹{order.total_amount.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BulkOrderManagement() {
  const [bulkOrders, setBulkOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBulkOrders();
  }, []);

  const fetchBulkOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('bulk_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBulkOrders(data || []);
    } catch (error) {
      console.error('Error fetching bulk orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bulk_orders')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      fetchBulkOrders();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-orange-800">Bulk Order Inquiries</h2>
      {bulkOrders.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No bulk orders yet.</p>
      ) : (
        bulkOrders.map((order) => (
          <div key={order.id} className="bg-white border-2 border-orange-300 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-bold text-lg">{order.customer_name}</p>
                <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="bg-orange-50 p-4 rounded-md mb-2">
              <p className="font-semibold mb-2">Items:</p>
              <pre className="whitespace-pre-wrap text-sm">{order.items_description}</pre>
            </div>
            {order.special_instructions && (
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="font-semibold mb-2">Special Instructions:</p>
                <p className="text-sm">{order.special_instructions}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}