import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

/**
 * Reusable CategoryCard component wrapping shadcn Card
 */
const CategoryCard = ({ category }) => {
  if (!category) return null;

  return (
    <Link
      to={`/category/${category.slug}`}
      className="group flex flex-col items-center text-center select-none"
    >
      <Card className="w-full aspect-square bg-secondary border-border/80 rounded-2xl p-0 overflow-hidden transition-all duration-300 group-hover:border-primary group-hover:shadow-md shadow-none flex items-center justify-center">
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Card>
      <span className="font-sans text-[11px] sm:text-xs font-semibold text-foreground line-clamp-2 mt-2 leading-tight group-hover:text-primary transition-colors">
        {category.name}
      </span>
    </Link>
  );
};

export default CategoryCard;
