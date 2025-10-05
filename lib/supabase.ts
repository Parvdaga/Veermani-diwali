import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  name: string;
  name_english: string;
  price_per_kg: number;
  category: 'sweets' | 'namkeen';
  is_on_order: boolean;
  image_url?: string;
  display_order: number;
  is_available: boolean;
  created_at: string;
};

export type OrderItem = {
  product_id: string;
  product_name: string;
  quantity_kg: number;
  price_per_kg: number;
  subtotal: number;
};

export type Order = {
  id: string;
  order_number: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  order_type: 'online' | 'counter';
  items: OrderItem[];
  total_amount: number;
  status: 'received' | 'processing' | 'ready' | 'completed' | 'cancelled';
  payment_method: 'cash' | 'upi' | 'pending';
  fulfillment_type: 'take_away' | 'parcel';
  pickup_datetime?: string;
  custom_packing: boolean;
  special_instructions?: string;
  updated_at: string;
};

export type BulkOrder = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  items_description: string;
  special_instructions?: string;
  status: 'new' | 'contacted' | 'completed';
};

export type OtherPayment = {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone?: string;
  amount: number;
  payment_method: 'cash' | 'upi';
  description: string;
  recorded_by?: string;
};
