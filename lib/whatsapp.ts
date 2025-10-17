// lib/whatsapp.ts

type WhatsAppItem = {
  product_name?: string;
  name?: string;
  quantity_kg?: number;
  qty?: number;
  price_per_kg?: number;
  price?: number;
  subtotal?: number;
  total?: number;
};

type WhatsAppMessageDetails = {
  phone: string;
  orderNumber: string;
  customerName: string;
  items: WhatsAppItem[] | string | null;
  totalAmount: number;
  createdAt?: string | null;
  fulfillmentType?: 'take_away' | 'parcel' | string | null;
  pickupDatetime?: string | null;
  customPacking?: boolean | null;
  specialInstructions?: string | null;
};

function safeNumber(v: any) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function normalizeItems(raw: WhatsAppItem[] | string | null) {
  if (!raw) return [];

  let arr: any[] = [];

  if (typeof raw === 'string') {
    try {
      arr = JSON.parse(raw);
    } catch {
      // try to split lines fallback
      return [];
    }
  } else if (Array.isArray(raw)) {
    arr = raw;
  } else {
    return [];
  }

  return arr.map((it) => {
    const product_name = it.product_name ?? it.name ?? 'Item';
    const quantity_kg = safeNumber(it.quantity_kg ?? it.qty ?? it.quantity ?? 0);
    const price_per_kg = safeNumber(it.price_per_kg ?? it.price ?? it.rate ?? 0);
    const subtotal =
      safeNumber(it.subtotal ?? it.total ?? price_per_kg * quantity_kg);

    return { product_name, quantity_kg, price_per_kg, subtotal };
  });
}

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

  const cleanPhone = (phone || '').replace(/[^0-9]/g, '');

  if (!cleanPhone || cleanPhone.length < 10) {
    // If called from non-UI context we still throw so callers can handle it;
    // But normally UI should validate before calling.
    throw new Error('Invalid phone number for WhatsApp');
  }

  const normalizedItems = normalizeItems(items);

  const itemDetails =
    normalizedItems.length === 0
      ? '- (no item details available)'
      : normalizedItems
          .map(
            (item) =>
              `- ${item.product_name}: ${item.quantity_kg}kg @ ₹${item.price_per_kg}/kg = ₹${item.subtotal.toFixed(
                2
              )}`
          )
          .join('\n');

  let fulfillmentSection = '';
  if (fulfillmentType || pickupDatetime || customPacking) {
    const fdetails: string[] = [];
    if (fulfillmentType) fdetails.push(`Method: ${String(fulfillmentType).replace(/_/g, ' ')}`);
    if (pickupDatetime) {
      try {
        fdetails.push(`Pickup Time: ${new Date(pickupDatetime).toLocaleString('en-IN')}`);
      } catch {
        fdetails.push(`Pickup Time: ${pickupDatetime}`);
      }
    }
    if (customPacking) fdetails.push(`Custom Packing: Yes`);
    fulfillmentSection = `\n--- Fulfillment Details ---\n${fdetails.join('\n')}`;
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

Dear ${customerName || 'Customer'},

Thank you for your order. Here are the details:

Order Number: ${orderNumber}
${createdAt ? `Order Date: ${new Date(createdAt).toLocaleString('en-IN')}` : ''}

Total Amount: ₹${safeNumber(totalAmount).toFixed(2)}

--- Items ---
${itemDetails}
${fulfillmentSection}
${instructionsSection}

Payment has been collected in-store via Cash or UPI.

For any questions, please contact us at:
9425314543 or 9425314545

Thank you for your business!
`.trim();

  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(message)}`;

  try {
    // open in new tab/window
    window.open(whatsappUrl, '_blank');
  } catch (err) {
    // if window.open not available, throw so callers can show an error
    throw new Error('Unable to open WhatsApp URL');
  }
}
