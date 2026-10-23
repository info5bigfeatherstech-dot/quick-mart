import React from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ROUTES } from '@/utils/constants';
import { cn } from '@/lib/utils';

/**
 * ProductDetailsTabs: Displays deep product information
 * Uses shadcn Tabs on desktop, shadcn Accordion on mobile
 */
const ProductDetailsTabs = ({ product, className = '' }) => {
  if (!product) return null;

  const {
    description,
    specs = [],
    ingredients,
    nutrition = [],
    storage,
    returnPolicy = 'Items can be returned within 24 hours of delivery if damaged, expired, or missing. Instant refunds processed to original payment method.',
  } = product;

  const hasIngredients = Boolean(ingredients);
  const hasNutrition = Array.isArray(nutrition) && nutrition.length > 0;
  const hasStorage = Boolean(storage);

  // Common render blocks
  const renderProductDetails = () => (
    <div className="space-y-4">
      {description && (
        <p className="text-sm text-foreground/90 leading-relaxed">
          {description}
        </p>
      )}

      {specs && specs.length > 0 && (
        <div className="rounded-xl border border-border overflow-hidden bg-card divide-y divide-border/60">
          {specs.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-3 text-xs p-3 gap-1 sm:gap-4 hover:bg-secondary/40 transition-colors"
            >
              <span className="font-semibold text-muted-foreground">
                {item.label}
              </span>
              <span className="sm:col-span-2 text-foreground font-medium">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderIngredients = () => (
    <div className="text-sm text-foreground/90 leading-relaxed bg-card p-4 rounded-xl border border-border">
      <p>{ingredients}</p>
    </div>
  );

  const renderNutrition = () => (
    <div className="rounded-xl border border-border overflow-hidden bg-card divide-y divide-border/60 max-w-md">
      <div className="grid grid-cols-2 text-xs font-semibold p-3 bg-secondary text-muted-foreground uppercase tracking-wider">
        <span>Nutrient</span>
        <span className="text-right">Per 100g / Serving</span>
      </div>
      {nutrition.map((item, idx) => (
        <div
          key={idx}
          className="grid grid-cols-2 text-xs p-3 hover:bg-secondary/40 transition-colors"
        >
          <span className="font-semibold text-muted-foreground">
            {item.label}
          </span>
          <span className="text-right text-foreground font-medium">
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );

  const renderStorage = () => (
    <div className="text-sm text-foreground/90 leading-relaxed bg-card p-4 rounded-xl border border-border">
      <p>{storage}</p>
    </div>
  );

  const renderReturnPolicy = () => (
    <div className="text-sm text-foreground/90 leading-relaxed bg-card p-4 rounded-xl border border-border space-y-3">
      <p>{returnPolicy}</p>
      <div>
        <Link
          to={ROUTES.TERMS_AND_CONDITIONS}
          className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
        >
          View full Return & Refund Policy →
        </Link>
      </div>
    </div>
  );

  return (
    <div className={cn('w-full', className)}>
      {/* ================= DESKTOP VIEW: Tabs ================= */}
      <div className="hidden md:block">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full justify-start h-auto p-1 bg-secondary border border-border rounded-xl gap-1">
            <TabsTrigger
              value="details"
              className="text-xs font-semibold px-4 py-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs"
            >
              Product Details
            </TabsTrigger>

            {hasIngredients && (
              <TabsTrigger
                value="ingredients"
                className="text-xs font-semibold px-4 py-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs"
              >
                Ingredients
              </TabsTrigger>
            )}

            {hasNutrition && (
              <TabsTrigger
                value="nutrition"
                className="text-xs font-semibold px-4 py-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs"
              >
                Nutrition Info
              </TabsTrigger>
            )}

            {hasStorage && (
              <TabsTrigger
                value="storage"
                className="text-xs font-semibold px-4 py-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs"
              >
                How to Use / Storage
              </TabsTrigger>
            )}

            <TabsTrigger
              value="returns"
              className="text-xs font-semibold px-4 py-2 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-xs"
            >
              Return & Refund Policy
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 pt-2">
            <TabsContent value="details">{renderProductDetails()}</TabsContent>
            {hasIngredients && (
              <TabsContent value="ingredients">{renderIngredients()}</TabsContent>
            )}
            {hasNutrition && (
              <TabsContent value="nutrition">{renderNutrition()}</TabsContent>
            )}
            {hasStorage && (
              <TabsContent value="storage">{renderStorage()}</TabsContent>
            )}
            <TabsContent value="returns">{renderReturnPolicy()}</TabsContent>
          </div>
        </Tabs>
      </div>

      {/* ================= MOBILE VIEW: Accordion ================= */}
      <div className="block md:hidden">
        <Accordion
          type="single"
          collapsible
          defaultValue="details"
          className="w-full divide-y divide-border/80 border-y border-border/80"
        >
          <AccordionItem value="details" className="border-b-0">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3.5">
              Product Details
            </AccordionTrigger>
            <AccordionContent>{renderProductDetails()}</AccordionContent>
          </AccordionItem>

          {hasIngredients && (
            <AccordionItem value="ingredients" className="border-b-0">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3.5">
                Ingredients
              </AccordionTrigger>
              <AccordionContent>{renderIngredients()}</AccordionContent>
            </AccordionItem>
          )}

          {hasNutrition && (
            <AccordionItem value="nutrition" className="border-b-0">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3.5">
                Nutrition Info
              </AccordionTrigger>
              <AccordionContent>{renderNutrition()}</AccordionContent>
            </AccordionItem>
          )}

          {hasStorage && (
            <AccordionItem value="storage" className="border-b-0">
              <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3.5">
                How to Use / Storage
              </AccordionTrigger>
              <AccordionContent>{renderStorage()}</AccordionContent>
            </AccordionItem>
          )}

          <AccordionItem value="returns" className="border-b-0">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-3.5">
              Return & Refund Policy
            </AccordionTrigger>
            <AccordionContent>{renderReturnPolicy()}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default ProductDetailsTabs;
