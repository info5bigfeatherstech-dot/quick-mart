import React, { useState, useEffect } from 'react';
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
 * Desktop: Vertical thumbnails + Main image with cursor-follow CSS zoom + Fullscreen preview dialog
 * Mobile: Swipeable shadcn Carousel with dot indicators
 */
const ProductImageGallery = ({ images = [], alt = 'Product Image' }) => {
  const safeImages = images && images.length > 0 ? images : [FALLBACK_IMAGE];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
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

  // When activeIndex changes (e.g. from thumbnail click), update carousel if on mobile
  useEffect(() => {
    if (carouselApi && carouselApi.selectedScrollSnap() !== activeIndex) {
      carouselApi.scrollTo(activeIndex);
    }
  }, [activeIndex, carouselApi]);

  // Desktop hover zoom handler
  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - left) / width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - top) / height) * 100));
    setZoomOrigin({ x, y });
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomOrigin({ x: 50, y: 50 });
  };

  const currentImage = safeImages[activeIndex] || safeImages[0];

  return (
    <div className="w-full">
      {/* ================= DESKTOP VIEW (hidden on mobile, md:flex) ================= */}
      <div className="hidden md:flex items-start gap-4">
        {/* Vertical Thumbnails (hidden if only 1 image) */}
        {safeImages.length > 1 && (
          <div className="flex flex-col gap-3 w-16 shrink-0 py-1 max-h-[480px] overflow-y-auto no-scrollbar">
            {safeImages.map((img, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setActiveIndex(idx);
                  setIsMainImgLoaded(false);
                }}
                className={cn(
                  'relative aspect-square w-16 rounded-xl overflow-hidden bg-[#F7F7F8] border-2 transition-all p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  activeIndex === idx
                    ? 'border-primary ring-1 ring-primary shadow-sm'
                    : 'border-border/70 hover:border-border hover:opacity-90'
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
        )}

        {/* Main Image Container */}
        <div className="relative flex-1 aspect-square rounded-2xl bg-[#F7F7F8] border border-border/80 overflow-hidden group select-none">
          {!isMainImgLoaded && (
            <Skeleton className="absolute inset-0 h-full w-full rounded-2xl" />
          )}

          {/* Interactive Zoom Wrapper */}
          <div
            className="w-full h-full p-6 flex items-center justify-center cursor-crosshair overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              setPreviewIndex(activeIndex);
              setIsPreviewOpen(true);
            }}
            role="button"
            tabIndex={0}
            aria-label="Click to zoom image"
          >
            <img
              src={currentImage}
              alt={alt}
              onLoad={() => setIsMainImgLoaded(true)}
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMAGE;
                setIsMainImgLoaded(true);
              }}
              className={cn(
                'h-full w-full object-contain transition-transform duration-100 ease-out pointer-events-none',
                isZoomed ? 'scale-[1.85]' : 'scale-100'
              )}
              style={
                isZoomed
                  ? {
                      transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                    }
                  : { transformOrigin: 'center center' }
              }
            />
          </div>

          {/* Fullscreen Expand Button Overlay */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
            onClick={(e) => {
              e.stopPropagation();
              setPreviewIndex(activeIndex);
              setIsPreviewOpen(true);
            }}
            aria-label="Open fullscreen gallery"
          >
            <Maximize2 className="h-4 w-4 text-foreground" />
          </Button>
        </div>
      </div>

      {/* ================= MOBILE VIEW (swipeable shadcn carousel) ================= */}
      <div className="block md:hidden w-full">
        <div className="relative w-full aspect-square bg-[#F7F7F8] rounded-2xl border border-border/70 overflow-hidden">
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
            <div className="relative w-full aspect-square max-h-[65vh] bg-[#F7F7F8] rounded-xl flex items-center justify-center p-4 overflow-hidden">
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
                      'h-14 w-14 shrink-0 rounded-lg p-1 bg-[#F7F7F8] border-2 transition-all',
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
