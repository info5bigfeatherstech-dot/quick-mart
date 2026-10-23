import React, { useState, useEffect } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '../common/EmptyState';
import ErrorState from '../common/ErrorState';
import { cn } from '@/lib/utils';

/**
 * BannerCarousel:
 * Mobile: ~88% width so next slide peeks, aspect-16/9, dots indicator below
 * Desktop: 3 across (basis-1/3)
 */
const BannerCarousel = ({
  banners = [],
  isLoading = false,
  isError = false,
  onRetry,
}) => {
  const [carouselApi, setCarouselApi] = useState(null);
  const [current, setCurrent] = useState(0);

  const plugin = React.useRef(
    Autoplay({ delay: 4500, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => {
      setCurrent(carouselApi.selectedScrollSnap());
    };
    carouselApi.on('select', onSelect);
    return () => {
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi]);

  if (isError) {
    return (
      <section className="section">
        <ErrorState
          title="Could not load promotions"
          message="Failed to load promotional offers. Please try again."
          onRetry={onRetry}
        />
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="section">
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 overflow-hidden">
          <Skeleton className="w-[88%] sm:w-full shrink-0 aspect-[16/9] sm:aspect-[2/1] rounded-2xl" />
          <Skeleton className="hidden sm:block w-full aspect-[16/9] sm:aspect-[2/1] rounded-2xl" />
          <Skeleton className="hidden lg:block w-full aspect-[16/9] sm:aspect-[2/1] rounded-2xl" />
        </div>
      </section>
    );
  }

  if (!banners || banners.length === 0) {
    return (
      <section className="section">
        <EmptyState title="No offers available" message="Check back later for seasonal promotions." />
      </section>
    );
  }

  return (
    <section className="section relative group/banner select-none">
      <Carousel
        setApi={setCarouselApi}
        plugins={[plugin.current]}
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-3 sm:-ml-4">
          {banners.map((banner, index) => (
            <CarouselItem
              key={banner.id}
              className="pl-3 sm:pl-4 basis-[88%] sm:basis-1/2 lg:basis-1/3"
            >
              <div className="relative overflow-hidden rounded-2xl border border-border bg-secondary aspect-[16/9] sm:aspect-[2/1] group/card">
                <img
                  src={banner.image}
                  alt={banner.title}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-3.5 sm:p-5">
                  <Badge variant="yellow" className="self-start mb-1 sm:mb-1.5 text-[10px] sm:text-xs font-medium">
                    Limited Offer
                  </Badge>
                  <h3 className="text-white text-xs sm:text-sm lg:text-base font-medium line-clamp-2 leading-snug drop-shadow-sm">
                    {banner.title}
                  </h3>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Carousel Desktop Prev/Next Buttons */}
        <CarouselPrevious className="hidden md:flex left-2 h-9 w-9 bg-background/90 text-foreground border-border shadow-md opacity-0 group-hover/banner:opacity-100 transition-opacity" />
        <CarouselNext className="hidden md:flex right-2 h-9 w-9 bg-background/90 text-foreground border-border shadow-md opacity-0 group-hover/banner:opacity-100 transition-opacity" />
      </Carousel>

      {/* Mobile Dot Indicators */}
      {banners.length > 1 && (
        <div className="flex sm:hidden items-center justify-center gap-1.5 pt-3">
          {banners.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => carouselApi?.scrollTo(idx)}
              className={cn(
                'h-1.5 rounded-full transition-all duration-300',
                current === idx ? 'w-5 bg-primary' : 'w-1.5 bg-border hover:bg-muted-foreground'
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default BannerCarousel;
