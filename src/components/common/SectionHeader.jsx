import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/**
 * Reusable Section Header with left-aligned title and right-aligned "See all" action
 */
const SectionHeader = ({
  title,
  seeAllLink,
  onSeeAllClick,
  actionText = 'See all',
  className = '',
}) => {
  return (
    <div className={`section-header ${className}`}>
      <h2 className="section-title font-sans">{title}</h2>
      {seeAllLink ? (
        <Link
          to={seeAllLink}
          className="group inline-flex items-center gap-0.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
        >
          <span>{actionText}</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ) : onSeeAllClick ? (
        <button
          type="button"
          onClick={onSeeAllClick}
          className="group inline-flex items-center gap-0.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
        >
          <span>{actionText}</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      ) : null}
    </div>
  );
};

export default SectionHeader;
