export interface Product {
  id: string;
  name: string;
  nameUrdu?: string;
  category: string;
  subcategory?: string;
  brand: string;
  weight: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  inStock: boolean;
  stockCount: number;
  image: string;
  images?: string[];
  description: string;
  sku?: string;
  status?: 'Active' | 'Draft' | 'Out of Stock';
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  isDeal?: boolean;
  unit: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameUrdu?: string;
  slug: string;
  iconName?: string;
  image: string;
  itemCount?: number;
  description: string;
  order?: number;
  subcategories?: string[];
}

export interface RashanPackageItem {
  id?: string;
  productName: string;
  productNameUrdu?: string;
  quantity: string;
  estimatedPrice?: number;
  unit?: string;
}

export interface RashanPackage {
  id: string;
  name: string;
  nameUrdu?: string;
  tier?: 'basic' | 'family' | 'premium' | 'custom' | string;
  tagline?: string;
  description: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  familySize: string;
  image: string;
  items: RashanPackageItem[];
  isPopular?: boolean;
  active?: boolean;
  badge?: string;
  savingsText?: string;
}

export interface CartItem {
  cartItemId: string;
  type: 'product' | 'rashan_package' | 'custom_rashan';
  productId?: string;
  packageId?: string;
  name: string;
  brand?: string;
  price: number;
  quantity: number;
  weight?: string;
  image: string;
  packageItems?: RashanPackageItem[];
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Preparing'
  | 'Processing'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod =
  | 'Cash on Delivery'
  | 'EasyPaisa'
  | 'JazzCash'
  | 'Bank Transfer';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  area: string;
  city: string;
  deliveryNotes?: string;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
}

export interface HeroBannerConfig {
  badgeText: string;
  heading: string;
  highlightWord: string;
  subheading: string;
  description: string;
  buttonText: string;
  buttonLink: 'shop' | 'rashan' | 'deals' | 'categories' | 'rashan-builder';
  secondaryButtonText: string;
  secondaryButtonLink: 'shop' | 'rashan' | 'deals' | 'categories' | 'rashan-builder';
  bannerImage?: string;
}

export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  code?: string;
  image: string;
  buttonText: string;
  buttonLink: 'shop' | 'rashan' | 'deals' | 'categories' | 'rashan-builder';
  active: boolean;
}

export interface CustomerRecord {
  id: string;
  name: string;
  phone: string;
  whatsappNumber: string;
  address: string;
  area: string;
  city: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate: string;
  lastOrderId?: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  whatsappNumber: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  deliveryFee: number;
  freeDeliveryThreshold: number;
  minimumOrder: number;
  openingHours: string;
  announcement: string;
  logo?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  bankDetails: {
    bankName: string;
    accountTitle: string;
    accountNumber: string;
    iban: string;
  };
  easypaisaNumber: string;
  jazzcashNumber: string;
}

export interface Coupon {
  code: string;
  discountType: 'fixed' | 'percentage';
  value: number;
  minOrder: number;
  description: string;
}

