import { MenuItem, Customer, Order, Reward, Campaign, CafeSettings } from '../types/cafe';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'm1',
    name: 'Artisanal Cappuccino',
    price: 180,
    category: 'Coffee',
    description: 'Double shot espresso with silky micro-foam latte art and freshly ground Arabica beans.',
    image: '/src/assets/images/cafe_cappuccino_1793173865701.jpg',
    popular: true,
    available: true
  },
  {
    id: 'm2',
    name: 'Kulhad Masala Chai',
    price: 70,
    category: 'Tea',
    description: 'Brewed Assam tea simmered with fresh cardamom, ginger, and spices served hot in a clay kulhad.',
    image: '/src/assets/images/masala_chai_1793173865915.jpg',
    popular: true,
    available: true
  },
  {
    id: 'm3',
    name: 'Classic Cold Coffee',
    price: 190,
    category: 'Cold Drinks',
    description: 'Blended thick espresso with vanilla ice cream, chilled milk, and dark chocolate drizzle.',
    image: '/src/assets/images/iced_cold_coffee_1793173867560.jpg',
    popular: true,
    available: true
  },
  {
    id: 'm4',
    name: 'Golden Samosa (2 pcs)',
    price: 110,
    category: 'Snacks',
    description: 'Crispy fried pastry stuffed with spiced potato & peas served with mint & tamarind chutney.',
    image: '/src/assets/images/samosa_snack_1793173866800.jpg',
    popular: true,
    available: true
  },
  {
    id: 'm5',
    name: 'Sizzling Chocolate Brownie',
    price: 220,
    category: 'Desserts',
    description: 'Warm fudgy chocolate walnut brownie served with vanilla bean ice cream & hot fudge sauce.',
    image: '/src/assets/images/chocolate_brownie_1793173866883.jpg',
    popular: true,
    available: true
  },
  {
    id: 'm6',
    name: 'Hazelnut Latte',
    price: 210,
    category: 'Coffee',
    description: 'Rich espresso poured over steamed milk infused with roasted hazelnut syrup.',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=80',
    popular: false,
    available: true
  },
  {
    id: 'm7',
    name: 'Paneer Tikka Sandwich',
    price: 160,
    category: 'Snacks',
    description: 'Grilled sourdough stuffed with marinated tandoori paneer, capsicum, and melted cheese.',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80',
    popular: true,
    available: true
  },
  {
    id: 'm8',
    name: 'Peach Iced Tea',
    price: 140,
    category: 'Cold Drinks',
    description: 'Freshly brewed black tea infused with sweet peach nectar and fresh mint leaves.',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=80',
    popular: false,
    available: true
  }
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'c1',
    name: 'Aarav Sharma',
    phone: '9876543210',
    stamps: 4,
    totalVisits: 8,
    lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    optOutMarketing: false,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'c2',
    name: 'Ananya Verma',
    phone: '9812345678',
    stamps: 2,
    totalVisits: 3,
    lastVisit: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    optOutMarketing: false,
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'c3',
    name: 'Rohan Gupta',
    phone: '9765432109',
    stamps: 1,
    totalVisits: 2,
    lastVisit: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(), // 28 days inactive
    optOutMarketing: false,
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'c4',
    name: 'Priya Iyer',
    phone: '9988776655',
    stamps: 0,
    totalVisits: 5,
    lastVisit: new Date(Date.now() - 34 * 24 * 60 * 60 * 1000).toISOString(), // 34 days inactive
    optOutMarketing: false,
    createdAt: new Date(Date.now() - 100 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'c5',
    name: 'Vikram Mehta',
    phone: '9123456789',
    stamps: 3,
    totalVisits: 6,
    lastVisit: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(), // 22 days inactive
    optOutMarketing: false,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'CD-1001',
    tableNumber: 'Table 4',
    items: [
      { menuItem: INITIAL_MENU_ITEMS[0], quantity: 2 },
      { menuItem: INITIAL_MENU_ITEMS[3], quantity: 1 }
    ],
    subtotal: 470,
    tax: 23.5,
    total: 493.5,
    status: 'Served',
    customerPhone: '9876543210',
    customerName: 'Aarav Sharma',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString()
  },
  {
    id: 'ord-102',
    orderNumber: 'CD-1002',
    tableNumber: 'Table 2',
    items: [
      { menuItem: INITIAL_MENU_ITEMS[1], quantity: 2 },
      { menuItem: INITIAL_MENU_ITEMS[6], quantity: 1 }
    ],
    subtotal: 300,
    tax: 15,
    total: 315,
    status: 'Preparing',
    customerPhone: '9812345678',
    customerName: 'Ananya Verma',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString()
  },
  {
    id: 'ord-103',
    orderNumber: 'CD-1003',
    tableNumber: 'Table 8',
    items: [
      { menuItem: INITIAL_MENU_ITEMS[2], quantity: 1 },
      { menuItem: INITIAL_MENU_ITEMS[4], quantity: 1 }
    ],
    subtotal: 410,
    tax: 20.5,
    total: 430.5,
    status: 'Received',
    customerPhone: '9765432109',
    customerName: 'Rohan Gupta',
    createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString()
  }
];

export const INITIAL_REWARDS: Reward[] = [
  {
    id: 'r1',
    customerPhone: '9876543210',
    customerName: 'Aarav Sharma',
    rewardCode: 'FREECOFFEE-7892',
    title: '1x Free Artisanal Coffee',
    description: 'Unlocked by completing 5 stamps on CafeDesk loyalty card!',
    isRedeemed: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    customerPhone: '9765432109',
    customerName: 'Rohan Gupta',
    offerMessage: 'Hi Rohan! We miss seeing you at CafeDesk. Enjoy a FREE Cookie or 20% OFF your coffee on your next visit! Show code COMEBACK20.',
    status: 'Opened in WhatsApp',
    sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    returned: true,
    returnedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const INITIAL_SETTINGS: CafeSettings = {
  cafeName: 'CafeDesk Artisan Brews',
  googleReviewUrl: 'https://g.page/r/cafedesk-demo/review',
  whatsappTemplate: 'Hi {name}! We miss your presence at {cafeName}. Enjoy 20% OFF or a FREE Snack on your next visit! Show this code: COMEBACK20',
  totalTables: 12,
  currencySymbol: '₹'
};
