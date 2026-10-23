import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * RatingStars component displaying rating stars, rating value, and review count
 */
const RatingStars = ({
  rating = 4.5,
  reviewCount = 120,
  className = '',
  size = 'md',
}) => {
  if (!rating) return null;

  const starSizeClass = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';

  // Format review count (e.g. 1245 -> "1,245 reviews")
  const formattedReviews =
    typeof reviewCount === 'number'
      ? reviewCount.toLocaleString('en-IN')
      : reviewCount;

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/60 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-md text-xs font-semibold">
        <span>{Number(rating).toFixed(1)}</span>
        <Star className={cn('fill-amber-400 text-amber-400', starSizeClass)} />
      </div>

      {reviewCount > 0 && (
        <span className="text-xs text-muted-foreground font-medium">
          ({formattedReviews} reviews)
        </span>
      )}
    </div>
  );
};

export default RatingStars;
