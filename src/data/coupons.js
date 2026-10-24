export const dummyCoupons = [
  {
    code: 'FIRST50',
    title: 'Flat ₹50 OFF',
    description: 'Get flat ₹50 discount on grocery orders above ₹299',
    type: 'flat',
    discount: 50,
    minOrder: 299,
  },
  {
    code: 'SAVE10',
    title: '10% OFF up to ₹100',
    description: 'Save 10% on your cart up to ₹100. Minimum order ₹199',
    type: 'percentage',
    value: 10,
    maxDiscount: 100,
    minOrder: 199,
  },
  {
    code: 'FREEDEL',
    title: 'Free Delivery',
    description: 'Enjoy zero delivery fees on any order size',
    type: 'freedel',
    discount: 25,
    minOrder: 0,
  },
];
