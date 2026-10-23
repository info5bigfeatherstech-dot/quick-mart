import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Timer,
  SlidersHorizontal,
  ArrowUpDown,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useCategoryProducts } from '@/hooks/useCategoryProducts';
import { useCategories } from '@/hooks/useCategories';
import ProductCard from '@/components/product/ProductCard';
import ErrorState from '@/components/common/ErrorState';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ROUTES } from '@/utils/constants';
import { cn } from '@/lib/utils';

/**
 * Loading Skeleton for Category Detail page with left category sidebar
 */
const CategoryDetailSkeleton = () => (
  <div className="py-3 sm:py-5 w-full font-sans">
    {/* Breadcrumb skeleton */}
    <div className="flex items-center gap-2 mb-4">
      <Skeleton className="h-4 w-12" />
      <Skeleton className="h-4 w-3" />
      <Skeleton className="h-4 w-28" />
    </div>

    <div className="flex gap-3 sm:gap-6 items-start w-full">
      {/* Left sidebar skeleton */}
      <div className="w-[74px] sm:w-[90px] md:w-60 lg:w-64 shrink-0 rounded-2xl border border-border p-2 space-y-2 bg-card">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2 p-1.5">
            <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
            <Skeleton className="h-4 w-24 hidden md:block" />
          </div>
        ))}
      </div>

      {/* Right products grid skeleton */}
      <div className="flex-1 min-w-0 space-y-4 w-full">
        <Skeleton className="h-8 w-56 rounded-lg" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2.5 sm:gap-3.5 w-full">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="w-full border border-border rounded-xl p-2.5 flex flex-col gap-2 bg-card"
            >
              <Skeleton className="w-full aspect-square rounded-lg" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-full" />
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-5 w-12" />
                <Skeleton className="h-7 w-16 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/**
 * CategoryDetail: Dedicated page with Blinkit/Zepto-style Left Category Sidebar
 * and full-width responsive product grid on the right
 */
const CategoryDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [sortBy, setSortBy] = useState('popular');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Fetch category details and products
  const { data, isLoading, isError, error } = useCategoryProducts(slug);
  const { data: allCategories = [] } = useCategories();

  const category = data?.category;
  const rawProducts = data?.products || [];

  // Filter and sort products
  const products = useMemo(() => {
    let list = [...rawProducts];

    if (inStockOnly) {
      list = list.filter((p) => p.inStock);
    }

    switch (sortBy) {
      case 'price-low':
        return list.sort((a, b) => a.price - b.price);
      case 'price-high':
        return list.sort((a, b) => b.price - a.price);
      case 'discount':
        return list.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
      case 'rating':
        return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'popular':
      default:
        return list;
    }
  }, [rawProducts, sortBy, inStockOnly]);

  if (isLoading) {
    return <CategoryDetailSkeleton />;
  }

  if (isError || !category) {
    return (
      <div className="py-10 font-sans">
        <ErrorState
          title="Category Not Found"
          message={
            error?.message ||
            "We couldn't find the category you're looking for. Please browse our other grocery categories."
          }
          actionLabel="Browse All Categories"
          onAction={() => navigate(`${ROUTES.HOME}#categories-section`)}
        />
      </div>
    );
  }

  return (
    <div className="py-2.5 sm:py-5 space-y-3 sm:space-y-4 font-sans w-full">
      {/* 1. Breadcrumbs & Mobile Back Header */}
      <div className="flex items-center justify-between gap-2">
        <Breadcrumb className="hidden sm:flex text-xs font-sans">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={ROUTES.HOME} className="hover:text-primary transition-colors">
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  to={`${ROUTES.HOME}#categories-section`}
                  className="hover:text-primary transition-colors"
                >
                  Categories
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium font-sans text-foreground truncate max-w-[200px]">
                {category.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Mobile back navigation bar */}
        <div className="sm:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-foreground hover:bg-secondary/80 active:scale-95 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <span className="text-xs text-muted-foreground font-medium font-sans">
            {category.name}
          </span>
        </div>
      </div>

      {/* 2. Main Two-Column Layout: Left Category Sidebar + Right Product Area */}
      <div className="flex gap-2 sm:gap-4 md:gap-6 items-start w-full">
        {/* LEFT COLUMN: Sticky Vertical Category Sidebar (Blinkit style) */}
        <aside
          aria-label="Categories Sidebar"
          className={cn(
            'w-[74px] sm:w-[88px] md:w-60 lg:w-64 shrink-0 bg-card rounded-2xl border border-border overflow-hidden select-none',
            'sticky top-14 sm:top-18 md:top-24 max-h-[calc(100dvh-70px)] sm:max-h-[calc(100dvh-90px)] md:max-h-[calc(100dvh-120px)] flex flex-col shadow-2xs font-sans'
          )}
        >
          {/* Desktop Sidebar Header */}
          <div className="hidden md:flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
            <span className="font-sans text-[11px] uppercase tracking-wider font-medium text-muted-foreground">
              Categories
            </span>
            <span className="font-sans text-[11px] font-medium text-primary">
              {allCategories.length}
            </span>
          </div>

          {/* Scrollable Category List */}
          <div className="overflow-y-auto flex-1 divide-y divide-border/30 scrollbar-thin">
            {allCategories.map((cat) => {
              const isActive = cat.slug === slug;
              return (
                <Link
                  key={cat.id || cat.slug}
                  to={`/category/${cat.slug}`}
                  className={cn(
                    'group flex flex-col md:flex-row items-center gap-1.5 md:gap-3 p-2 md:px-3.5 md:py-3 transition-all cursor-pointer relative font-sans font-medium',
                    isActive
                      ? 'bg-primary/10 text-primary font-medium border-l-4 border-l-primary'
                      : 'text-foreground/80 hover:bg-secondary/70 hover:text-foreground font-medium border-l-4 border-l-transparent'
                  )}
                  title={cat.name}
                >
                  {/* Category Thumbnail Icon */}
                  <div
                    className={cn(
                      'h-10 w-10 sm:h-11 sm:w-11 md:h-10 md:w-10 rounded-xl p-1 shrink-0 flex items-center justify-center transition-transform group-hover:scale-105',
                      isActive ? 'bg-background shadow-xs' : 'bg-secondary'
                    )}
                  >
                    <img
                      src={cat.image}
                      alt={cat.name}
                      loading="lazy"
                      className="h-full w-full object-contain"
                    />
                  </div>

                  {/* Category Name */}
                  <span
                    className={cn(
                      'font-sans text-[10px] md:text-xs lg:text-[13px] text-center md:text-left line-clamp-2 leading-tight transition-colors font-medium',
                      isActive ? 'text-primary font-medium' : 'text-foreground/85'
                    )}
                  >
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </aside>

        {/* RIGHT COLUMN: Category Title, Filters & Products Grid */}
        <main className="flex-1 min-w-0 space-y-3 sm:space-y-4 w-full">
          {/* Header Bar: "Buy [Category] Online" + Badges + Sort */}
          <div className="bg-card rounded-2xl border border-border p-3 sm:p-4 md:p-5 space-y-3 shadow-2xs font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="yellow" className="font-sans text-[10px] font-medium py-0.5 px-2 shadow-xs">
                    <Timer className="h-3 w-3 mr-1" />
                    10 MINS DELIVERY
                  </Badge>
                  <span className="font-sans text-xs text-muted-foreground font-medium">
                    {products.length} {products.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                <h1 className="font-sans text-lg sm:text-2xl font-medium text-foreground tracking-tight leading-tight">
                  Buy {category.name} Online
                </h1>
              </div>

              {/* Controls Toolbar: In-Stock and Sort Selector */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap pt-1 sm:pt-0">
                {/* In Stock Toggle */}
                <Button
                  type="button"
                  variant={inStockOnly ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setInStockOnly(!inStockOnly)}
                  className="font-sans text-xs h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl gap-1.5"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">In Stock Only</span>
                  <span className="sm:hidden">In Stock</span>
                </Button>

                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="font-sans h-8 sm:h-9 text-xs rounded-xl border-border bg-background min-w-[125px] sm:min-w-[155px] gap-1">
                    <ArrowUpDown className="h-3 w-3 text-muted-foreground mr-1" />
                    <SelectValue placeholder="Sort By" className="font-sans" />
                  </SelectTrigger>
                  <SelectContent align="end" className="text-xs font-sans">
                    <SelectItem value="popular" className="font-sans">Popularity</SelectItem>
                    <SelectItem value="price-low" className="font-sans">Price: Low to High</SelectItem>
                    <SelectItem value="price-high" className="font-sans">Price: High to Low</SelectItem>
                    <SelectItem value="discount" className="font-sans">Highest Discount</SelectItem>
                    <SelectItem value="rating" className="font-sans">Top Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Products Grid - Fills full width seamlessly with NO empty gap */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3.5 w-full items-stretch">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  inGrid={true}
                  className="w-full h-full"
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center bg-card rounded-2xl border border-dashed border-border p-6 space-y-3">
              <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="text-sm sm:text-base font-medium text-foreground">
                No products match your filter
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Try resetting your in-stock or sorting filter to view available items in this category.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInStockOnly(false);
                  setSortBy('popular');
                }}
                className="rounded-xl"
              >
                Reset Filters
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoryDetail;
