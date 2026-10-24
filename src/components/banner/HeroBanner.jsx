import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * HeroBanner component:
 * Clean, panoramic farm-fresh grocery banner template placed just below the navbar.
 * Focused purely on high-impact typography, seamless grocery visual, and a prominent Shop Now CTA.
 */
const HeroBanner = () => {
  return (
    <section className="w-full pt-1 pb-3 sm:pb-4">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl min-h-[200px] sm:min-h-[230px] md:min-h-[260px] lg:min-h-[280px] flex items-center shadow-md border border-emerald-800/25">
        {/* Full-width Seamless Panoramic Grocery Background Image */}
        <img
          src="/fresh-farm-banner.jpg"
          alt="Stock up on daily essentials"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover object-right md:object-center"
        />

        {/* Ambient Dark-to-Light Gradient Protection for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/85 via-emerald-950/60 sm:via-emerald-950/30 to-transparent pointer-events-none" />

        {/* Content Box on the Left */}
        <div className="relative z-10 max-w-xl sm:max-w-2xl p-5 sm:p-7 md:p-9 lg:p-11 flex flex-col justify-center items-start space-y-2 sm:space-y-3">
          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold text-white tracking-tight leading-[1.15] drop-shadow-md">
            Stock Up on Farm-Fresh <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-lime-300">
              Daily Essentials
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-white/95 text-xs sm:text-sm lg:text-[15px] font-normal leading-relaxed max-w-md sm:max-w-lg drop-shadow-xs capitalize">
            Crisp handpicked fruits, pure organic dairy, farm-fresh eggs, and garden vegetables — sourced daily & delivered to your doorstep in 10 minutes.
          </p>

          {/* Action Button */}
          <div className="pt-2 sm:pt-3">
            <Link
              to="/category/dairy-bread-eggs"
              className="inline-flex items-center gap-2 bg-white text-emerald-900 hover:bg-neutral-100 font-bold text-xs sm:text-sm px-6 py-2.5 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer group/btn"
            >
              <span>Shop Now</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1 text-emerald-800" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
