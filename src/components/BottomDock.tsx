import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { MoreVertical, RotateCcw } from 'lucide-react';
import { STORE_TABS, StoreCategory } from '../data/storeCatalog';

interface BottomDockProps {
  activeTab: StoreCategory;
  onSelectTab: (tab: StoreCategory) => void;
  ageFilter: string;
  onSelectAgeFilter: (age: string) => void;
}

const AGE_FILTERS = ['All Ages', '1–2Y', '2–3Y', '3–4Y', '5–6Y'];

export function BottomDock({
  activeTab,
  onSelectTab,
  ageFilter,
  onSelectAgeFilter,
}: BottomDockProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!moreOpen) return;
    const handleOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    window.addEventListener('mousedown', handleOutside);
    return () => window.removeEventListener('mousedown', handleOutside);
  }, [moreOpen]);

  return (
    <div
      ref={popoverRef}
      className="pointer-events-auto fixed bottom-4 left-1/2 z-40 max-w-[calc(100vw-1rem)] -translate-x-1/2 sm:bottom-6"
    >
      {moreOpen && (
        <div
          className="mx-auto mb-3 w-64 max-w-[calc(100vw-2rem)] rounded-2xl border border-[#C9C5BE] bg-[#F0EDE8]/98 p-4 shadow-[0_16px_42px_rgba(25,25,25,0.14)] backdrop-blur-md"
          role="dialog"
          aria-label="Store options"
        >
          <div className="flex items-center justify-between border-b border-[#C9C5BE]/70 pb-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#6A6660]">
              Age Fit · Ages 1–6
            </span>
            {ageFilter !== 'All Ages' && (
              <button
                type="button"
                onClick={() => onSelectAgeFilter('All Ages')}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[#BB080B] hover:opacity-80"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {AGE_FILTERS.map((age) => {
              const active = ageFilter === age;
              return (
                <button
                  key={age}
                  type="button"
                  onClick={() => onSelectAgeFilter(age)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-[#191919] text-[#F0EDE8]'
                      : 'bg-[#E8E5DF] text-[#191919]/75 hover:bg-[#C9C5BE]/60 hover:text-[#191919]'
                  }`}
                >
                  {age}
                </button>
              );
            })}
          </div>
          <p className="mt-3 border-t border-[#C9C5BE]/70 pt-2.5 text-[11px] leading-relaxed text-[#6A6660]">
            BUNTO° Virtual Store · GOTS-certified organic cotton &amp; soft knits for small people.
          </p>
        </div>
      )}

      <nav
        aria-label="Store sections"
        className="flex items-center gap-0.5 rounded-full border border-[#C9C5BE]/90 bg-[#F0EDE8]/95 p-1 shadow-[0_12px_36px_rgba(25,25,25,0.12)] backdrop-blur-md sm:p-1.5"
      >
        {STORE_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`relative rounded-full px-2.5 py-1.5 text-[11px] font-medium transition-colors sm:px-4.5 sm:py-2 sm:text-[13px] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#191919] ${
                isActive ? 'text-white' : 'text-[#191919]/70 hover:text-[#191919]'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="buntoActiveDockPill"
                  transition={{ type: 'spring', stiffness: 460, damping: 36 }}
                  className="absolute inset-0 rounded-full bg-[#BB080B] shadow-[0_4px_12px_rgba(187,8,11,0.28)]"
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}

        <div className="mx-0.5 h-4 w-px bg-[#C9C5BE]" aria-hidden="true" />

        <button
          type="button"
          onClick={() => setMoreOpen((v) => !v)}
          aria-expanded={moreOpen}
          aria-label="Filter and store options"
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors sm:h-9 sm:w-9 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#191919] ${
            moreOpen
              ? 'bg-[#191919] text-[#F0EDE8]'
              : 'text-[#191919]/70 hover:bg-[#E8E5DF] hover:text-[#191919]'
          }`}
        >
          <MoreVertical className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}
