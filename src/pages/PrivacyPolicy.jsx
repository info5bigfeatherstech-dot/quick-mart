import React from 'react';
import { usePageContent } from '@/hooks/usePageContent';
import ContentPage from '@/components/common/ContentPage';
import { Skeleton } from '@/components/ui/skeleton';
import ErrorState from '@/components/common/ErrorState';

/**
 * Privacy Policy Page
 */
const PrivacyPolicy = () => {
  const { data: page, isLoading, isError, refetch } = usePageContent('privacy-policy');

  if (isError) {
    return (
      <div className="py-10">
        <ErrorState
          title="Could not load Privacy Policy"
          message="Failed to load policy documentation. Please try again."
          onRetry={refetch}
        />
      </div>
    );
  }

  if (isLoading || !page) {
    return (
      <div className="py-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-40" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
          <div className="hidden lg:block lg:col-span-4 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded-lg" />
            ))}
          </div>
          <div className="lg:col-span-8 space-y-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ContentPage
      title={page.title}
      lastUpdated={page.lastUpdated}
      sections={page.sections}
    />
  );
};

export default PrivacyPolicy;
