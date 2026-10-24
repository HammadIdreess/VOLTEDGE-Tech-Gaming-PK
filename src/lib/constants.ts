export const STORE_NAME = 'VoltEdge';
export const STORE_TAGLINE = 'High-Performance PC Hardware & Peripherals';
export const STORE_CURRENCY = 'PKR';
export const FLAT_SHIPPING_RATE = 500;
export const FREE_SHIPPING_THRESHOLD = 50000;

export const PAKISTAN_PROVINCES = [
  'Punjab',
  'Sindh',
  'Khyber Pakhtunkhwa',
  'Balochistan',
  'Islamabad Capital Territory',
  'Azad Jammu & Kashmir',
  'Gilgit-Baltistan',
] as const;

export const POPULAR_CITIES = [
  'Lahore',
  'Karachi',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Multan',
  'Peshawar',
  'Quetta',
  'Sialkot',
  'Gujranwala',
  'Hyderabad',
  'Abbottabad',
  'Bahawalpur',
  'Sargodha',
  'Sukkur',
] as const;

export const ORDER_STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  PENDING_CONFIRMATION: { label: 'Pending Confirmation', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  CONFIRMED: { label: 'Order Confirmed', color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
  PROCESSING: { label: 'Processing & Packing', color: 'text-cyan-400', bg: 'bg-cyan-400/10 border-cyan-400/20' },
  SHIPPED: { label: 'Shipped with Courier', color: 'text-indigo-400', bg: 'bg-indigo-400/10 border-indigo-400/20' },
  DELIVERED: { label: 'Delivered', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
  CANCELLED: { label: 'Cancelled', color: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/20' },
  RETURNED: { label: 'Returned', color: 'text-zinc-400', bg: 'bg-zinc-400/10 border-zinc-400/20' },
};

export const PAYMENT_STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Payment Pending', color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  AWAITING_VERIFICATION: { label: 'Awaiting Bank Verification', color: 'text-sky-400', bg: 'bg-sky-400/10 border-sky-400/20' },
  PAID: { label: 'Paid in Full', color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
  FAILED: { label: 'Payment Failed', color: 'text-rose-400', bg: 'bg-rose-400/10 border-rose-400/20' },
  REFUNDED: { label: 'Refunded', color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20' },
};
