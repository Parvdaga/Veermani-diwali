// lib/whatsapp.ts

type WhatsAppMessageDetails = {
  phone: string;
  orderNumber: string;
  customerName: string;
  items: { product_name: string; quantity_kg: number; price_per_kg: number; subtotal: number }[];
  totalAmount: number;
  createdAt?: string;
  fulfillmentType?: 'take_away' | 'parcel' | string;
  pickupDatetime?: string | null;
  customPacking?: boolean;
  specialInstructions?: string | null;
};

export function sendInvoiceViaWhatsApp(details: WhatsAppMessageDetails) {
  const {
    phone,
    orderNumber,
    customerName,
    items,
    totalAmount,
    createdAt,
    fulfillmentType,
    pickupDatetime,
    customPacking,
    specialInstructions,
  } = details;

  const itemDetails = items.map(item =>
    `- ${item.product_name}: ${item.quantity_kg}kg @ ₹${item.price_per_kg}/kg = ₹${item.subtotal.toFixed(2)}`
  ).join('\n');

  let fulfillmentSection = '';
  if (fulfillmentType) {
    const details = [];
    details.push(`Method: ${fulfillmentType.replace('_', ' ')}`);
    if (pickupDatetime) {
      details.push(`Pickup Time: ${new Date(pickupDatetime).toLocaleString('en-IN')}`);
    }
    if (customPacking) {
      details.push(`Custom Packing: Yes`);
    }
    fulfillmentSection = `\n--- Fulfillment Details ---\n${details.join('\n')}`;
  }

  const instructionsSection = specialInstructions
    ? `\n\n--- Special Instructions ---\n${specialInstructions}`
    : '';

  const message = `
श्री तिलकेश्वर पार्श्वनाथ नमः

====================
Veermani Kitchen's
Order Confirmation
====================

Dear ${customerName},

Thank you for your order. Here are the details:

Order Number: ${orderNumber}
${createdAt ? `Order Date: ${new Date(createdAt).toLocaleString('en-IN')}` : ''}

Total Amount: ₹${totalAmount.toFixed(2)}

--- Items ---
${itemDetails}
${fulfillmentSection}
${instructionsSection}

Payment has been collected in-store via Cash or UPI.

For any questions, please contact us at:
9425314543 or 9425314545

Thank you for your business!
  `.trim().replace(/\n\n\n/g, '\n\n');

  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
}