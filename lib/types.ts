export interface Order {
  id: string;
  order_number: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  order_type: 'online' | 'counter';
  items: {
    product_id: string;
    product_name: string;
    quantity_kg: number;
    price_per_kg: number;
    subtotal: number;
  }[];
  total_amount: number;
  status: 'received' | 'processing' | 'ready' | 'completed' | 'cancelled';
  // Add other fields from your 'orders' table as needed
}