import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Container from '@/components/common/Container';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductDetailsTabs from '@/components/product/ProductDetailsTabs';
import ProductRow, { ProductRowSkeleton } from '@/components/product/ProductRow';
import AddToCartButton from '@/components/product/AddToCartButton';
import ErrorState from '@/components/common/ErrorState';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useProduct } from '@/hooks/useProduct';
import { useSimilarProducts } from '@/hooks/useSimilarProducts';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ROUTES, APP_CONFIG } from '@/utils/constants';
import { formatPrice } from '@/utils/formatPrice';

/**
 * ProductDetail Skeleton loader matching layout precisely
 */
const ProductDetailSkeleton = () => {
  return (
    <Container className="py-4 md:py-6 space-y-8 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <span className="text-muted-foreground/40">/</span>
        <Skeleton className="h-4 w-28" />
        <span className="text-muted-foreground/40">/</span>
        <Skeleton className="h-4 w-40" />
      </div>

      {/* Main 2-column Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left: Gallery Skeleton */}
        <div className="flex gap-4">
          <div className="hidden md:flex flex-col gap-3 w-16 shrink-0">
            <Skeleton className="h-16 w-16 rounded-xl" />
            <Skeleton className="h-16 w-16 rounded-xl" />
            <Skeleton className="h-16 w-16 rounded-xl" />
          </div>
          <Skeleton className="w-full aspect-square rounded-2xl" />
        </div>

        {/* Right: Info Skeleton */}
        <div className="space-y-5">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-20" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-28 rounded-md" />
            <Skeleton className="h-6 w-20 rounded-md" />
          </div>
          <div className="h-px bg-border/60 my-2" />
          <div className="space-y-2">
            <Skeleton className="h-9 w-36" />
            <Skeleton className="h-3 w-28" />
          </div>
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-12 w-28 rounded-xl" />
            <Skeleton className="h-12 w-28 rounded-xl" />
          </div>
          <Skeleton className="h-11 w-44 rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-4 pt-4">
        <Skeleton className="h-10 w-96 rounded-xl" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>

      {/* Similar Products Skeleton */}
      <div className="pt-4">
        <ProductRowSkeleton />
      </div>
    </Container>
  );
};

/**
 * ProductDetail Page
 */
const ProductDetail = () => {
  const { slug } = useParams();
  const { data: product, isLoading, isError, error, refetch } = useProduct(slug);
  const { data: similarProducts = [], isLoading: isLoadingSimilar } = useSimilarProducts(slug);

  const [selectedVariant, setSelectedVariant] = useState(null);

  // Set default variant on product load
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
  }, [product]);

  // Set document title and meta description
  const pageTitle = product
    ? `${product.name} | ${product.brand || APP_CONFIG.NAME}`
    : `Product Details | ${APP_CONFIG.NAME}`;
  useDocumentTitle(pageTitle, product?.description);

  if (isLoading) {
    return <ProductDetailSkeleton />;
  }

  // Handle 404 or missing product
  const is404 =
    !product ||
    error?.response?.status === 404 ||
    error?.status === 404 ||
    error?.message?.includes('not found');

  if (isError && !is404) {
    return (
      <Container className="py-12">
        <ErrorState
          title="Failed to load product"
          message={error?.message || 'Something went wrong while fetching this product.'}
          onRetry={refetch}
        />
      </Container>
    );
  }

  if (is404) {
    return (
      <Container className="py-16 text-center max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center p-8 bg-secondary rounded-2xl border border-border space-y-4">
          <div className="h-16 w-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center text-2xl font-bold">
            !
          </div>
          <h2 className="text-xl font-bold text-foreground">Product not found</h2>
          <p className="text-sm text-muted-foreground">
            The item you are looking for might have been moved or is currently unavailable.
          </p>
          <Button asChild variant="default" className="mt-2">
            <Link to={ROUTES.HOME} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to home</span>
            </Link>
          </Button>
        </div>
      </Container>
    );
  }

  // Active gallery images: use variant images if specifically provided, else product images
  const galleryImages =
    selectedVariant?.images && selectedVariant.images.length > 0
      ? selectedVariant.images
      : product.images && product.images.length > 0
      ? product.images
      : [product.image];

  // Active pricing for mobile bottom bar
  const activePrice = selectedVariant?.price ?? product.price;
  const activeMrp = selectedVariant?.mrp ?? product.mrp;
  const activeDiscount = selectedVariant?.discountPercent ?? product.discountPercent;

  return (
    <div className="w-full pb-24 md:pb-12">
      <Container className="py-4 md:py-6 space-y-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={ROUTES.HOME} className="flex items-center gap-1">
                  <Home className="h-3.5 w-3.5" />
                  <span>Home</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />

            {product.categoryName && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link to={ROUTES.HOME}>{product.categoryName}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}

            <BreadcrumbItem>
              <BreadcrumbPage className="line-clamp-1 max-w-[200px] sm:max-w-[320px]">
                {product.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* 2-Column Desktop Layout (stacked on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-14 items-start">
          {/* LEFT Column (~50%): Image Gallery */}
          <div className="w-full">
            <ProductImageGallery images={galleryImages} alt={product.name} />
          </div>

          {/* RIGHT Column (~50%): Product Info (Sticky on lg and up) */}
          <div className="w-full lg:sticky lg:top-24">
            <ProductInfo
              product={product}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
            />
          </div>
        </div>

        {/* Product Details Section (Tabs on Desktop / Accordion on Mobile) */}
        <div className="pt-6 border-t border-border/80">
          <ProductDetailsTabs product={product} />
        </div>

        {/* Similar Products Row */}
        <div className="pt-4">
          <ProductRow
            title="Similar products"
            products={similarProducts}
            isLoading={isLoadingSimilar}
          />
        </div>
      </Container>

      {/* ================= MOBILE FIXED BOTTOM ACTION BAR ================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-border px-4 pt-3 pb-[max(env(safe-area-inset-bottom,0px),12px)] shadow-lg">
        <div className="flex items-center justify-between gap-4 max-w-md mx-auto">
          {/* Price display on bottom bar */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-foreground">
                {formatPrice(activePrice)}
              </span>
              {activeMrp && activeMrp > activePrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(activeMrp)}
                </span>
              )}
            </div>
            {activeDiscount > 0 ? (
              <span className="text-[10px] font-bold text-primary">
                {activeDiscount}% OFF
              </span>
            ) : (
              <span className="text-[10px] text-muted-foreground">
                Inclusive of all taxes
              </span>
            )}
          </div>

          {/* Action button */}
          <div className="w-40 flex justify-end">
            <AddToCartButton
              product={product}
              variant={selectedVariant}
              size="lg"
              className="w-full h-11"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
