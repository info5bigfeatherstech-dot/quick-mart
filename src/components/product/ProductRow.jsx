import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeader from '../common/SectionHeader';
import ProductCard from './ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

/**
 * Reusable ProductRow horizontal scrolling carousel section
 */
export const ProductRowSkeleton = () => {
  return (
    <section className="section">
      <div className="flex items-center justify-between mb-3.5">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-4 w-16" />
      </div>
      <div className="scroll-row">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="w-[130px] sm:w-[136px] md:w-[142px] lg:w-[148px] xl:w-[152px] shrink-0 border border-border rounded-xl p-2.5 flex flex-col gap-2 bg-card"
          >
            <Skeleton className="w-full aspect-square rounded-lg" />
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-3/4" />
            <div className="flex items-center justify-between pt-1.5">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-6 w-14 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

const ProductRow = ({
  title,
  slug,
  products = [],
  seeAllLink,
  isLoading = false,
}) => {
  const rowRef = useRef(null);

  if (isLoading) {
    return <ProductRowSkeleton />;
  }

  if (!products || products.length === 0) {
    return null;
  }

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -460 : 460;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const link = seeAllLink || (slug ? `/category/${slug}` : undefined);

  return (
    <section className="section relative group/row">
      <SectionHeader title={title} seeAllLink={link} />

      {/* Desktop navigation arrows with Tooltips */}
      <TooltipProvider>
        <div className="relative">
          <div className="hidden md:block absolute -left-3.5 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover/row:opacity-100 transition-opacity">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Scroll left"
                  onClick={() => scroll('left')}
                  className="h-8 w-8 rounded-full bg-background shadow-sm hover:border-primary hover:text-primary transition-all"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Scroll left</TooltipContent>
            </Tooltip>
          </div>

          <div ref={rowRef} className="scroll-row">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="hidden md:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover/row:opacity-100 transition-opacity">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Scroll right"
                  onClick={() => scroll('right')}
                  className="h-8 w-8 rounded-full bg-background shadow-sm hover:border-primary hover:text-primary transition-all"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Scroll right</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>
    </section>
  );
};

export default ProductRow;
