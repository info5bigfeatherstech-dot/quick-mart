import React, { useState, useEffect, useRef } from 'react';
import { Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80';

/**
 * ProductImageGallery:
 * Desktop:
 *  - Main product image with cursor-following magnifier lens.
 *  - High-res zoomed preview window appearing on the right over the product column on hover.
 *  - Horizontal thumbnail carousel below the main image with next/prev scroll arrows.
 * Mobile:
 *  - Swipeable shadcn Carousel with dot indicators and fullscreen zoom dialog.
 */
const ProductImageGallery = ({ images = [], alt = 'Product Image' }) => {
  const safeImages = images && images.length > 0 ? images : [FALLBACK_IMAGE];
  const [activeIndex, setActiveIndex] = useState(0);

  // Hover zoom lens state
  const containerRef = useRef(null);
  const thumbnailsRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [zoomPercent, setZoomPercent] = useState({ x: 50, y: 50 });

  // Thumbnail scrolling state
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Fullscreen preview dialog state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState(null);
  const [isMainImgLoaded, setIsMainImgLoaded] = useState(false);

  // Sync mobile carousel with activeIndex
  useEffect(() => {
    if (!carouselApi) return;
    carouselApi.on('select', () => {
      const current = carouselApi.selectedScrollSnap();
      setActiveIndex(current);
    });
  }, [carouselApi]);

  // When activeIndex changes (e.g. from thumbnail click), update mobile carousel
  useEffect(() => {
    if (carouselApi && carouselApi.selectedScrollSnap() !== activeIndex) {
      carouselApi.scrollTo(activeIndex);
    }
  }, [activeIndex, carouselApi]);

  // Check thumbnail scroll overflow for left/right arrow buttons
  const checkScroll = () => {
    if (thumbnailsRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = thumbnailsRef.current;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
    }
  };

  useEffect(() => {
    const timer = setTimeout(checkScroll, 100);
    const el = thumbnailsRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        clearTimeout(timer);
        el.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
    return () => clearTimeout(timer);
  }, [safeImages]);

  const scrollThumbnails = (direction) => {
    if (thumbnailsRef.current) {
      const scrollAmount = direction === 'left' ? -160 : 160;
      thumbnailsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Magnifier lens mouse movement calculation
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    // Lens is ~42% of main image container
    const lensW = rect.width * 0.42;
    const lensH = rect.height * 0.42;

    // Center the lens on cursor
    let x = e.clientX - rect.left - lensW / 2;
    let y = e.clientY - rect.top - lensH / 2;

    // Clamp within the main image container boundaries
    x = Math.max(0, Math.min(rect.width - lensW, x));
    y = Math.max(0, Math.min(rect.height - lensH, y));

    const maxX = rect.width - lensW;
    const maxY = rect.height - lensH;

    const percentX = maxX > 0 ? (x / maxX) * 100 : 50;
    const percentY = maxY > 0 ? (y / maxY) * 100 : 50;

    setLensPos({ x, y, width: lensW, height: lensH });
    setZoomPercent({ x: percentX, y: percentY });
  };

  const handleMouseEnter = (e) => {
    handleMouseMove(e);
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const currentImage = safeImages[activeIndex] || safeImages[0];

  return (
    <div className="w-full">
      {/* ================= DESKTOP VIEW (hidden on mobile, md:block) ================= */}
      <div className="hidden md:block w-full">
        {/* Main Image Container with Lens and Right Zoom Preview */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            setPreviewIndex(activeIndex);
            setIsPreviewOpen(true);
          }}
          className="relative w-full aspect-square rounded-2xl bg-[#F7F7F8] dark:bg-card border border-border/80 overflow-hidden cursor-crosshair group select-none"
        >
          {!isMainImgLoaded && (
            <Skeleton className="absolute inset-0 h-full w-full rounded-2xl" />
          )}

          {/* Main Product Image */}
          <div className="w-full h-full p-6 flex items-center justify-center">
            <img
              src={currentImage}
              alt={alt}
              onLoad={() => setIsMainImgLoaded(true)}
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMAGE;
                setIsMainImgLoaded(true);
              }}
              className="h-full w-full object-contain pointer-events-none"
            />
          </div>

          {/* Semi-transparent Magnifier Lens Overlay on Hover */}
          {isHovered && (
            <div
              className="absolute pointer-events-none border border-white/80 dark:border-white/40 bg-white/45 dark:bg-white/20 shadow-md backdrop-blur-[0.5px]"
              style={{
                left: `${lensPos.x}px`,
                top: `${lensPos.y}px`,
                width: `${lensPos.width}px`,
                height: `${lensPos.height}px`,
              }}
            />
          )}

          {/* Fullscreen Expand Button Overlay */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background z-10"
            onClick={(e) => {
              e.stopPropagation();
              setPreviewIndex(activeIndex);
              setIsPreviewOpen(true);
            }}
            aria-label="Open fullscreen gallery"
          >
            <Maximize2 className="h-4 w-4 text-foreground" />
          </Button>

          {/* Right-side High-Res Zoomed Preview Window (covers the right column area) */}
          {isHovered && (
            <div
              className="hidden md:block absolute left-[calc(100%+1.5rem)] lg:left-[calc(100%+3.5rem)] top-0 w-full aspect-square z-50 bg-[#F7F7F8] dark:bg-card rounded-2xl border border-border shadow-2xl overflow-hidden pointer-events-none"
              style={{ minWidth: '100%' }}
            >
              <div
                className="w-full h-full bg-no-repeat bg-[#F7F7F8] dark:bg-card"
                style={{
                  backgroundImage: `url(${currentImage})`,
                  backgroundPosition: `${zoomPercent.x}% ${zoomPercent.y}%`,
                  backgroundSize: '280%',
                }}
              />
            </div>
          )}
        </div>

        {/* Horizontal Thumbnails Carousel below Main Image */}
        {safeImages.length > 1 && (
          <div className="relative mt-4 flex items-center gap-2">
            {canScrollLeft && (
              <button
                type="button"
                onClick={() => scrollThumbnails('left')}
                aria-label="Previous thumbnails"
                className="h-8 w-8 rounded-full border border-border bg-card shadow-sm flex items-center justify-center hover:bg-secondary text-foreground transition-colors cursor-pointer shrink-0 z-10"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            )}

            <div
              ref={thumbnailsRef}
              className="flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5"
            >
              {safeImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveIndex(idx);
                    setIsMainImgLoaded(false);
                  }}
                  className={cn(
                    'relative h-16 w-16 sm:h-18 sm:w-18 rounded-xl overflow-hidden bg-[#F7F7F8] dark:bg-secondary/40 border-2 transition-all p-1.5 shrink-0 focus:outline-none cursor-pointer',
                    activeIndex === idx
                      ? 'border-primary ring-1 ring-primary shadow-xs'
                      : 'border-border/70 hover:border-foreground/30 hover:opacity-90'
                  )}
                  aria-label={`Select product image ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`${alt} thumbnail ${idx + 1}`}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                    className="h-full w-full object-contain"
                  />
                </button>
              ))}
            </div>

            {canScrollRight && (
              <button
                type="button"
                onClick={() => scrollThumbnails('right')}
                aria-label="Next thumbnails"
                className="h-8 w-8 rounded-full border border-border bg-card shadow-sm flex items-center justify-center hover:bg-secondary text-foreground transition-colors cursor-pointer shrink-0 z-10"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ================= MOBILE VIEW (swipeable shadcn carousel) ================= */}
      <div className="block md:hidden w-full">
        <div className="relative w-full aspect-square bg-[#F7F7F8] dark:bg-card rounded-2xl border border-border/70 overflow-hidden">
          <Carousel setApi={setCarouselApi} className="w-full h-full">
            <CarouselContent className="h-full ml-0">
              {safeImages.map((img, idx) => (
                <CarouselItem
                  key={idx}
                  className="pl-0 h-full w-full flex items-center justify-center p-6"
                  onClick={() => {
                    setPreviewIndex(idx);
                    setIsPreviewOpen(true);
                  }}
                >
                  <img
                    src={img}
                    alt={`${alt} slide ${idx + 1}`}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_IMAGE;
                    }}
                    className="h-full w-full object-contain max-h-[300px]"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Expand button for mobile */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-sm"
            onClick={() => {
              setPreviewIndex(activeIndex);
              setIsPreviewOpen(true);
            }}
            aria-label="View fullscreen image"
          >
            <Maximize2 className="h-4 w-4 text-foreground" />
          </Button>

          {/* Dot Indicators */}
          {safeImages.length > 1 && (
            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 z-10 pointer-events-none">
              {safeImages.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    activeIndex === idx
                      ? 'w-5 bg-primary'
                      : 'w-1.5 bg-foreground/20'
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= FULLSCREEN PREVIEW DIALOG ================= */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl sm:max-w-4xl p-6 bg-background rounded-2xl border-border">
          <DialogHeader className="sr-only">
            <DialogTitle>{alt} Fullscreen Preview</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center gap-4">
            {/* Large Preview */}
            <div className="relative w-full aspect-square max-h-[65vh] bg-[#F7F7F8] dark:bg-card rounded-xl flex items-center justify-center p-4 overflow-hidden">
              <img
                src={safeImages[previewIndex]}
                alt={`${alt} large preview`}
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMAGE;
                }}
              />

              {/* Prev / Next controls */}
              {safeImages.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-md bg-background/80 hover:bg-background"
                    onClick={() =>
                      setPreviewIndex((prev) =>
                        prev === 0 ? safeImages.length - 1 : prev - 1
                      )
                    }
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full shadow-md bg-background/80 hover:bg-background"
                    onClick={() =>
                      setPreviewIndex((prev) =>
                        prev === safeImages.length - 1 ? 0 : prev + 1
                      )
                    }
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              )}
            </div>

            {/* Thumbnail selector in modal */}
            {safeImages.length > 1 && (
              <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 max-w-full">
                {safeImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPreviewIndex(idx)}
                    className={cn(
                      'h-14 w-14 shrink-0 rounded-lg p-1 bg-[#F7F7F8] dark:bg-card border-2 transition-all cursor-pointer',
                      previewIndex === idx
                        ? 'border-primary ring-1 ring-primary'
                        : 'border-border/60 opacity-70 hover:opacity-100'
                    )}
                  >
                    <img
                      src={img}
                      alt={`Modal thumb ${idx + 1}`}
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductImageGallery;
