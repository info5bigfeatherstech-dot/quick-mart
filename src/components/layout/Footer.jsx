import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Heart, Shield, Clock, Award } from 'lucide-react';
import Container from '../common/Container';
import { ROUTES } from '@/utils/constants';

/**
 * Footer component using standard container with links, categories, and legal pages
 */
const Footer = () => {
  return (
    <footer className="w-full bg-secondary border-t border-border mt-12 pt-8 sm:pt-12 pb-28 sm:pb-14 text-xs text-muted-foreground select-none">
      <Container>
        {/* Service Highlights / Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pb-10 border-b border-border/80">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center text-primary shrink-0">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-foreground">
                10-Minute Delivery
              </h4>
              <p className="text-[11px] text-muted-foreground">
                Lightning fast doorstep delivery from local dark stores.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center text-primary shrink-0">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-foreground">
                Best Prices & Offers
              </h4>
              <p className="text-[11px] text-muted-foreground">
                Direct farm produce and manufacturer pricing daily.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-background border border-border flex items-center justify-center text-primary shrink-0">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-foreground">
                Wide Assortment
              </h4>
              <p className="text-[11px] text-muted-foreground">
                Over 5,000+ daily grocery essentials and household items.
              </p>
            </div>
          </div>
        </div>

        {/* Link Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-10 border-b border-border/80">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link to={ROUTES.CATEGORY('fruits-vegetables')} className="hover:text-primary transition-colors">
                  Fruits & Vegetables
                </Link>
              </li>
              <li>
                <Link to={ROUTES.CATEGORY('dairy-bread-eggs')} className="hover:text-primary transition-colors">
                  Dairy, Bread & Eggs
                </Link>
              </li>
              <li>
                <Link to={ROUTES.CATEGORY('snacks-munchies')} className="hover:text-primary transition-colors">
                  Snacks & Munchies
                </Link>
              </li>
              <li>
                <Link to={ROUTES.CATEGORY('cold-drinks-juices')} className="hover:text-primary transition-colors">
                  Cold Drinks & Juices
                </Link>
              </li>
              <li>
                <Link to={ROUTES.CATEGORY('atta-rice-dal')} className="hover:text-primary transition-colors">
                  Atta, Rice & Dal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <span className="hover:text-primary cursor-pointer transition-colors">About Us</span>
              </li>
              <li>
                <span className="hover:text-primary cursor-pointer transition-colors">Careers</span>
              </li>
              <li>
                <span className="hover:text-primary cursor-pointer transition-colors">Blog</span>
              </li>
              <li>
                <span className="hover:text-primary cursor-pointer transition-colors">Press & Media</span>
              </li>
              <li>
                <span className="hover:text-primary cursor-pointer transition-colors">Sustainability</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
              Customer Support
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <Link to={ROUTES.CONTACT_US} className="hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <span className="hover:text-primary cursor-pointer transition-colors">FAQs & Help</span>
              </li>
              <li>
                <Link to={ROUTES.TERMS_AND_CONDITIONS} className="hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PRIVACY_POLICY} className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <span className="hover:text-primary cursor-pointer transition-colors">Return & Refund Policy</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-3">
              Partner With Us
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <span className="hover:text-primary cursor-pointer transition-colors">Franchise Inquiries</span>
              </li>
              <li>
                <span className="hover:text-primary cursor-pointer transition-colors">Warehouse Partners</span>
              </li>
              <li>
                <span className="hover:text-primary cursor-pointer transition-colors">Delivery Partners</span>
              </li>
              <li>
                <span className="hover:text-primary cursor-pointer transition-colors">Brand Collaborations</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link to={ROUTES.HOME} className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
                <Zap className="h-3.5 w-3.5 fill-current text-brand-yellow" />
              </div>
              <span className="font-bold text-sm text-foreground">
                Quick<span className="text-primary">Mart</span>
              </span>
            </Link>
            <span className="text-[11px] text-muted-foreground ml-2">
              © {new Date().getFullYear()} QuickMart Commerce Pvt. Ltd. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <span>Crafted with</span>
            <Heart className="h-3 w-3 text-destructive fill-current" />
            <span>for instant everyday grocery shopping</span>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
