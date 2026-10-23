import { productSections } from './products';

// Grab some real products from the catalogue
const allProducts = productSections.flatMap((s) => s.products);

const getProduct = (id) =>
  allProducts.find((p) => p.id === id) || allProducts[0];

export const dummyOrders = [
  {
    id: 'ORD-89412',
    createdAt: '2026-10-23T11:45:00.000Z',
    status: 'On the way',
    items: [
      { product: getProduct('p-101'), quantity: 2 }, // Amul Milk
      { product: getProduct('p-104'), quantity: 1 }, // Farm Eggs
      { product: getProduct('p-201'), quantity: 1 }, // Tomato
      { product: getProduct('p-301'), quantity: 2 }, // Lay's Chips
    ],
    itemTotal: 169,
    deliveryFee: 15,
    handlingFee: 4,
    total: 188,
    address: 'Flat 402, Block B, Connaught Place, New Delhi - 110001',
  },
  {
    id: 'ORD-87105',
    createdAt: '2026-10-21T09:15:00.000Z',
    status: 'Delivered',
    items: [
      { product: getProduct('p-102'), quantity: 1 }, // Amul Butter
      { product: getProduct('p-103'), quantity: 1 }, // Brown Bread
      { product: getProduct('p-105'), quantity: 2 }, // Paneer
    ],
    itemTotal: 282,
    deliveryFee: 0,
    handlingFee: 4,
    total: 286,
    address: 'Flat 402, Block B, Connaught Place, New Delhi - 110001',
  },
  {
    id: 'ORD-85230',
    createdAt: '2026-10-18T18:30:00.000Z',
    status: 'Delivered',
    items: [
      { product: getProduct('p-303'), quantity: 2 }, // Coke Zero
      { product: getProduct('p-305'), quantity: 1 }, // Doritos
      { product: getProduct('p-501'), quantity: 2 }, // Dairy Milk Silk
      { product: getProduct('p-502'), quantity: 1 }, // Oreo
    ],
    itemTotal: 325,
    deliveryFee: 0,
    handlingFee: 4,
    total: 329,
    address: 'Work Office 5A, Cyber Hub, Gurugram - 122002',
  },
  {
    id: 'ORD-83991',
    createdAt: '2026-10-14T14:10:00.000Z',
    status: 'Cancelled',
    items: [
      { product: getProduct('p-401'), quantity: 1 }, // Aashirvaad Atta 5kg
      { product: getProduct('p-402'), quantity: 1 }, // Sunflower Oil
    ],
    itemTotal: 383,
    deliveryFee: 0,
    handlingFee: 4,
    total: 387,
    address: 'Flat 402, Block B, Connaught Place, New Delhi - 110001',
  },
  {
    id: 'ORD-81045',
    createdAt: '2026-10-08T08:05:00.000Z',
    status: 'Delivered',
    items: [
      { product: getProduct('p-101'), quantity: 3 }, // Milk
      { product: getProduct('p-204'), quantity: 1 }, // Banana
      { product: getProduct('p-205'), quantity: 1 }, // Apples
    ],
    itemTotal: 281,
    deliveryFee: 0,
    handlingFee: 4,
    total: 285,
    address: 'Flat 402, Block B, Connaught Place, New Delhi - 110001',
  },
  {
    id: 'ORD-79402',
    createdAt: '2026-09-29T19:40:00.000Z',
    status: 'Delivered',
    items: [
      { product: getProduct('p-601'), quantity: 1 }, // Vim Gel
      { product: getProduct('p-602'), quantity: 1 }, // Surf Excel
      { product: getProduct('p-604'), quantity: 1 }, // Colin Spray
    ],
    itemTotal: 354,
    deliveryFee: 0,
    handlingFee: 4,
    total: 358,
    address: 'Work Office 5A, Cyber Hub, Gurugram - 122002',
  },
];
