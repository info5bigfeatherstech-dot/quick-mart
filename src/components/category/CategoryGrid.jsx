import React from 'react';
import SectionHeader from '../common/SectionHeader';
import CategoryCard from './CategoryCard';
import { Skeleton } from '@/components/ui/skeleton';
import EmptyState from '../common/EmptyState';
import ErrorState from '../common/ErrorState';

/**
 * CategoryGrid displays categories in a responsive grid
 * Desktop: 10 columns across (2 rows for 20 categories)
 * Mobile: 4 columns
 */
const CategoryGrid = ({
  categories = [],
  title = 'Shop by category',
  isLoading = false,
  isError = false,
  onRetry,
}) => {
  if (isError) {
    return (
      <section className="section">
        <SectionHeader title={title} />
        <ErrorState
          title="Could not load categories"
          message="Failed to fetch grocery categories. Please try again."
          onRetry={onRetry}
        />
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="section">
        <div className="flex items-center justify-between mb-3.5">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2.5 sm:gap-3.5">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Skeleton className="w-full aspect-square rounded-2xl" />
              <Skeleton className="h-3 w-14" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <section className="section">
        <SectionHeader title={title} />
        <EmptyState
          title="No categories found"
          message="Categories will appear here once available."
        />
      </section>
    );
  }

  return (
    <section className="section scroll-mt-24" id="categories-section">
      <SectionHeader title={title} />
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-3.5">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
