import React from 'react';
import HeroBanner from '../components/banner/HeroBanner';
import BannerCarousel from '../components/banner/BannerCarousel';
import CategoryGrid from '../components/category/CategoryGrid';
import ProductRow, { ProductRowSkeleton } from '../components/product/ProductRow';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { useBanners } from '../hooks/useBanners';
import { useCategories } from '../hooks/useCategories';
import { useProductSections } from '../hooks/useProductSections';

/**
 * Home Page: Quick-commerce landing experience
 * Renders HeroBanner, BannerCarousel, CategoryGrid, and dynamically maps over all ProductSections
 */
const Home = () => {
  const {
    data: banners,
    isLoading: isBannersLoading,
    isError: isBannersError,
    refetch: refetchBanners,
  } = useBanners();

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
    refetch: refetchCategories,
  } = useCategories();

  const {
    data: productSections,
    isLoading: isSectionsLoading,
    isError: isSectionsError,
    refetch: refetchSections,
  } = useProductSections();

  return (
    <div className="py-2 sm:py-4 space-y-4 sm:space-y-6">
      {/* 0. Full-width Hero Banner Template (Just after navbar) */}
      <HeroBanner />

      {/* 1. Promotional Banners */}
      <BannerCarousel
        banners={banners}
        isLoading={isBannersLoading}
        isError={isBannersError}
        onRetry={refetchBanners}
      />

      {/* 2. Shop by Category Grid */}
      <CategoryGrid
        categories={categories}
        title="Shop by category"
        isLoading={isCategoriesLoading}
        isError={isCategoriesError}
        onRetry={refetchCategories}
      />

      {/* 3. Product Sections mapped from server state */}
      {isSectionsLoading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <ProductRowSkeleton key={idx} />
          ))}
        </div>
      )}

      {isSectionsError && (
        <section className="section">
          <ErrorState
            title="Could not load products"
            message="We were unable to load the grocery sections. Please check your connection and try again."
            onRetry={refetchSections}
          />
        </section>
      )}

      {!isSectionsLoading && !isSectionsError && (!productSections || productSections.length === 0) && (
        <section className="section">
          <EmptyState
            title="No grocery items found"
            message="Check back in a few moments as we replenish store stock."
          />
        </section>
      )}

      {!isSectionsLoading &&
        !isSectionsError &&
        productSections?.map((section) => (
          <ProductRow
            key={section.id}
            title={section.title}
            slug={section.slug}
            products={section.products}
          />
        ))}
    </div>
  );
};

export default Home;
