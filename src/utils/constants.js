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
};

export const APP_CONFIG = {
  NAME: 'QuickMart',
  TAGLINE: '10 Minute Grocery Delivery',
  DEFAULT_LOCATION: {
    address: 'Connaught Place, New Delhi',
    pincode: '110001',
    deliveryTime: '10 mins',
  },
  DELIVERY_FEE: 15,
  FREE_DELIVERY_THRESHOLD: 199,
  HANDLING_FEE: 4,
};
