import { BILL_CONFIG } from './constants';

const round2 = (num) => Math.round((Number(num) || 0) * 100) / 100;

/**
 * Pure function to calculate detailed bill metrics across checkout and cart drawer.
 *
 * @param {Object} params
 * @param {Array} params.items - Cart items with quantity and product/selectedVariant
 * @param {Object|null} [params.coupon=null] - Applied coupon object ({ code, discount, type, maxDiscount, minOrder })
 * @param {number} [params.tip=0] - Voluntary delivery tip amount
 * @param {'now'|'scheduled'} [params.deliveryOption='now'] - Delivery timing option
 * @returns {{
 *   itemTotal: number,
 *   mrpTotal: number,
 *   productDiscount: number,
 *   couponDiscount: number,
 *   deliveryFee: number,
 *   handlingFee: number,
 *   smallCartFee: number,
 *   tip: number,
 *   grandTotal: number,
 *   totalSavings: number,
 *   isFreeDelivery: boolean
 * }}
 */
export const calculateBill = ({
  items = [],
  coupon = null,
  tip = 0,
  deliveryOption = 'now',
} = {}) => {
  // 1. Calculate items total and MRP total
  let itemTotal = 0;
  let mrpTotal = 0;

  for (const item of items) {
    const qty = Number(item.quantity) || 1;
    const price = Number(item.selectedVariant?.price ?? item.product?.price ?? 0);
    const mrp = Number(item.selectedVariant?.mrp ?? item.product?.mrp ?? price);

    itemTotal += price * qty;
    mrpTotal += mrp * qty;
  }

  itemTotal = round2(itemTotal);
  mrpTotal = round2(mrpTotal);
  const productDiscount = round2(Math.max(0, mrpTotal - itemTotal));

  // If cart is empty, fees are 0
  if (items.length === 0 || itemTotal === 0) {
    return {
      itemTotal: 0,
      mrpTotal: 0,
      productDiscount: 0,
      couponDiscount: 0,
      deliveryFee: 0,
      handlingFee: 0,
      smallCartFee: 0,
      tip: 0,
      grandTotal: 0,
      totalSavings: 0,
      isFreeDelivery: true,
    };
  }

  // 2. Base Delivery Fee
  let baseDeliveryFee = 0;
  if (deliveryOption === 'scheduled') {
    baseDeliveryFee = BILL_CONFIG.SCHEDULED_DELIVERY_FEE;
  } else if (itemTotal >= BILL_CONFIG.FREE_DELIVERY_THRESHOLD) {
    baseDeliveryFee = 0;
  } else {
    baseDeliveryFee = BILL_CONFIG.STANDARD_DELIVERY_FEE;
  }

  // 3. Handling Fee & Small Cart Fee
  const handlingFee = BILL_CONFIG.HANDLING_FEE;
  const smallCartFee =
    itemTotal < BILL_CONFIG.SMALL_CART_THRESHOLD
      ? BILL_CONFIG.SMALL_CART_FEE
      : 0;

  // 4. Coupon Discount calculation
  let couponDiscount = 0;
  let deliveryFee = baseDeliveryFee;

  if (coupon) {
    if (coupon.code === 'FREEDEL') {
      deliveryFee = 0;
      couponDiscount = baseDeliveryFee; // the saved delivery charge
    } else if (coupon.type === 'percentage') {
      const calculated = (itemTotal * (coupon.value || 0)) / 100;
      couponDiscount = coupon.maxDiscount
        ? Math.min(coupon.maxDiscount, calculated)
        : calculated;
    } else if (coupon.type === 'flat' || coupon.discount) {
      couponDiscount = Number(coupon.discount || coupon.value || 0);
    }
    // Cap coupon discount to itemTotal
    couponDiscount = Math.min(itemTotal, couponDiscount);
  }

  couponDiscount = round2(couponDiscount);
  deliveryFee = round2(deliveryFee);

  // 5. Tip
  const tipAmount = round2(Math.max(0, Number(tip) || 0));

  // 6. Grand Total
  // grandTotal = itemTotal - couponDiscount (if not freedel) + deliveryFee + handlingFee + smallCartFee + tip
  // Note: if coupon is FREEDEL, deliveryFee is already set to 0 and couponDiscount represents the shipping waiver
  const effectiveCouponItemDiscount =
    coupon?.code === 'FREEDEL' ? 0 : couponDiscount;

  const grandTotal = round2(
    Math.max(
      0,
      itemTotal -
        effectiveCouponItemDiscount +
        deliveryFee +
        handlingFee +
        smallCartFee +
        tipAmount
    )
  );

  // 7. Total Savings
  const savedDeliveryFee =
    baseDeliveryFee === 0 && itemTotal >= BILL_CONFIG.FREE_DELIVERY_THRESHOLD
      ? BILL_CONFIG.STANDARD_DELIVERY_FEE
      : 0;

  const totalSavings = round2(
    productDiscount + couponDiscount + savedDeliveryFee
  );

  return {
    itemTotal,
    mrpTotal,
    productDiscount,
    couponDiscount,
    deliveryFee,
    handlingFee,
    smallCartFee,
    tip: tipAmount,
    grandTotal,
    totalSavings,
    isFreeDelivery: deliveryFee === 0,
  };
};
