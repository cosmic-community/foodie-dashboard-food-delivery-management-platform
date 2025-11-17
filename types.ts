// Base Cosmic object interface
export interface CosmicObject {
  id: string;
  slug: string;
  title: string;
  content?: string;
  metadata: Record<string, any>;
  type: string;
  created_at: string;
  modified_at: string;
}

// Restaurant type
export interface Restaurant extends CosmicObject {
  type: 'restaurants';
  metadata: {
    cover_image?: {
      url: string;
      imgix_url: string;
    };
    logo?: {
      url: string;
      imgix_url: string;
    };
    short_description?: string;
    full_description?: string;
    address?: string;
    city?: string;
    country?: string;
    contact_phone?: string;
    opening_hours?: string;
    delivery_time?: string;
    cuisine_types?: string[];
    rating?: number;
    status?: RestaurantStatus;
  };
}

export type RestaurantStatus = 'Active' | 'Inactive';

// Menu Category type
export interface MenuCategory extends CosmicObject {
  type: 'menu-categories';
  metadata: {
    description?: string;
    image?: {
      url: string;
      imgix_url: string;
    };
    restaurant?: Restaurant;
  };
}

// Menu Item type
export interface MenuItem extends CosmicObject {
  type: 'menu-items';
  metadata: {
    description?: string;
    photo?: {
      url: string;
      imgix_url: string;
    };
    price?: string;
    discounted_price?: string;
    ingredients?: string;
    tags?: string[];
    available?: boolean;
    category?: MenuCategory;
    restaurant?: Restaurant;
  };
}

// Order type
export interface Order extends CosmicObject {
  type: 'orders';
  metadata: {
    order_number?: string;
    customer_name?: string;
    customer_email?: string;
    customer_phone?: string;
    delivery_address?: string;
    restaurant?: Restaurant;
    order_items?: OrderItem[];
    subtotal?: string;
    delivery_fee?: string;
    total?: string;
    order_status?: OrderStatus;
    payment_status?: PaymentStatus;
    payment_method?: string;
  };
}

export interface OrderItem {
  menu_item?: string;
  quantity?: string;
  price?: string;
}

export type OrderStatus = 'Pending' | 'Preparing' | 'Ready' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Paid' | 'Not Paid';

// Delivery Partner type
export interface DeliveryPartner extends CosmicObject {
  type: 'delivery-partners';
  metadata: {
    phone_number?: string;
    profile_photo?: {
      url: string;
      imgix_url: string;
    };
    vehicle_type?: string;
    active?: boolean;
    assigned_orders?: Order[];
  };
}

// Featured Collection type
export interface FeaturedCollection extends CosmicObject {
  type: 'featured-collections';
  metadata: {
    description?: string;
    restaurants?: Restaurant[];
  };
}

// App Settings type
export interface AppSettings extends CosmicObject {
  type: 'app-settings';
  metadata: {
    hero_title?: string;
    hero_subtitle?: string;
    cta_button_text?: string;
    promo_banners?: PromoBanner[];
    supported_cities?: string[];
    faqs?: FAQ[];
  };
}

export interface PromoBanner {
  image?: {
    url: string;
    imgix_url: string;
  };
  text?: string;
  link?: string;
}

export interface FAQ {
  question?: string;
  answer?: string;
}

// API response types
export interface CosmicResponse<T> {
  objects: T[];
  total: number;
  limit: number;
  skip: number;
}

// Type guards
export function isRestaurant(obj: CosmicObject): obj is Restaurant {
  return obj.type === 'restaurants';
}

export function isMenuItem(obj: CosmicObject): obj is MenuItem {
  return obj.type === 'menu-items';
}

export function isOrder(obj: CosmicObject): obj is Order {
  return obj.type === 'orders';
}

// Helper for Cosmic SDK errors
export function hasStatus(error: unknown): error is { status: number } {
  return typeof error === 'object' && error !== null && 'status' in error;
}