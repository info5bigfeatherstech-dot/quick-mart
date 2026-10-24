export const USE_DUMMY_DATA = true;

export const ROUTES = {
  HOME: '/',
  CONTACT_US: '/contact-us',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_AND_CONDITIONS: '/terms-and-conditions',
  PROFILE: '/profile',
  PROFILE_ORDERS: '/profile/orders',
  PROFILE_ADDRESSES: '/profile/addresses',
  PRODUCT_DETAIL: (slug) => `/product/${slug}`,
  CATEGORY: (slug) => `/category/${slug}`,
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: (orderId) => `/order-success/${orderId}`,
};

export const BILL_CONFIG = {
  FREE_DELIVERY_THRESHOLD: 199,
  STANDARD_DELIVERY_FEE: 25,
  HANDLING_FEE: 5,
  SMALL_CART_THRESHOLD: 99,
  SMALL_CART_FEE: 20,
  SCHEDULED_DELIVERY_FEE: 0,
};

export const APP_CONFIG = {
  NAME: 'QuickMart',
  TAGLINE: '10 Minute Grocery Delivery',
  DEFAULT_LOCATION: {
    address: 'Connaught Place, New Delhi',
    pincode: '110001',
    deliveryTime: '10 mins',
  },
  DELIVERY_FEE: BILL_CONFIG.STANDARD_DELIVERY_FEE,
  FREE_DELIVERY_THRESHOLD: BILL_CONFIG.FREE_DELIVERY_THRESHOLD,
  HANDLING_FEE: BILL_CONFIG.HANDLING_FEE,
};
