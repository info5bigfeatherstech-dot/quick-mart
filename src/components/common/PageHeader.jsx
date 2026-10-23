import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { ROUTES } from '@/utils/constants';

/**
 * Reusable PageHeader with title, subtitle, and breadcrumb navigation
 */
const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  className = '',
}) => {
  return (
    <div className={`py-6 sm:py-8 border-b border-border mb-6 sm:mb-8 ${className}`}>
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
        <Link to={ROUTES.HOME} className="hover:text-primary transition-colors">
          Home
        </Link>
        {breadcrumbs.length > 0 ? (
          breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
              {crumb.href ? (
                <Link to={crumb.href} className="hover:text-primary transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-foreground">{crumb.label}</span>
              )}
            </React.Fragment>
          ))
        ) : (
          <>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60 shrink-0" />
            <span className="font-medium text-foreground truncate">{title}</span>
          </>
        )}
      </nav>

      <h1 className="text-2xl sm:text-3xl font-medium tracking-tight text-foreground font-sans">
        {title}
      </h1>
      {subtitle && (
        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default PageHeader;
