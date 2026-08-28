import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  CartItem,
  Category,
  Coupon,
  CustomerRecord,
  HeroBannerConfig,
  Order,
  OrderStatus,
  Product,
  PromoBanner,
  RashanPackage,
  RashanPackageItem,
  StoreSettings,
} from '../types';
import {
  INITIAL_COUPONS,
  INITIAL_HERO_CONFIG,
  INITIAL_STORE_SETTINGS,
} from '../data/initialData';
import { auth, db } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  getDocs,
  getDoc,
  query,
} from 'firebase/firestore';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  rashanPackages: RashanPackage[];
  storeSettings: StoreSettings;
  heroConfig: HeroBannerConfig;
  promoBanners: PromoBanner[];
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  orders: Order[];
  customers: CustomerRecord[];
  isCartOpen: boolean;
  selectedProduct: Product | null;
  activeView: 'home' | 'shop' | 'categories' | 'rashan' | 'rashan-builder' | 'deals' | 'checkout' | 'order-success' | 'reorder' | 'admin';
  activeCategory: string | null;
  searchQuery: string;
  lastCompletedOrder: Order | null;
  
  // Cloud & Loading State
  isLoadingFirestore: boolean;
  isCloudConnected: boolean;
  firestoreError: string | null;
  syncCloudSeed: () => Promise<{ success: boolean; message: string }>;

  // Navigation & UI Actions
  setIsCartOpen: (open: boolean) => void;
  setSelectedProduct: (product: Product | null) => void;
  setActiveView: (view: 'home' | 'shop' | 'categories' | 'rashan' | 'rashan-builder' | 'deals' | 'checkout' | 'order-success' | 'reorder' | 'admin') => void;
  setActiveCategory: (cat: string | null) => void;
  setSearchQuery: (query: string) => void;
  
  // Cart Actions
  addToCart: (product: Product, quantity?: number) => void;
  addPackageToCart: (pkg: RashanPackage) => void;
  addCustomRashanToCart: (name: string, items: RashanPackageItem[], totalPrice: number) => void;
  updateCartQuantity: (cartItemId: string, newQty: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  
  // Calculations
  cartCount: number;
  cartSubtotal: number;
  deliveryFee: number;
  couponDiscount: number;
  cartTotal: number;
  
  // Order Actions
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status' | 'subtotal' | 'deliveryFee' | 'discount' | 'total' | 'items'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByPhone: (phone: string) => Order[];
  reorderPastOrder: (order: Order) => void;

  // Admin Product Actions
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product>;
  updateProduct: (id: string, updatedFields: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  duplicateProduct: (id: string) => Promise<void>;
  toggleProductStatus: (id: string) => Promise<void>;
  updateProductStock: (id: string, newStock: number) => Promise<void>;
  toggleFeaturedProduct: (id: string) => Promise<void>;
  toggleBestSeller: (id: string) => Promise<void>;
  toggleNewArrival: (id: string) => Promise<void>;
  toggleDeal: (id: string) => Promise<void>;

  // Admin Category Actions
  addCategory: (cat: Omit<Category, 'id'>) => Promise<Category>;
  updateCategory: (id: string, updatedFields: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  reorderCategory: (id: string, direction: 'up' | 'down') => Promise<void>;

  // Admin Rashan Actions
  addRashanPackage: (pkg: Omit<RashanPackage, 'id'>) => Promise<RashanPackage>;
  updateRashanPackage: (id: string, updatedFields: Partial<RashanPackage>) => Promise<void>;
  deleteRashanPackage: (id: string) => Promise<void>;
  duplicateRashanPackage: (id: string) => Promise<void>;

  // Admin Homepage & Banner Actions
  updateHeroConfig: (config: Partial<HeroBannerConfig>) => Promise<void>;
  addPromoBanner: (banner: Omit<PromoBanner, 'id'>) => Promise<PromoBanner>;
  updatePromoBanner: (id: string, updatedFields: Partial<PromoBanner>) => Promise<void>;
  deletePromoBanner: (id: string) => Promise<void>;

  // Store Settings & Data
  updateStoreSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => Promise<{ success: boolean; message: string }>;

  // Admin Authentication
  isAdminAuthenticated: boolean;
  adminUser: User | null;
  adminLogin: (emailOrPasskey: string, password?: string) => Promise<{ success: boolean; message?: string }>;
  adminLogout: () => Promise<void>;

  // WhatsApp Helpers
  generateWhatsAppOrderUrl: (orderOrCustomItems?: { items: CartItem[]; total: number; name?: string; address?: string; phone?: string }) => string;
  generateDirectProductWhatsAppUrl: (product: Product, quantity?: number) => string;
  generateWhatsAppOrderStatusUrl: (order: Order) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  CART: 'junejo_cart_v2',
  COUPON: 'junejo_coupon_v2',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Store Core State (Synced in Real-time from Cloud Firestore)
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [rashanPackages, setRashanPackages] = useState<RashanPackage[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(INITIAL_STORE_SETTINGS);
  const [heroConfig, setHeroConfig] = useState<HeroBannerConfig>(INITIAL_HERO_CONFIG);
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<CustomerRecord[]>([]);

  // Cloud & Loading State
  const [isLoadingFirestore, setIsLoadingFirestore] = useState(true);
  const [isCloudConnected, setIsCloudConnected] = useState(false);
  const [firestoreError, setFirestoreError] = useState<string | null>(null);

  // Client-Side Navigation & Transient Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.COUPON);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeViewState, setActiveViewState] = useState<'home' | 'shop' | 'categories' | 'rashan' | 'rashan-builder' | 'deals' | 'checkout' | 'order-success' | 'reorder' | 'admin'>('home');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);

  // Admin Authentication State via Firebase Auth
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);

  // Synchronize active view with URL pathname and history
  const setActiveView = useCallback((view: 'home' | 'shop' | 'categories' | 'rashan' | 'rashan-builder' | 'deals' | 'checkout' | 'order-success' | 'reorder' | 'admin') => {
    setActiveViewState(view);
    if (typeof window !== 'undefined') {
      if (view === 'admin') {
        if (window.location.pathname !== '/admin') {
          window.history.pushState({ view: 'admin' }, '', '/admin');
        }
      } else {
        if (window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/')) {
          window.history.pushState({ view }, '', '/');
        }
      }
    }
  }, []);

  const activeView = activeViewState;

  // Save Cart & Coupon locally for active browser session
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch {}
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEYS.COUPON, JSON.stringify(appliedCoupon));
    } catch {}
  }, [appliedCoupon]);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setAdminUser(user);
      if (user) {
        setIsAdminAuthenticated(true);
        // Register or refresh admin record in Firestore
        try {
          await setDoc(doc(db, 'admins', user.uid), {
            uid: user.uid,
            email: user.email,
            lastLogin: new Date().toISOString(),
            role: 'admin',
          }, { merge: true });
         } catch (adminErr: any) {
           // Log the error for debugging - admin record creation is CRITICAL
           console.error('Failed to create/update admin record in Firestore:', adminErr?.message || adminErr);
           // Note: This might cause DELETE/UPDATE to fail if user email isn't hardcoded in rules
         }
      } else {
        setIsAdminAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Check URL pathname / hash on load and back/forward navigation
  useEffect(() => {
    const handleUrlChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/admin' || path.startsWith('/admin/') || hash === '#admin' || hash === '#/admin' || hash.startsWith('#admin') || hash.startsWith('#/admin')) {
        setActiveViewState('admin');
      } else if (path === '/' || path === '') {
        setActiveViewState((prev) => (prev === 'admin' ? 'home' : prev));
      }
    };

    handleUrlChange();
    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
    };
  }, []);

  // Safe Cloud Database Seeding
  const syncCloudSeed = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    return {
      success: false,
      message: 'Demo data seeding is disabled. Firestore remains the only source of truth.',
    };
  }, []);

  // Real-time Firestore Listeners (Live subscriptions)
  useEffect(() => {
    let unsubs: (() => void)[] = [];
    let isInitialLoad = true;

    try {
      // 1. PRODUCTS Listener
      const unsubProducts = onSnapshot(
        collection(db, 'products'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map((docSnap) => ({
              ...docSnap.data(),
              id: docSnap.id,
            } as Product));
            setProducts(list);
            setIsCloudConnected(true);
            setFirestoreError(null);
          } else if (isInitialLoad) {
            setProducts([]);
            console.log('Firestore products collection is empty.');
          } else {
            setProducts([]);
          }
          setIsLoadingFirestore(false);
        },
        (error) => {
          console.warn('Firestore products listener error:', error);
          setFirestoreError(error.message);
          setIsLoadingFirestore(false);
        }
      );
      unsubs.push(unsubProducts);

      // 2. CATEGORIES Listener
      const unsubCategories = onSnapshot(
        collection(db, 'categories'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map((docSnap) => docSnap.data() as Category);
            list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
            setCategories(list);
          } else {
            setCategories([]);
          }
        },
        (err) => console.warn('Firestore categories listener error:', err)
      );
      unsubs.push(unsubCategories);

      // 3. RASHAN PACKAGES Listener
      const unsubPackages = onSnapshot(
        collection(db, 'rashanPackages'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map((docSnap) => ({
              ...docSnap.data(),
              id: docSnap.id,
            } as RashanPackage));
            setRashanPackages(list);
          } else {
            setRashanPackages([]);
          }
        },
        (err) => console.warn('Firestore packages listener error:', err)
      );
      unsubs.push(unsubPackages);

      // 4. STORE SETTINGS Listener
      const unsubSettings = onSnapshot(
        doc(db, 'storeSettings', 'main'),
        (docSnap) => {
          if (docSnap.exists()) {
            setStoreSettings(docSnap.data() as StoreSettings);
          }
        },
        (err) => console.warn('Firestore settings listener error:', err)
      );
      unsubs.push(unsubSettings);

      // 5. HOMEPAGE HERO Listener
      const unsubHero = onSnapshot(
        doc(db, 'homepage', 'hero'),
        (docSnap) => {
          if (docSnap.exists()) {
            setHeroConfig(docSnap.data() as HeroBannerConfig);
          }
        },
        (err) => console.warn('Firestore hero listener error:', err)
      );
      unsubs.push(unsubHero);

      // 6. PROMO BANNERS Listener
      const unsubBanners = onSnapshot(
        collection(db, 'promoBanners'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map((docSnap) => docSnap.data() as PromoBanner);
            setPromoBanners(list);
          } else {
            setPromoBanners([]);
          }
        },
        (err) => console.warn('Firestore banners listener error:', err)
      );
      unsubs.push(unsubBanners);

      // 7. ORDERS Listener
      const unsubOrders = onSnapshot(
        collection(db, 'orders'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map((docSnap) => docSnap.data() as Order);
            list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setOrders(list);
          } else {
            setOrders([]);
          }
        },
        (err) => console.warn('Firestore orders listener error:', err)
      );
      unsubs.push(unsubOrders);

      // 8. CUSTOMERS Listener
      const unsubCustomers = onSnapshot(
        collection(db, 'customers'),
        (snapshot) => {
          if (!snapshot.empty) {
            const list = snapshot.docs.map((docSnap) => docSnap.data() as CustomerRecord);
            list.sort((a, b) => b.totalSpent - a.totalSpent);
            setCustomers(list);
          } else {
            setCustomers([]);
          }
        },
        (err) => console.warn('Firestore customers listener error:', err)
      );
      unsubs.push(unsubCustomers);

    } catch (err: any) {
      console.error('Failed to initialize Firestore listeners:', err);
      setIsLoadingFirestore(false);
      setFirestoreError(err?.message || 'Firestore connection initialization failed.');
    }

    isInitialLoad = false;

    return () => {
      unsubs.forEach((unsub) => unsub());
    };
  }, [syncCloudSeed]);

  // Aggregated Customers calculation fallback
  const derivedCustomers = useMemo<CustomerRecord[]>(() => {
    if (customers.length > 0) return customers;
    const map = new Map<string, CustomerRecord>();
    orders.forEach((ord) => {
      const key = ord.phone ? ord.phone.trim() : ord.customerName.trim();
      if (!key) return;
      if (!map.has(key)) {
        map.set(key, {
          id: `cust-${key.replace(/\D/g, '') || Math.random().toString(36).substring(2, 7)}`,
          name: ord.customerName,
          phone: ord.phone,
          whatsappNumber: ord.whatsappNumber || ord.phone,
          address: ord.address,
          area: ord.area,
          city: ord.city,
          ordersCount: 1,
          totalSpent: ord.total,
          lastOrderDate: ord.date,
          lastOrderId: ord.orderNumber,
        });
      } else {
        const existing = map.get(key)!;
        existing.ordersCount += 1;
        existing.totalSpent += ord.total;
        if (new Date(ord.date) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = ord.date;
          existing.lastOrderId = ord.orderNumber;
          existing.address = ord.address;
          existing.area = ord.area;
          existing.name = ord.customerName || existing.name;
        }
      }
    });
    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [customers, orders]);

  // Cart Calculations
  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const deliveryFee = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    if (cartSubtotal >= storeSettings.freeDeliveryThreshold) return 0;
    return storeSettings.deliveryFee;
  }, [cartSubtotal, storeSettings]);

  const couponDiscount = useMemo(() => {
    if (!appliedCoupon || cartSubtotal === 0) return 0;
    if (cartSubtotal < appliedCoupon.minOrder) return 0;
    if (appliedCoupon.discountType === 'percentage') {
      return Math.round((cartSubtotal * appliedCoupon.value) / 100);
    }
    return Math.min(appliedCoupon.value, cartSubtotal);
  }, [appliedCoupon, cartSubtotal]);

  const cartTotal = useMemo(() => {
    if (cartSubtotal === 0) return 0;
    return Math.max(0, cartSubtotal + deliveryFee - couponDiscount);
  }, [cartSubtotal, deliveryFee, couponDiscount]);

  // Firebase Admin Authentication
  const adminLogin = async (emailOrPasskey: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    const emailToUse = password !== undefined ? emailOrPasskey.trim() : 'admin@junejosuperstore.pk';
    const passwordToUse = password !== undefined ? password.trim() : emailOrPasskey.trim();

    if (!emailToUse || !passwordToUse) {
      return {
        success: false,
        message: 'Please enter both your admin email and password.',
      };
    }

    try {
      // 1. Try Signing in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, emailToUse, passwordToUse);
      setAdminUser(userCredential.user);
      setIsAdminAuthenticated(true);
      return { success: true };
    } catch (err: any) {
      // 2. If user not found, auto-create store manager account on first setup
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          const newCredential = await createUserWithEmailAndPassword(auth, emailToUse, passwordToUse);
          setAdminUser(newCredential.user);
          setIsAdminAuthenticated(true);

          await setDoc(doc(db, 'admins', newCredential.user.uid), {
            uid: newCredential.user.uid,
            email: emailToUse,
            role: 'admin',
            createdAt: new Date().toISOString(),
          }, { merge: true });

          return { success: true };
        } catch (createErr: any) {
          // If creation fails due to email already in use, verify credentials
          if (createErr.code === 'auth/email-already-in-use') {
            return {
              success: false,
              message: 'Invalid password. Please enter the correct password for this admin account.',
            };
          }
          return {
            success: false,
            message: createErr.message || 'Firebase Authentication failed.',
          };
        }
      }

      return {
        success: false,
        message: err.message || 'Authentication failed. Please verify admin credentials.',
      };
    }
  };

  const adminLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn('Firebase signOut error:', err);
    }
    setAdminUser(null);
    setIsAdminAuthenticated(false);
    // Keep on admin route so the login screen is immediately displayed
    if (typeof window !== 'undefined' && window.location.pathname !== '/admin') {
      window.history.replaceState({ view: 'admin' }, '', '/admin');
    }
  };

  // Cart Operations
  const addToCart = (product: Product, quantity = 1) => {
    if (product.stockCount !== undefined && product.stockCount <= 0) {
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.type === 'product' && item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === existing.cartItemId
            ? { ...item, quantity: item.quantity + quantity, price: product.price }
            : item
        );
      }
      const newItem: CartItem = {
        cartItemId: `cart-prod-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: 'product',
        productId: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        quantity,
        weight: product.weight,
        image: product.image,
      };
      return [...prev, newItem];
    });
  };

  const addPackageToCart = (pkg: RashanPackage) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.type === 'rashan_package' && item.packageId === pkg.id);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === existing.cartItemId
            ? { ...item, quantity: item.quantity + 1, price: pkg.price }
            : item
        );
      }
      const newItem: CartItem = {
        cartItemId: `cart-pkg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type: 'rashan_package',
        packageId: pkg.id,
        name: pkg.name,
        price: pkg.price,
        quantity: 1,
        weight: pkg.familySize,
        image: pkg.image,
        packageItems: pkg.items,
      };
      return [...prev, newItem];
    });
  };

  const addCustomRashanToCart = (name: string, items: RashanPackageItem[], totalPrice: number) => {
    const newItem: CartItem = {
      cartItemId: `cart-custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      type: 'custom_rashan',
      name: name || 'Custom Monthly Rashan Package',
      price: totalPrice,
      quantity: 1,
      weight: `${items.length} Items Selected`,
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
      packageItems: items,
    };
    setCart((prev) => [...prev, newItem]);
  };

  const updateCartQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item))
    );
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const found = INITIAL_COUPONS.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      return { success: false, message: 'Invalid coupon code.' };
    }
    if (cartSubtotal < found.minOrder) {
      return {
        success: false,
        message: `Minimum order of Rs. ${found.minOrder.toLocaleString()} required for this coupon.`,
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon "${found.code}" applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Orders and Cloud Persistence
  const placeOrder = async (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status' | 'subtotal' | 'deliveryFee' | 'discount' | 'total' | 'items'>
  ): Promise<Order> => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newOrderId = `ord-${Date.now()}`;
    const newOrder: Order = {
      ...orderData,
      id: newOrderId,
      orderNumber: `JS-${randomSuffix}`,
      date: new Date().toISOString(),
      items: [...cart],
      subtotal: cartSubtotal,
      deliveryFee,
      discount: couponDiscount,
      total: cartTotal,
      couponCode: appliedCoupon?.code,
      status: 'Pending',
    };

    // 1. Write Order to Firestore
    try {
      await setDoc(doc(db, 'orders', newOrder.id), newOrder);
    } catch (err) {
      console.warn('Direct Firestore order write failed, keeping in local state:', err);
    }

    // 2. Upsert Customer Record in Firestore
    try {
      const custId = `cust-${orderData.phone.replace(/\D/g, '') || Math.random().toString(36).substring(2, 7)}`;
      const customerDocRef = doc(db, 'customers', custId);
      const existingCust = await getDoc(customerDocRef);
      if (existingCust.exists()) {
        const data = existingCust.data() as CustomerRecord;
        await setDoc(customerDocRef, {
          name: orderData.customerName,
          phone: orderData.phone,
          whatsappNumber: orderData.whatsappNumber || orderData.phone,
          address: orderData.address,
          area: orderData.area,
          city: orderData.city,
          ordersCount: (data.ordersCount || 1) + 1,
          totalSpent: (data.totalSpent || 0) + cartTotal,
          lastOrderDate: new Date().toISOString(),
          lastOrderId: newOrder.orderNumber,
        }, { merge: true });
      } else {
        await setDoc(customerDocRef, {
          id: custId,
          name: orderData.customerName,
          phone: orderData.phone,
          whatsappNumber: orderData.whatsappNumber || orderData.phone,
          address: orderData.address,
          area: orderData.area,
          city: orderData.city,
          ordersCount: 1,
          totalSpent: cartTotal,
          lastOrderDate: new Date().toISOString(),
          lastOrderId: newOrder.orderNumber,
        });
      }
    } catch (custErr) {
      console.warn('Customer upsert error:', custErr);
    }

    // 3. Decrement Product Stock in Firestore
    try {
      for (const cartItem of cart) {
        if (cartItem.productId) {
          const p = products.find((prod) => prod.id === cartItem.productId);
          if (p) {
            const newStock = Math.max(0, (p.stockCount ?? 0) - cartItem.quantity);
            await updateDoc(doc(db, 'products', p.id), {
              stockCount: newStock,
              inStock: newStock > 0,
              status: newStock > 0 ? (p.status === 'Draft' ? 'Draft' : 'Active') : 'Out of Stock',
            });
          }
        }
      }
    } catch (stockErr) {
      console.warn('Stock update error:', stockErr);
    }

    setOrders((prev) => [newOrder, ...prev]);
    setLastCompletedOrder(newOrder);
    clearCart();
    setActiveView('order-success');
    return newOrder;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch (err) {
      console.warn('Firestore updateOrderStatus error:', err);
    }
    setOrders((prev) => prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord)));
  };

  const deleteOrder = async (orderId: string) => {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (err) {
      console.warn('Firestore deleteOrder error:', err);
    }
    setOrders((prev) => prev.filter((ord) => ord.id !== orderId));
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  };

  const getOrdersByPhone = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone) return [];
    return orders.filter((o) => o.phone.replace(/\D/g, '').includes(cleanPhone) || o.whatsappNumber.replace(/\D/g, '').includes(cleanPhone));
  };

  const reorderPastOrder = (order: Order) => {
    const itemsToAdd: CartItem[] = order.items.map((item) => ({
      ...item,
      cartItemId: `cart-reorder-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    }));
    setCart((prev) => [...prev, ...itemsToAdd]);
    setIsCartOpen(true);
  };

  // Product Actions in Firestore
  const addProduct = async (newProduct: Omit<Product, 'id'>): Promise<Product> => {
    const calculatedDiscount =
      newProduct.originalPrice && newProduct.originalPrice > newProduct.price
        ? Math.round(((newProduct.originalPrice - newProduct.price) / newProduct.originalPrice) * 100)
        : newProduct.discountPercentage || 0;

    const product: Product = {
      ...newProduct,
      id: `prod-${Date.now()}`,
      inStock: newProduct.stockCount > 0,
      discountPercentage: calculatedDiscount,
      status: newProduct.status || (newProduct.stockCount > 0 ? 'Active' : 'Out of Stock'),
    };

    try {
      await setDoc(doc(db, 'products', product.id), product);
      console.log(`Product ${product.id} added to Firestore successfully`);
    } catch (err: any) {
      console.error('Firestore addProduct error:', err);
      // Re-throw so the caller knows the operation failed
      throw new Error(`Firestore write failed: ${err?.message || 'Unknown error'}`);
    }

    // Only update local state AFTER successful Firestore write
    setProducts((prev) => [product, ...prev]);
    return product;
  };

  const updateProduct = async (id: string, updatedFields: Partial<Product>) => {
    let finalMerged: Partial<Product> = { ...updatedFields };

    if (updatedFields.price !== undefined || updatedFields.originalPrice !== undefined) {
      const existing = products.find((p) => p.id === id);
      const original = updatedFields.originalPrice ?? existing?.originalPrice ?? 0;
      const current = updatedFields.price ?? existing?.price ?? 0;
      if (original > current && original > 0) {
        finalMerged.discountPercentage = Math.round(((original - current) / original) * 100);
      } else {
        finalMerged.discountPercentage = 0;
      }
    }

    if (updatedFields.stockCount !== undefined) {
      finalMerged.inStock = updatedFields.stockCount > 0;
      if (updatedFields.stockCount === 0) {
        finalMerged.status = 'Out of Stock';
      } else {
        finalMerged.status = 'Active';
      }
    }

    // Attempt Firestore write first, throw if it fails
    try {
      await updateDoc(doc(db, 'products', id), finalMerged);
        console.log(`Product ${id} updated in Firestore successfully`);
     } catch (err: any) {
       console.error('Firestore updateProduct error - Full details:', {
         productId: id,
         message: err?.message,
         code: err?.code,
         name: err?.name,
         fullError: err,
       });
       throw new Error(`Firestore update failed [${err?.code}]: ${err?.message || 'Unknown error'}`);
  }

    // Only update local state AFTER successful Firestore write
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...finalMerged } : p))
    );

    // Update active cart if affected
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.productId === id) {
          return {
            ...item,
            name: finalMerged.name ?? item.name,
            price: finalMerged.price ?? item.price,
            image: finalMerged.image ?? item.image,
            weight: finalMerged.weight ?? item.weight,
            brand: finalMerged.brand ?? item.brand,
          };
        }
        return item;
      })
    );
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      console.log(`Product ${id} deleted from Firestore successfully`);
    } catch (err: any) {
       console.error('Firestore deleteProduct error - Full details:', {
         message: err?.message,
         code: err?.code,
         name: err?.name,
         fullError: err,
       });
       // Re-throw with full error code for debugging Firestore permission issues
       throw new Error(`Firestore delete failed [${err?.code}]: ${err?.message || 'Unknown error'}`);
    }
    // Only update local state AFTER successful Firestore delete
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((c) => c.productId !== id));
  };

  const duplicateProduct = async (id: string) => {
    const existing = products.find((p) => p.id === id);
    if (!existing) return;
    const duplicated: Product = {
      ...existing,
      id: `prod-${Date.now()}`,
      name: `${existing.name} (Copy)`,
      sku: existing.sku ? `${existing.sku}-COPY` : undefined,
    };
    try {
      await setDoc(doc(db, 'products', duplicated.id), duplicated);
      console.log(`Product ${duplicated.id} duplicated to Firestore successfully`);
    } catch (err: any) {
      console.error('Firestore duplicateProduct error:', err);
      // Re-throw so the caller knows the operation failed
      throw new Error(`Firestore write failed: ${err?.message || 'Unknown error'}`);
    }
    // Only update local state AFTER successful Firestore write
    setProducts((prev) => [duplicated, ...prev]);
  };

  const toggleProductStatus = async (id: string) => {
    const p = products.find((prod) => prod.id === id);
    if (!p) return;
    const nextStatus = p.status === 'Active' ? 'Draft' : 'Active';
    const inStock = nextStatus === 'Active' ? (p.stockCount ?? 0) > 0 : false;
    await updateProduct(id, { status: nextStatus, inStock });
  };

  const updateProductStock = async (id: string, newStock: number) => {
    await updateProduct(id, { stockCount: Math.max(0, newStock) });
  };

  const toggleFeaturedProduct = async (id: string) => {
    const p = products.find((prod) => prod.id === id);
    if (!p) return;
    await updateProduct(id, { featured: !p.featured });
  };

  const toggleBestSeller = async (id: string) => {
    const p = products.find((prod) => prod.id === id);
    if (!p) return;
    await updateProduct(id, { isBestSeller: !p.isBestSeller });
  };

  const toggleNewArrival = async (id: string) => {
    const p = products.find((prod) => prod.id === id);
    if (!p) return;
    await updateProduct(id, { isNewArrival: !p.isNewArrival });
  };

  const toggleDeal = async (id: string) => {
    const p = products.find((prod) => prod.id === id);
    if (!p) return;
    await updateProduct(id, { isDeal: !p.isDeal });
  };

  // Category Actions in Firestore
  const addCategory = async (newCat: Omit<Category, 'id'>): Promise<Category> => {
    const slug = newCat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const category: Category = {
      ...newCat,
      id: `cat-${Date.now()}`,
      slug: newCat.slug || slug,
      itemCount: 0,
      order: categories.length + 1,
    };
    try {
      await setDoc(doc(db, 'categories', category.id), category);
      console.log(`Category ${category.id} added to Firestore successfully`);
    } catch (err: any) {
      console.error('Firestore addCategory error:', err);
      throw new Error(`Firestore write failed: ${err?.message || 'Unknown error'}`);
    }
    setCategories((prev) => [...prev, category]);
    return category;
  };

  const updateCategory = async (id: string, updatedFields: Partial<Category>) => {
    try {
      await updateDoc(doc(db, 'categories', id), updatedFields);
      console.log(`Category ${id} updated in Firestore successfully`);
    } catch (err: any) {
      console.error('Firestore updateCategory error:', err);
      throw new Error(`Firestore write failed: ${err?.message || 'Unknown error'}`);
    }
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      console.log(`Category ${id} deleted from Firestore successfully`);
    } catch (err: any) {
      console.error('Firestore deleteCategory error:', err);
      throw new Error(`Firestore delete failed: ${err?.message || 'Unknown error'}`);
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const reorderCategory = async (id: string, direction: 'up' | 'down') => {
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categories.length) return;
    
    const updated = [...categories];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);

    // Save orders to Firestore
    try {
      const batch = writeBatch(db);
      updated.forEach((cat, idx) => {
        cat.order = idx + 1;
        batch.update(doc(db, 'categories', cat.id), { order: idx + 1 });
      });
      await batch.commit();
    } catch (err) {
      console.error('Firestore reorderCategory error:', err);
    }

    setCategories(updated);
  };

  // Rashan Package Actions in Firestore
  const addRashanPackage = async (newPkg: Omit<RashanPackage, 'id'>): Promise<RashanPackage> => {
    const pkg: RashanPackage = {
      ...newPkg,
      id: `rashan-${Date.now()}`,
    };
    try {
      await setDoc(doc(db, 'rashanPackages', pkg.id), pkg);
      console.log(`Rashan package ${pkg.id} added to Firestore successfully`);
    } catch (err: any) {
      console.error('Firestore addRashanPackage error:', err);
      throw new Error(`Firestore write failed: ${err?.message || 'Unknown error'}`);
    }
    setRashanPackages((prev) => [pkg, ...prev]);
    return pkg;
  };

  const updateRashanPackage = async (id: string, updatedFields: Partial<RashanPackage>) => {
    try {
      await updateDoc(doc(db, 'rashanPackages', id), updatedFields);
      console.log(`Rashan package ${id} updated in Firestore successfully`);
    } catch (err: any) {
       console.error('Firestore updateRashanPackage error - Full details:', {
         packageId: id,
         message: err?.message,
         code: err?.code,
         fullError: err,
       });
       throw new Error(`Firestore update failed [${err?.code}]: ${err?.message || 'Unknown error'}`);
    }
    setRashanPackages((prev) =>
      prev.map((pkg) => (pkg.id === id ? { ...pkg, ...updatedFields } : pkg))
    );
  };

  const deleteRashanPackage = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'rashanPackages', id));
      console.log(`Rashan package ${id} deleted from Firestore successfully`);
    } catch (err: any) {
       console.error('Firestore deleteRashanPackage error - Full details:', {
         packageId: id,
         message: err?.message,
         code: err?.code,
         fullError: err,
       });
       throw new Error(`Firestore delete failed [${err?.code}]: ${err?.message || 'Unknown error'}`);
    }
    setRashanPackages((prev) => prev.filter((p) => p.id !== id));
  };

  const duplicateRashanPackage = async (id: string) => {
    const target = rashanPackages.find((p) => p.id === id);
    if (!target) return;
    const copy: RashanPackage = {
      ...target,
      id: `rashan-${Date.now()}`,
      name: `${target.name} (Copy)`,
    };
    try {
      await setDoc(doc(db, 'rashanPackages', copy.id), copy);
      console.log(`Rashan package ${copy.id} duplicated to Firestore successfully`);
    } catch (err: any) {
      console.error('Firestore duplicateRashanPackage error:', err);
      throw new Error(`Firestore write failed: ${err?.message || 'Unknown error'}`);
    }
    setRashanPackages((prev) => [copy, ...prev]);
  };

  // Hero and Banner Actions in Firestore
  const updateHeroConfig = async (config: Partial<HeroBannerConfig>) => {
    try {
      await setDoc(doc(db, 'homepage', 'hero'), config, { merge: true });
    } catch (err) {
      console.error('Firestore updateHeroConfig error:', err);
    }
    setHeroConfig((prev) => ({ ...prev, ...config }));
  };

  const addPromoBanner = async (banner: Omit<PromoBanner, 'id'>): Promise<PromoBanner> => {
    const newBanner: PromoBanner = {
      ...banner,
      id: `banner-${Date.now()}`,
    };
    try {
      await setDoc(doc(db, 'promoBanners', newBanner.id), newBanner);
    } catch (err) {
      console.error('Firestore addPromoBanner error:', err);
    }
    setPromoBanners((prev) => [...prev, newBanner]);
    return newBanner;
  };

  const updatePromoBanner = async (id: string, updatedFields: Partial<PromoBanner>) => {
    try {
      await updateDoc(doc(db, 'promoBanners', id), updatedFields);
    } catch (err) {
      console.error('Firestore updatePromoBanner error:', err);
    }
    setPromoBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedFields } : b))
    );
  };

  const deletePromoBanner = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'promoBanners', id));
    } catch (err) {
      console.error('Firestore deletePromoBanner error:', err);
    }
    setPromoBanners((prev) => prev.filter((b) => b.id !== id));
  };

  // Store Settings in Firestore
  const updateStoreSettings = async (newSettings: Partial<StoreSettings>) => {
    try {
      await setDoc(doc(db, 'storeSettings', 'main'), newSettings, { merge: true });
    } catch (err) {
      console.error('Firestore updateStoreSettings error:', err);
    }
    setStoreSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetToDefaults = async () => {
    await syncCloudSeed();
    clearCart();
  };

  const exportDataJSON = () => {
    const dump = {
      version: '2.0-cloud',
      exportedAt: new Date().toISOString(),
      storeSettings,
      heroConfig,
      promoBanners,
      categories,
      products,
      rashanPackages,
      orders,
      customers: derivedCustomers,
    };
    return JSON.stringify(dump, null, 2);
  };

  const importDataJSON = async (jsonString: string): Promise<{ success: boolean; message: string }> => {
    try {
      const parsed = JSON.parse(jsonString);
      const batch = writeBatch(db);

      if (parsed.products && Array.isArray(parsed.products)) {
        parsed.products.forEach((p: Product) => {
          batch.set(doc(db, 'products', p.id), p, { merge: true });
        });
        setProducts(parsed.products);
      }
      if (parsed.categories && Array.isArray(parsed.categories)) {
        parsed.categories.forEach((c: Category) => {
          batch.set(doc(db, 'categories', c.id), c, { merge: true });
        });
        setCategories(parsed.categories);
      }
      if (parsed.rashanPackages && Array.isArray(parsed.rashanPackages)) {
        parsed.rashanPackages.forEach((pkg: RashanPackage) => {
          batch.set(doc(db, 'rashanPackages', pkg.id), pkg, { merge: true });
        });
        setRashanPackages(parsed.rashanPackages);
      }
      if (parsed.storeSettings && typeof parsed.storeSettings === 'object') {
        batch.set(doc(db, 'storeSettings', 'main'), parsed.storeSettings, { merge: true });
        setStoreSettings(parsed.storeSettings);
      }
      if (parsed.heroConfig && typeof parsed.heroConfig === 'object') {
        batch.set(doc(db, 'homepage', 'hero'), parsed.heroConfig, { merge: true });
        setHeroConfig(parsed.heroConfig);
      }

      await batch.commit();
      return { success: true, message: 'Cloud database restored and synchronized with Firestore successfully!' };
    } catch (err: any) {
      return { success: false, message: err?.message || 'Invalid JSON file format.' };
    }
  };

  // WhatsApp Message Generator
  const generateWhatsAppOrderUrl = (orderOrCustomItems?: {
    items: CartItem[];
    total: number;
    name?: string;
    address?: string;
    phone?: string;
  }) => {
    const cleanNumber = storeSettings.whatsappNumber.replace(/[^0-9]/g, '');
    const itemsList = orderOrCustomItems?.items || cart;
    const currentTotal = orderOrCustomItems?.total !== undefined ? orderOrCustomItems.total : cartTotal;

    if (itemsList.length === 0) {
      const genericMsg = encodeURIComponent(
        `*Assalamualaikum ${storeSettings.storeName}!*\nI have an inquiry regarding grocery items and Monthly Rashan packages in Hyderabad.`
      );
      return `https://wa.me/${cleanNumber}?text=${genericMsg}`;
    }

    let message = `*Assalamualaikum ${storeSettings.storeName}, I want to place an order:*\n\n`;
    itemsList.forEach((item, index) => {
      message += `${index + 1}. *${item.name}* ${item.weight ? `(${item.weight})` : ''} × ${item.quantity} = Rs. ${(item.price * item.quantity).toLocaleString()}\n`;
      if (item.packageItems && item.packageItems.length > 0) {
        message += `   ↳ _Package includes: ${item.packageItems.map((pi) => `${pi.productName} (${pi.quantity})`).slice(0, 4).join(', ')}..._\n`;
      }
    });

    message += `\n*Subtotal:* Rs. ${(orderOrCustomItems ? itemsList.reduce((a, b) => a + b.price * b.quantity, 0) : cartSubtotal).toLocaleString()}`;
    if (!orderOrCustomItems && deliveryFee > 0) {
      message += `\n*Delivery Fee:* Rs. ${deliveryFee}`;
    } else if (!orderOrCustomItems) {
      message += `\n*Delivery Fee:* FREE (Hyderabad)`;
    }
    if (!orderOrCustomItems && couponDiscount > 0) {
      message += `\n*Discount:* -Rs. ${couponDiscount.toLocaleString()}`;
    }
    message += `\n*Total Estimated:* Rs. ${currentTotal.toLocaleString()}\n`;

    if (orderOrCustomItems?.name) {
      message += `\n*Customer Name:* ${orderOrCustomItems.name}`;
      message += `\n*Delivery Address:* ${orderOrCustomItems.address || ''}`;
      message += `\n*Phone:* ${orderOrCustomItems.phone || ''}`;
    } else {
      message += `\n*Customer Name:* \n*Delivery Address:* \n*Area / City:* Hyderabad, Sindh\n*Payment:* Cash on Delivery / EasyPaisa / JazzCash`;
    }

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
  };

  const generateDirectProductWhatsAppUrl = (product: Product, quantity = 1) => {
    const cleanNumber = storeSettings.whatsappNumber.replace(/[^0-9]/g, '');
    const totalPrice = product.price * quantity;
    const msg = `*Assalamualaikum ${storeSettings.storeName}!*
I would like to order:
*Product:* ${product.name}
*Brand:* ${product.brand}
*Weight:* ${product.weight}
*Quantity:* ${quantity}
*Price:* Rs. ${totalPrice.toLocaleString()}

Please confirm availability and delivery in Hyderabad.`;

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
  };

  const generateWhatsAppOrderStatusUrl = (order: Order) => {
    const customerPhone = order.whatsappNumber || order.phone;
    const cleanNumber = customerPhone.replace(/[^0-9]/g, '');
    const msg = `*Assalamualaikum ${order.customerName}!*
Greetings from *${storeSettings.storeName}*.

Your Order *#${order.orderNumber}* status has been updated to: *${order.status.toUpperCase()}*

*Order Details:*
• Total Amount: Rs. ${order.total.toLocaleString()}
• Items: ${order.items.length} products
• Delivery Address: ${order.address}, ${order.area}, Hyderabad

For assistance, contact our helpline: ${storeSettings.phone}`;

    return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        rashanPackages,
        storeSettings,
        heroConfig,
        promoBanners,
        cart,
        appliedCoupon,
        orders,
        customers: derivedCustomers,
        isCartOpen,
        selectedProduct,
        activeView,
        activeCategory,
        searchQuery,
        lastCompletedOrder,
        isLoadingFirestore,
        isCloudConnected,
        firestoreError,
        syncCloudSeed,
        setIsCartOpen,
        setSelectedProduct,
        setActiveView,
        setActiveCategory,
        setSearchQuery,
        addToCart,
        addPackageToCart,
        addCustomRashanToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        cartCount,
        cartSubtotal,
        deliveryFee,
        couponDiscount,
        cartTotal,
        placeOrder,
        updateOrderStatus,
        deleteOrder,
        getOrderById,
        getOrdersByPhone,
        reorderPastOrder,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        toggleProductStatus,
        updateProductStock,
        toggleFeaturedProduct,
        toggleBestSeller,
        toggleNewArrival,
        toggleDeal,
        addCategory,
        updateCategory,
        deleteCategory,
        reorderCategory,
        addRashanPackage,
        updateRashanPackage,
        deleteRashanPackage,
        duplicateRashanPackage,
        updateHeroConfig,
        addPromoBanner,
        updatePromoBanner,
        deletePromoBanner,
        updateStoreSettings,
        resetToDefaults,
        exportDataJSON,
        importDataJSON,
        isAdminAuthenticated,
        adminUser,
        adminLogin,
        adminLogout,
        generateWhatsAppOrderUrl,
        generateDirectProductWhatsAppUrl,
        generateWhatsAppOrderStatusUrl,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
