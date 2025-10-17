"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, type Order } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LogOut, ShoppingCart, Package, DollarSign, ListOrdered, History, Clock, Search 
} from 'lucide-react';
import POSSystem from '@/components/admin/POSSystem';
import OrderManagement from '@/components/admin/OrderManagement';
import PendingPayments from '@/components/admin/PendingPayments';

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

/* ----------------- ORDER HISTORY WITH SEARCH ----------------- */
function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredOrders = orders.filter(
    (order) =>
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.order_number?.toString().includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'processing': return 'bg-yellow-500 hover:bg-yellow-600 text-white';
      case 'ready': return 'bg-green-500 hover:bg-green-600 text-white';
      case 'completed': return 'bg-gray-500 hover:bg-gray-600 text-white';
      case 'cancelled': return 'bg-red-500 hover:bg-red-600 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  if (loading) return <div className="text-center py-12">Loading order history...</div>;

  return (
    <Card className="border-2 border-orange-300">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Complete Order History</span>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or order number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredOrders.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No orders found for "{searchTerm}".
          </p>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="border border-orange-200 rounded-lg p-4 bg-white shadow-sm">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <p className="font-bold text-lg">
                      #{order.order_number} — {order.customer_name}
                    </p>
                    <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleString('en-IN')}
                    </p>
                  </div>

                  <div className="text-right">
                    <Badge className={`capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </Badge>
                    <p className="text-orange-700 font-semibold text-lg mt-2">
                      ₹{order.total_amount.toFixed(2)}
                    </p>
                    <Badge
                      className={`mt-1 ${
                        order.order_type === 'online'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {order.order_type}
                    </Badge>
                  </div>
                </div>

                {order.items && Array.isArray(order.items) && order.items.length > 0 && (
                  <div className="mt-4 border-t pt-3">
                    <p className="font-semibold text-orange-800 mb-2">Items:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {order.items.map((item: any, index: number) => (
                        <li key={index}>
                          <span className="font-medium">{item.product_name}</span>{' '}
                          - {item.quantity_kg}kg × ₹{item.price_per_kg}/kg ={' '}
                          <span className="font-semibold">
                            ₹{item.subtotal?.toFixed(2) ?? 0}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/* ----------------- BULK ORDER MANAGEMENT ----------------- */
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

  if (loading) return <div className="text-center py-12">Loading...</div>;

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