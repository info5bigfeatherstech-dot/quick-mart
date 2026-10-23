import React from 'react';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import QuantityStepper from './QuantityStepper';
import { showCartToast } from '@/utils/cartToast';
import { cn } from '@/lib/utils';

/**
 * AddToCartButton renders either shadcn Button or QuantityStepper based on product/variant cart state
 */
const AddToCartButton = ({
  product,
  variant = null,
  size = 'sm',
  className = '',
  label,
}) => {
  const items = useCartStore((state) => state.items);
  const addItem = useCartStore((state) => state.addItem);
  const increaseQty = useCartStore((state) => state.increaseQty);
  const decreaseQty = useCartStore((state) => state.decreaseQty);

  if (!product) return null;

  const key = variant?.id ? `${product.id}-${variant.id}` : product.id;
  const cartItem = items.find((item) => (item.key || item.product.id) === key);
  const quantity = cartItem ? cartItem.quantity : 0;

  const isOutOfStock = variant ? variant.inStock === false : product.inStock === false;

  if (isOutOfStock) {
    return (
      <Button
        variant="outline"
        size={size === 'lg' ? 'default' : size}
        disabled
        aria-label="Product is out of stock"
        className={cn(
          'text-xs text-muted-foreground bg-secondary border-border cursor-not-allowed select-none',
          className
        )}
      >
        Out of Stock
      </Button>
    );
  }

  if (quantity > 0) {
    return (
      <QuantityStepper
        quantity={quantity}
        onIncrease={() => {
          increaseQty(key);
          showCartToast({ product, variant, action: 'increase' });
        }}
        onDecrease={() => {
          decreaseQty(key);
          if (quantity === 1) {
            showCartToast({ product, variant, action: 'remove' });
          } else {
            showCartToast({ product, variant, action: 'decrease' });
          }
        }}
        size={size === 'lg' ? 'md' : size}
        className={className}
      />
    );
  }

  const isLarge = size === 'lg';
  const defaultLabel = isLarge ? 'ADD TO CART' : 'ADD';
  const buttonText = label || defaultLabel;

  return (
    <Button
      variant="add"
      size={isLarge ? 'lg' : size}
      onClick={(e) => {
        e.stopPropagation();
        addItem(product, variant);
        showCartToast({ product, variant, action: 'add' });
      }}
      className={cn(
        isLarge
          ? 'h-11 px-8 text-sm font-medium tracking-wider'
          : 'h-8 px-4 text-xs font-medium',
        className
      )}
      aria-label={`Add ${product.name} to cart`}
    >
      {buttonText}
    </Button>
  );
};

export default AddToCartButton;
