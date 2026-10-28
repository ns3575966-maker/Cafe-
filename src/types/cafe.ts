export type CategoryType = 'All' | 'Coffee' | 'Tea' | 'Cold Drinks' | 'Snacks' | 'Desserts';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: Exclude<CategoryType, 'All'>;
  description: string;
  image: string;
  popular?: boolean;
  available: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export type OrderStatus = 'Received' | 'Preparing' | 'Ready' | 'Served' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  tableNumber: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  customerPhone: string;
  customerName?: string;
  createdAt: string; // ISO String
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  stamps: number; // 0 to 5
  totalVisits: number;
  lastVisit: string; // ISO String
  optOutMarketing: boolean;
  createdAt: string;
}

export interface Reward {
  id: string;
  customerPhone: string;
  customerName: string;
  rewardCode: string;
  title: string;
  description: string;
  isRedeemed: boolean;
  redeemedAt?: string;
  createdAt: string;
}

export type CampaignStatus = 'Draft' | 'Opened in WhatsApp' | 'Confirmed Sent';

export interface Campaign {
  id: string;
  customerPhone: string;
  customerName: string;
  offerMessage: string;
  status: CampaignStatus;
  sentAt: string;
  returned?: boolean;
  returnedAt?: string;
}

export interface CafeSettings {
  cafeName: string;
  googleReviewUrl: string;
  whatsappTemplate: string;
  totalTables: number;
  currencySymbol: string;
}

export type UserRole = 'Owner' | 'Staff' | 'Customer';
export type TabType = 'ordering' | 'stamp' | 'rewards' | 'campaigns' | 'dashboard';
