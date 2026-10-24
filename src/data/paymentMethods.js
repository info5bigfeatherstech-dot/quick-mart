export const paymentMethods = [
  {
    id: 'upi',
    name: 'UPI (Google Pay, PhonePe, Paytm)',
    description: 'Instant transfer via any UPI app or Virtual Payment Address (VPA)',
    badge: 'Fastest',
    icon: 'Smartphone',
  },
  {
    id: 'card',
    name: 'Credit or Debit Card',
    description: 'Visa, Mastercard, RuPay, and American Express accepted',
    badge: null,
    icon: 'CreditCard',
  },
  {
    id: 'cod',
    name: 'Cash on Delivery (COD)',
    description: 'Pay with cash or UPI QR code upon arrival at your doorstep',
    badge: null,
    icon: 'Banknote',
    maxOrderAmount: 5000,
  },
];
