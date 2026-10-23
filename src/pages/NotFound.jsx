import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/utils/constants';

/**
 * NotFound 404 page with clean recovery action
 */
const NotFound = () => {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center px-4">
      <div className="h-16 w-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
        <ShoppingBag className="h-8 w-8" />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
        404 Error
      </span>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-2">
        Page Not Found
      </h1>
      <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
        The grocery aisle or page you are looking for has been moved or does not exist.
      </p>

      <Button asChild variant="default" size="default" className="rounded-xl gap-2 font-bold">
        <Link to={ROUTES.HOME}>
          <ArrowLeft className="h-4 w-4" />
          <span>Back to home</span>
        </Link>
      </Button>
    </div>
  );
};

export default NotFound;
