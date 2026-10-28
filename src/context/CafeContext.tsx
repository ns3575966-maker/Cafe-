import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  MenuItem,
  CartItem,
  Order,
  Customer,
  Reward,
  Campaign,
  CafeSettings,
  UserRole,
  TabType,
  CategoryType,
  OrderStatus
} from '../types/cafe';
import {
  INITIAL_MENU_ITEMS,
  INITIAL_CUSTOMERS,
  INITIAL_ORDERS,
  INITIAL_REWARDS,
  INITIAL_CAMPAIGNS,
  INITIAL_SETTINGS
} from '../data/initialData';
import { db, handleFirestoreError, OperationType } from '../services/firebase';
import { collection, onSnapshot, setDoc, doc, updateDoc, addDoc } from 'firebase/firestore';

interface CafeContextType {
  // Role & Nav
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  selectedCategory: CategoryType;
  setSelectedCategory: (cat: CategoryType) => void;

  // Data
  menuItems: MenuItem[];
  orders: Order[];
  customers: Customer[];
  rewards: Reward[];
  campaigns: Campaign[];
  settings: CafeSettings;
  updateSettings: (newSettings: Partial<CafeSettings>) => void;

  // Ordering & Cart
  cart: CartItem[];
  tableNumber: string;
  setTableNumber: (table: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  customerName: string;
  setCustomerName: (name: string) => void;
  addToCart: (item: MenuItem, instructions?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  clearCart: () => void;
  placeOrder: () => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  
  // Stamp Loyalty Card
  findOrCreateCustomer: (phone: string, name?: string) => Customer;
  addStampToCustomer: (phone: string) => Promise<{ customer: Customer; rewardUnlocked: boolean }>;
  redeemReward: (rewardId: string) => Promise<void>;

  // Campaigns
  sendWhatsAppCampaign: (campaignId: string, phone: string, message: string) => void;
  markCampaignReturned: (campaignId: string) => Promise<void>;
  toggleOptOut: (customerId: string) => Promise<void>;

  // UI Modals & State
  activeOrderConfirmation: Order | null;
  setActiveOrderConfirmation: (order: Order | null) => void;
  qrModalOpen: boolean;
  setQrModalOpen: (open: boolean) => void;
  setupGuideOpen: boolean;
  setSetupGuideOpen: (open: boolean) => void;
  isFirebaseConnected: boolean;

  // Customer View QR Mode
  qrTableContext: string | null;
  setQrTableContext: (table: string | null) => void;
}

const CafeContext = createContext<CafeContextType | undefined>(undefined);

export const CafeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('Owner');
  const [activeTab, setActiveTab] = useState<TabType>('ordering');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');

  // Core Data States initialized with realistic Indian Cafe sample data
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [rewards, setRewards] = useState<Reward[]>(INITIAL_REWARDS);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [settings, setSettings] = useState<CafeSettings>(INITIAL_SETTINGS);

  // Cart & Active Ordering State
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tableNumber, setTableNumber] = useState<string>('Table 1');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [activeOrderConfirmation, setActiveOrderConfirmation] = useState<Order | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState<boolean>(false);
  const [setupGuideOpen, setSetupGuideOpen] = useState<boolean>(false);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const [qrTableContext, setQrTableContext] = useState<string | null>(null);

  // Real-time Firestore sync setup if connected
  useEffect(() => {
    let unsubscribeOrders: () => void = () => {};
    let unsubscribeCustomers: () => void = () => {};

    try {
      unsubscribeOrders = onSnapshot(
        collection(db, 'orders'),
        (snapshot) => {
          if (!snapshot.empty) {
            const fetchedOrders: Order[] = [];
            snapshot.forEach((docSnap) => {
              fetchedOrders.push({ id: docSnap.id, ...docSnap.data() } as Order);
            });
            // Sort by createdAt descending
            fetchedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            setOrders(fetchedOrders);
          }
        },
        (error) => {
          console.warn('Firestore live listener offline or denied. Using in-memory state.', error);
          setIsFirebaseConnected(false);
        }
      );

      unsubscribeCustomers = onSnapshot(
        collection(db, 'customers'),
        (snapshot) => {
          if (!snapshot.empty) {
            const fetched: Customer[] = [];
            snapshot.forEach((docSnap) => {
              fetched.push({ id: docSnap.id, ...docSnap.data() } as Customer);
            });
            setCustomers(fetched);
          }
        },
        (error) => {
          console.warn('Firestore customer listener error:', error);
        }
      );
    } catch (e) {
      console.warn('Firebase sync failed, using demo fallback:', e);
      setIsFirebaseConnected(false);
    }

    return () => {
      unsubscribeOrders();
      unsubscribeCustomers();
    };
  }, []);

  // Cart Actions
  const addToCart = (item: MenuItem, instructions?: string) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((ci) => ci.menuItem.id === item.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += 1;
        if (instructions) updated[existingIndex].specialInstructions = instructions;
        return updated;
      }
      return [...prevCart, { menuItem: item, quantity: 1, specialInstructions: instructions }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((ci) => ci.menuItem.id !== itemId));
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((ci) => {
          if (ci.menuItem.id === itemId) {
            const newQty = ci.quantity + delta;
            return newQty > 0 ? { ...ci, quantity: newQty } : null;
          }
          return ci;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  const updateSettings = (newSettings: Partial<CafeSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Customer Management
  const findOrCreateCustomer = (phone: string, name?: string): Customer => {
    const cleanPhone = phone.replace(/\D/g, '');
    let customer = customers.find((c) => c.phone === cleanPhone);

    if (!customer) {
      customer = {
        id: 'cust-' + Date.now(),
        phone: cleanPhone,
        name: name || 'Valued Guest',
        stamps: 0,
        totalVisits: 1,
        lastVisit: new Date().toISOString(),
        optOutMarketing: false,
        createdAt: new Date().toISOString()
      };
      setCustomers((prev) => [customer!, ...prev]);
    }
    return customer;
  };

  // Place Order Function with persistent sync & stamp accumulation
  const placeOrder = async (): Promise<Order | null> => {
    if (cart.length === 0) return null;
    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      alert('Please enter a valid 10-digit mobile phone number for order tracking & rewards.');
      return null;
    }

    const subtotal = cart.reduce((acc, item) => acc + item.menuItem.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.05 * 100) / 100; // 5% GST
    const total = Math.round((subtotal + tax) * 100) / 100;

    const orderNumber = `CD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: 'ord-' + Date.now(),
      orderNumber,
      tableNumber: qrTableContext || tableNumber,
      items: [...cart],
      subtotal,
      tax,
      total,
      status: 'Received',
      customerPhone: cleanPhone,
      customerName: customerName || 'Valued Guest',
      createdAt: new Date().toISOString()
    };

    // Update Local Orders
    setOrders((prev) => [newOrder, ...prev]);

    // Update / Register Customer
    let customer = customers.find((c) => c.phone === cleanPhone);
    if (!customer) {
      customer = {
        id: 'cust-' + Date.now(),
        phone: cleanPhone,
        name: customerName || 'Valued Guest',
        stamps: 1, // 1 stamp earned on first order
        totalVisits: 1,
        lastVisit: new Date().toISOString(),
        optOutMarketing: false,
        createdAt: new Date().toISOString()
      };
      setCustomers((prev) => [customer!, ...prev]);
    } else {
      const newStampCount = customer.stamps + 1;
      const updatedCust: Customer = {
        ...customer,
        name: customerName || customer.name,
        stamps: newStampCount > 5 ? 1 : newStampCount, // Reset loop on 5th
        totalVisits: customer.totalVisits + 1,
        lastVisit: new Date().toISOString()
      };

      setCustomers((prev) => prev.map((c) => (c.phone === cleanPhone ? updatedCust : c)));

      // Auto issue reward if 5th stamp unlocked
      if (newStampCount === 5) {
        const rewardCode = `FREECOFFEE-${Math.floor(1000 + Math.random() * 9000)}`;
        const newReward: Reward = {
          id: 'r-' + Date.now(),
          customerPhone: cleanPhone,
          customerName: customerName || customer.name,
          rewardCode,
          title: '1x Free Coffee Reward',
          description: 'Unlocked by completing 5 stamps on CafeDesk!',
          isRedeemed: false,
          createdAt: new Date().toISOString()
        };
        setRewards((prev) => [newReward, ...prev]);
      }
    }

    // Try saving to Firestore if live
    try {
      await setDoc(doc(db, 'orders', newOrder.id), newOrder);
    } catch (err) {
      console.warn('Firestore write order fallback to local state:', err);
    }

    // Clear cart and show order confirmation modal
    setCart([]);
    setActiveOrderConfirmation(newOrder);
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch (err) {
      console.warn('Firestore update status fallback:', err);
    }
  };

  // Add stamp manually from Staff interface
  const addStampToCustomer = async (phone: string): Promise<{ customer: Customer; rewardUnlocked: boolean }> => {
    const cleanPhone = phone.replace(/\D/g, '');
    let cust = customers.find((c) => c.phone === cleanPhone);

    let rewardUnlocked = false;
    if (!cust) {
      cust = {
        id: 'cust-' + Date.now(),
        phone: cleanPhone,
        name: 'Guest ' + cleanPhone.slice(-4),
        stamps: 1,
        totalVisits: 1,
        lastVisit: new Date().toISOString(),
        optOutMarketing: false,
        createdAt: new Date().toISOString()
      };
      setCustomers((prev) => [cust!, ...prev]);
    } else {
      const nextStamps = cust.stamps + 1;
      if (nextStamps >= 5) {
        rewardUnlocked = true;
        const rewardCode = `FREECOFFEE-${Math.floor(1000 + Math.random() * 9000)}`;
        const newReward: Reward = {
          id: 'r-' + Date.now(),
          customerPhone: cleanPhone,
          customerName: cust.name,
          rewardCode,
          title: '1x Free Coffee Reward',
          description: 'Unlocked by completing 5 stamps on CafeDesk!',
          isRedeemed: false,
          createdAt: new Date().toISOString()
        };
        setRewards((prev) => [newReward, ...prev]);
        cust = {
          ...cust,
          stamps: 0, // Reset for next loop
          totalVisits: cust.totalVisits + 1,
          lastVisit: new Date().toISOString()
        };
      } else {
        cust = {
          ...cust,
          stamps: nextStamps,
          totalVisits: cust.totalVisits + 1,
          lastVisit: new Date().toISOString()
        };
      }
      setCustomers((prev) => prev.map((c) => (c.phone === cleanPhone ? cust! : c)));
    }

    return { customer: cust, rewardUnlocked };
  };

  const redeemReward = async (rewardId: string) => {
    setRewards((prev) =>
      prev.map((r) => (r.id === rewardId ? { ...r, isRedeemed: true, redeemedAt: new Date().toISOString() } : r))
    );
  };

  const sendWhatsAppCampaign = (campaignId: string, phone: string, message: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodedMessage}`;

    // Update status locally
    setCampaigns((prev) => {
      const existing = prev.find((c) => c.id === campaignId);
      if (existing) {
        return prev.map((c) => (c.id === campaignId ? { ...c, status: 'Opened in WhatsApp' } : c));
      } else {
        const cust = customers.find((c) => c.phone === cleanPhone);
        const newCamp: Campaign = {
          id: campaignId,
          customerPhone: cleanPhone,
          customerName: cust?.name || 'Customer',
          offerMessage: message,
          status: 'Opened in WhatsApp',
          sentAt: new Date().toISOString(),
          returned: false
        };
        return [newCamp, ...prev];
      }
    });

    // Open WhatsApp Click-to-Chat in new window
    window.open(whatsappUrl, '_blank');
  };

  const markCampaignReturned = async (campaignId: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === campaignId ? { ...c, returned: true, returnedAt: new Date().toISOString() } : c))
    );
  };

  const toggleOptOut = async (customerId: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === customerId ? { ...c, optOutMarketing: !c.optOutMarketing } : c))
    );
  };

  return (
    <CafeContext.Provider
      value={{
        role,
        setRole,
        activeTab,
        setActiveTab,
        selectedCategory,
        setSelectedCategory,
        menuItems,
        orders,
        customers,
        rewards,
        campaigns,
        settings,
        updateSettings,
        cart,
        tableNumber,
        setTableNumber,
        customerPhone,
        setCustomerPhone,
        customerName,
        setCustomerName,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        updateOrderStatus,
        findOrCreateCustomer,
        addStampToCustomer,
        redeemReward,
        sendWhatsAppCampaign,
        markCampaignReturned,
        toggleOptOut,
        activeOrderConfirmation,
        setActiveOrderConfirmation,
        qrModalOpen,
        setQrModalOpen,
        setupGuideOpen,
        setSetupGuideOpen,
        isFirebaseConnected,
        qrTableContext,
        setQrTableContext
      }}
    >
      {children}
    </CafeContext.Provider>
  );
};

export const useCafe = () => {
  const context = useContext(CafeContext);
  if (!context) {
    throw new Error('useCafe must be used within a CafeProvider');
  }
  return context;
};
