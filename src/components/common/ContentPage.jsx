import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/common/PageHeader';
import { Card } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

/**
 * Reusable layout for policy/terms style pages with desktop sticky Table of Contents
 * and mobile collapsible 'On this page' accordion
 */
const ContentPage = ({
  title,
  lastUpdated,
  sections = [],
  className = '',
}) => {
  const [activeId, setActiveId] = useState(sections[0]?.id || '');

  // Track scroll position to highlight active section in TOC
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveId(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const elem = document.getElementById(id);
    if (elem) {
      const yOffset = -90; // account for sticky navbar
      const y = elem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveId(id);
    }
  };

  return (
    <div className={`pb-20 lg:pb-12 ${className}`}>
      <PageHeader
        title={title}
        subtitle={lastUpdated ? `Last updated on ${lastUpdated}` : undefined}
      />

      {/* Mobile Collapsible 'On this page' Accordion */}
      {sections.length > 0 && (
        <div className="lg:hidden mb-6">
          <Accordion
            type="single"
            collapsible
            className="bg-secondary/60 border border-border rounded-xl px-4"
          >
            <AccordionItem value="toc" className="border-b-0">
              <AccordionTrigger className="text-xs font-medium uppercase tracking-wider text-muted-foreground hover:no-underline py-3">
                On this page ({sections.length} sections)
              </AccordionTrigger>
              <AccordionContent className="pb-3 pt-1 space-y-1 divide-y divide-border/40">
                {sections.map((sec) => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={(e) => scrollToSection(e, sec.id)}
                    className="block py-1.5 text-xs font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {sec.heading}
                  </a>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Desktop Sticky Table of Contents */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-24">
          <Card className="p-4 bg-secondary/50 border-border rounded-xl">
            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 px-2">
              On this page
            </h3>
            <nav className="space-y-1">
              {sections.map((sec) => (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  onClick={(e) => scrollToSection(e, sec.id)}
                  className={cn(
                    'block px-2.5 py-1.5 text-xs rounded-lg transition-colors leading-snug',
                    activeId === sec.id
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  )}
                >
                  {sec.heading}
                </a>
              ))}
            </nav>
          </Card>
        </aside>

        {/* Right Column: Structured Text Sections (max ~720px readable width) */}
        <article className="lg:col-span-8 max-w-[720px] space-y-8">
          {sections.map((sec) => (
            <section
              key={sec.id}
              id={sec.id}
              className="scroll-mt-24 space-y-2.5 pb-2"
            >
              <h2 className="text-lg sm:text-xl font-medium text-foreground tracking-tight font-sans">
                {sec.heading}
              </h2>
              <div className="text-xs sm:text-sm text-foreground/85 leading-relaxed space-y-3">
                {sec.content.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </article>
      </div>
    </div>
  );
};

export default ContentPage;
