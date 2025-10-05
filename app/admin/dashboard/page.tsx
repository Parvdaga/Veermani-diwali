"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, type Order } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LogOut, ShoppingCart, Package, DollarSign, ListOrdered } from 'lucide-react';
import POSSystem from '@/components/admin/POSSystem';
import OrderManagement from '@/components/admin/OrderManagement';
import OtherPayments from '@/components/admin/OtherPayments';

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
            <div className="text-right mr-4">
              <p className="text-sm text-orange-100">Logged in as</p>
              <p className="font-semibold">{user?.email}</p>
            </div>
            <Button onClick={handleSignOut} variant="secondary" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="pos" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white border-2 border-orange-300 h-auto p-2">
            <TabsTrigger value="pos" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white py-3">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Counter Billing
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white py-3">
              <ListOrdered className="w-5 h-5 mr-2" />
              Online Orders
            </TabsTrigger>
            <TabsTrigger value="bulk" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white py-3">
              <Package className="w-5 h-5 mr-2" />
              Bulk Orders
            </TabsTrigger>
            <TabsTrigger value="payments" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white py-3">
              <DollarSign className="w-5 h-5 mr-2" />
              Other Payments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pos">
            <POSSystem />
          </TabsContent>

          <TabsContent value="orders">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="bulk">
            <BulkOrderManagement />
          </TabsContent>

          <TabsContent value="payments">
            <OtherPayments />
          </TabsContent>
        </Tabs>
      </main>
    </div>
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
