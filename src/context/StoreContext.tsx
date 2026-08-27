import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
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
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_HERO_CONFIG,
  INITIAL_PRODUCTS,
  INITIAL_PROMO_BANNERS,
  INITIAL_RASHAN_PACKAGES,
  INITIAL_STORE_SETTINGS,
} from '../data/initialData';

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
  placeOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status' | 'subtotal' | 'deliveryFee' | 'discount' | 'total' | 'items'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByPhone: (phone: string) => Order[];
  reorderPastOrder: (order: Order) => void;

  // Admin Product Actions
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, updatedFields: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  toggleProductStatus: (id: string) => void;
  updateProductStock: (id: string, newStock: number) => void;
  toggleFeaturedProduct: (id: string) => void;
  toggleBestSeller: (id: string) => void;
  toggleNewArrival: (id: string) => void;
  toggleDeal: (id: string) => void;

  // Admin Category Actions
  addCategory: (cat: Omit<Category, 'id'>) => Category;
  updateCategory: (id: string, updatedFields: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  reorderCategory: (id: string, direction: 'up' | 'down') => void;

  // Admin Rashan Actions
  addRashanPackage: (pkg: Omit<RashanPackage, 'id'>) => RashanPackage;
  updateRashanPackage: (id: string, updatedFields: Partial<RashanPackage>) => void;
  deleteRashanPackage: (id: string) => void;
  duplicateRashanPackage: (id: string) => void;

  // Admin Homepage & Banner Actions
  updateHeroConfig: (config: Partial<HeroBannerConfig>) => void;
  addPromoBanner: (banner: Omit<PromoBanner, 'id'>) => PromoBanner;
  updatePromoBanner: (id: string, updatedFields: Partial<PromoBanner>) => void;
  deletePromoBanner: (id: string) => void;

  // Store Settings & Data
  updateStoreSettings: (newSettings: Partial<StoreSettings>) => void;
  resetToDefaults: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => { success: boolean; message: string };

  // WhatsApp Helpers
  generateWhatsAppOrderUrl: (orderOrCustomItems?: { items: CartItem[]; total: number; name?: string; address?: string; phone?: string }) => string;
  generateDirectProductWhatsAppUrl: (product: Product, quantity?: number) => string;
  generateWhatsAppOrderStatusUrl: (order: Order) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'juneo_products_v2',
  CATEGORIES: 'juneo_categories_v2',
  PACKAGES: 'juneo_rashan_packages_v2',
  SETTINGS: 'juneo_settings_v2',
  HERO: 'juneo_hero_config_v2',
  BANNERS: 'juneo_banners_v2',
  CART: 'juneo_cart_v2',
  COUPON: 'juneo_coupon_v2',
  ORDERS: 'juneo_orders_v2',
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. PRODUCTS
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // 2. CATEGORIES
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  // 3. RASHAN PACKAGES
  const [rashanPackages, setRashanPackages] = useState<RashanPackage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PACKAGES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return INITIAL_RASHAN_PACKAGES;
    } catch {
      return INITIAL_RASHAN_PACKAGES;
    }
  });

  // 4. STORE SETTINGS
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_STORE_SETTINGS,
          ...parsed,
          city: 'Hyderabad, Sindh, Pakistan',
          freeDeliveryThreshold: parsed.freeDeliveryThreshold ?? 8000,
          deliveryFee: parsed.deliveryFee ?? 200,
          announcement: parsed.announcement || '🚚 FREE DELIVERY ON ORDERS RS. 8,000+ | 📍 DELIVERY AVAILABLE IN HYDERABAD ONLY',
        };
      }
      return INITIAL_STORE_SETTINGS;
    } catch {
      return INITIAL_STORE_SETTINGS;
    }
  });

  // 5. HERO CONFIG
  const [heroConfig, setHeroConfig] = useState<HeroBannerConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HERO);
      if (saved) return JSON.parse(saved);
      return INITIAL_HERO_CONFIG;
    } catch {
      return INITIAL_HERO_CONFIG;
    }
  });

  // 6. PROMO BANNERS
  const [promoBanners, setPromoBanners] = useState<PromoBanner[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BANNERS);
      if (saved) return JSON.parse(saved);
      return INITIAL_PROMO_BANNERS;
    } catch {
      return INITIAL_PROMO_BANNERS;
    }
  });

  // 7. CART
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 8. COUPON
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COUPON);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // 9. ORDERS
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'ord-1001',
          orderNumber: 'JS-84920',
          date: new Date(Date.now() - 86400000 * 2).toISOString(),
          customerName: 'Muhammad Bilal Khan',
          phone: '03009876543',
          whatsappNumber: '03009876543',
          address: 'House 42-B, Street 7, Autobahn Road',
          area: 'Latifabad Unit 7',
          city: 'Hyderabad, Sindh',
          deliveryNotes: 'Please ring bell twice, call upon arrival',
          paymentMethod: 'Cash on Delivery',
          items: [
            {
              cartItemId: 'c-past-1',
              type: 'rashan_package',
              name: 'Basic Rashan Package',
              price: 8950,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
            },
            {
              cartItemId: 'c-past-2',
              type: 'product',
              productId: 'prod-tea-1',
              name: 'Tapal Danedar Black Tea 900g Economy Pack',
              brand: 'Tapal',
              price: 1580,
              quantity: 1,
              weight: '900 g',
              image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80',
            }
          ],
          subtotal: 10530,
          deliveryFee: 0,
          discount: 500,
          total: 10030,
          couponCode: 'RASHAN500',
          status: 'Delivered',
        },
        {
          id: 'ord-1002',
          orderNumber: 'JS-91204',
          date: new Date(Date.now() - 86400000 * 0.5).toISOString(),
          customerName: 'Syed Tariq Shah',
          phone: '03123456789',
          whatsappNumber: '03123456789',
          address: 'Flat 304, Al-Madina Heights, Saddar',
          area: 'Saddar / Cantt Hyderabad',
          city: 'Hyderabad, Sindh',
          deliveryNotes: 'Deliver between 4 PM to 7 PM',
          paymentMethod: 'EasyPaisa',
          items: [
            {
              cartItemId: 'c-past-3',
              type: 'product',
              productId: 'prod-atta-1',
              name: 'Sunridge Whole Wheat Chakki Atta 10kg',
              brand: 'Sunridge',
              price: 1450,
              quantity: 2,
              weight: '10 kg',
              image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
            },
            {
              cartItemId: 'c-past-4',
              type: 'product',
              productId: 'prod-oil-1',
              name: 'Dalda Cooking Oil 5 Litre Tin',
              brand: 'Dalda',
              price: 2750,
              quantity: 2,
              weight: '5 Litres',
              image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
            }
          ],
          subtotal: 8400,
          deliveryFee: 0,
          discount: 0,
          total: 8400,
          status: 'Confirmed',
        }
      ];
    } catch {
      return [];
    }
  });

  // UI Navigation states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeView, setActiveView] = useState<'home' | 'shop' | 'categories' | 'rashan' | 'rashan-builder' | 'deals' | 'checkout' | 'order-success' | 'reorder' | 'admin'>('home');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(rashanPackages));
  }, [rashanPackages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(storeSettings));
  }, [storeSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HERO, JSON.stringify(heroConfig));
  }, [heroConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(promoBanners));
  }, [promoBanners]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUPON, JSON.stringify(appliedCoupon));
  }, [appliedCoupon]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  // Derived Customers List from Orders
  const customers = useMemo<CustomerRecord[]>(() => {
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
  }, [orders]);

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

  // Orders and Inventory auto-decrement
  const placeOrder = (
    orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status' | 'subtotal' | 'deliveryFee' | 'discount' | 'total' | 'items'>
  ): Order => {
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
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

    // Auto-decrease stock for products ordered
    setProducts((prevProducts) => {
      return prevProducts.map((p) => {
        const itemInCart = cart.find((c) => c.productId === p.id);
        if (itemInCart) {
          const newStock = Math.max(0, (p.stockCount ?? 0) - itemInCart.quantity);
          return {
            ...p,
            stockCount: newStock,
            inStock: newStock > 0,
            status: newStock > 0 ? (p.status === 'Draft' ? 'Draft' : 'Active') : 'Out of Stock',
          };
        }
        return p;
      });
    });

    setOrders((prev) => [newOrder, ...prev]);
    setLastCompletedOrder(newOrder);
    clearCart();
    setActiveView('order-success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
  };

  const deleteOrder = (orderId: string) => {
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

  // Product Actions
  const addProduct = (newProduct: Omit<Product, 'id'>): Product => {
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
    setProducts((prev) => [product, ...prev]);
    return product;
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const merged = { ...p, ...updatedFields };
        if (updatedFields.price !== undefined || updatedFields.originalPrice !== undefined) {
          const original = merged.originalPrice || 0;
          const current = merged.price;
          if (original > current) {
            merged.discountPercentage = Math.round(((original - current) / original) * 100);
          } else {
            merged.discountPercentage = 0;
          }
        }
        if (updatedFields.stockCount !== undefined) {
          merged.inStock = merged.stockCount > 0;
          if (merged.stockCount === 0 && merged.status !== 'Draft') {
            merged.status = 'Out of Stock';
          } else if (merged.stockCount > 0 && merged.status === 'Out of Stock') {
            merged.status = 'Active';
          }
        }
        return merged;
      })
    );

    // If product is in cart, update its price/image/name in active cart
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.productId === id) {
          return {
            ...item,
            name: updatedFields.name ?? item.name,
            price: updatedFields.price ?? item.price,
            image: updatedFields.image ?? item.image,
            weight: updatedFields.weight ?? item.weight,
            brand: updatedFields.brand ?? item.brand,
          };
        }
        return item;
      })
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((c) => c.productId !== id));
  };

  const duplicateProduct = (id: string) => {
    const existing = products.find((p) => p.id === id);
    if (!existing) return;
    const duplicated: Product = {
      ...existing,
      id: `prod-${Date.now()}`,
      name: `${existing.name} (Copy)`,
      sku: existing.sku ? `${existing.sku}-COPY` : undefined,
    };
    setProducts((prev) => [duplicated, ...prev]);
  };

  const toggleProductStatus = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const nextStatus = p.status === 'Active' ? 'Draft' : 'Active';
        return {
          ...p,
          status: nextStatus,
          inStock: nextStatus === 'Active' ? p.stockCount > 0 : false,
        };
      })
    );
  };

  const updateProductStock = (id: string, newStock: number) => {
    updateProduct(id, { stockCount: Math.max(0, newStock) });
  };

  const toggleFeaturedProduct = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    );
  };

  const toggleBestSeller = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isBestSeller: !p.isBestSeller } : p))
    );
  };

  const toggleNewArrival = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isNewArrival: !p.isNewArrival } : p))
    );
  };

  const toggleDeal = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isDeal: !p.isDeal } : p))
    );
  };

  // Category Actions
  const addCategory = (newCat: Omit<Category, 'id'>): Category => {
    const slug = newCat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const category: Category = {
      ...newCat,
      id: `cat-${Date.now()}`,
      slug: newCat.slug || slug,
      itemCount: 0,
    };
    setCategories((prev) => [...prev, category]);
    return category;
  };

  const updateCategory = (id: string, updatedFields: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
  };

  const deleteCategory = (id: string) => {
    const target = categories.find((c) => c.id === id);
    if (!target) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const reorderCategory = (id: string, direction: 'up' | 'down') => {
    setCategories((prev) => {
      const index = prev.findIndex((c) => c.id === id);
      if (index === -1) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const copy = [...prev];
      const [moved] = copy.splice(index, 1);
      copy.splice(targetIndex, 0, moved);
      return copy;
    });
  };

  // Rashan Package Actions
  const addRashanPackage = (newPkg: Omit<RashanPackage, 'id'>): RashanPackage => {
    const pkg: RashanPackage = {
      ...newPkg,
      id: `rashan-${Date.now()}`,
    };
    setRashanPackages((prev) => [pkg, ...prev]);
    return pkg;
  };

  const updateRashanPackage = (id: string, updatedFields: Partial<RashanPackage>) => {
    setRashanPackages((prev) =>
      prev.map((pkg) => (pkg.id === id ? { ...pkg, ...updatedFields } : pkg))
    );
  };

  const deleteRashanPackage = (id: string) => {
    setRashanPackages((prev) => prev.filter((p) => p.id !== id));
  };

  const duplicateRashanPackage = (id: string) => {
    const target = rashanPackages.find((p) => p.id === id);
    if (!target) return;
    const copy: RashanPackage = {
      ...target,
      id: `rashan-${Date.now()}`,
      name: `${target.name} (Copy)`,
    };
    setRashanPackages((prev) => [copy, ...prev]);
  };

  // Hero and Banner Actions
  const updateHeroConfig = (config: Partial<HeroBannerConfig>) => {
    setHeroConfig((prev) => ({ ...prev, ...config }));
  };

  const addPromoBanner = (banner: Omit<PromoBanner, 'id'>): PromoBanner => {
    const newBanner: PromoBanner = {
      ...banner,
      id: `banner-${Date.now()}`,
    };
    setPromoBanners((prev) => [...prev, newBanner]);
    return newBanner;
  };

  const updatePromoBanner = (id: string, updatedFields: Partial<PromoBanner>) => {
    setPromoBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updatedFields } : b))
    );
  };

  const deletePromoBanner = (id: string) => {
    setPromoBanners((prev) => prev.filter((b) => b.id !== id));
  };

  // Store Settings Actions
  const updateStoreSettings = (newSettings: Partial<StoreSettings>) => {
    setStoreSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setRashanPackages(INITIAL_RASHAN_PACKAGES);
    setStoreSettings(INITIAL_STORE_SETTINGS);
    setHeroConfig(INITIAL_HERO_CONFIG);
    setPromoBanners(INITIAL_PROMO_BANNERS);
    setCart([]);
    setAppliedCoupon(null);
    localStorage.clear();
  };

  const exportDataJSON = () => {
    const dump = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      storeSettings,
      heroConfig,
      promoBanners,
      categories,
      products,
      rashanPackages,
      orders,
    };
    return JSON.stringify(dump, null, 2);
  };

  const importDataJSON = (jsonString: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.products && Array.isArray(parsed.products)) {
        setProducts(parsed.products);
      }
      if (parsed.categories && Array.isArray(parsed.categories)) {
        setCategories(parsed.categories);
      }
      if (parsed.rashanPackages && Array.isArray(parsed.rashanPackages)) {
        setRashanPackages(parsed.rashanPackages);
      }
      if (parsed.storeSettings && typeof parsed.storeSettings === 'object') {
        setStoreSettings(parsed.storeSettings);
      }
      if (parsed.heroConfig && typeof parsed.heroConfig === 'object') {
        setHeroConfig(parsed.heroConfig);
      }
      if (parsed.promoBanners && Array.isArray(parsed.promoBanners)) {
        setPromoBanners(parsed.promoBanners);
      }
      if (parsed.orders && Array.isArray(parsed.orders)) {
        setOrders(parsed.orders);
      }
      return { success: true, message: 'Store database imported and synced successfully!' };
    } catch {
      return { success: false, message: 'Invalid JSON file format.' };
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
        `*Assalamualaikum ${storeSettings.storeName}!*\nI have an inquiry regarding grocery items and Monthly Rashan packages.`
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
        customers,
        isCartOpen,
        selectedProduct,
        activeView,
        activeCategory,
        searchQuery,
        lastCompletedOrder,
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
