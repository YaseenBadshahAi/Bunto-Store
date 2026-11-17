import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  CAPS_PRODUCTS,
  SHOES_PRODUCTS,
  StoreCategory,
  StoreProduct,
} from '../data/storeCatalog';
import { ClothingShowcase } from './ClothingShowcase';
import { BagsShowcase } from './BagsShowcase';

interface VirtualRoomProps {
  activeTab: StoreCategory;
  ageFilter: string;
  shoesFullscreen: boolean;
  onSelectTab: (tab: StoreCategory) => void;
  onSelectProduct: (product: StoreProduct) => void;
}

const WALL_INDEX_MAP: Record<StoreCategory, number> = {
  clothing: 0,
  caps: 1,
  bags: 2,
  shoes: 3,
  store: 1.5,
};

export function VirtualRoom({
  activeTab,
  ageFilter,
  shoesFullscreen,
  onSelectTab,
  onSelectProduct,
}: VirtualRoomProps) {
  const [storePanOffset, setStorePanOffset] = useState<number>(0);
  const dragStartXRef = useRef<number | null>(null);

  const wallPos = WALL_INDEX_MAP[activeTab];
  const isStoreOverview = activeTab === 'store';

  const matchesAge = (product: StoreProduct) => {
    if (ageFilter === 'All Ages') return true;
    if (product.category !== 'clothing' && product.category !== 'caps') return true;
    return product.sizes.includes(ageFilter);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartXRef.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartXRef.current === null) return;
    const dx = e.clientX - dragStartXRef.current;
    if (Math.abs(dx) > 4 && activeTab === 'store') {
      setStorePanOffset((prev) => Math.max(-1.2, Math.min(1.2, prev - dx * 0.0025)));
      dragStartXRef.current = e.clientX;
    }
  };

  const handlePointerUp = () => {
    dragStartXRef.current = null;
  };

  const effectiveWallPos = isStoreOverview ? wallPos + storePanOffset : wallPos;

  const getWallAnimation = (wallIdx: number) => {
    const dist = wallIdx - effectiveWallPos;
    const clampedDist = Math.max(-2, Math.min(2, dist));
    if (isStoreOverview) {
      return {
        rotateY: clampedDist * -8,
        scale: 0.98 - Math.min(0.05, Math.abs(dist) * 0.025),
        opacity: 1,
      };
    }
    return {
      rotateY: clampedDist * -14,
      scale: Math.abs(dist) < 0.15 ? 1 : 0.94,
      opacity: Math.abs(dist) < 0.85 ? 1 : 0.55,
    };
  };

  return (
    <div
      className="studio-room-bg relative h-full w-full overflow-hidden select-none"
      style={{ perspective: '1600px' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* Horizon floor seam */}
      <div
        className="studio-floor-seam pointer-events-none absolute inset-x-0 top-[70%] h-24 z-0"
        aria-hidden="true"
      />

      {/* Camera Panning Track across the 4 Gallery Walls */}
      <motion.div
        animate={{
          x: `calc(-${effectiveWallPos * 100}vw)`,
          scale: isStoreOverview ? 0.86 : 1,
        }}
        transition={{
          duration: 0.85,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{ transformOrigin: '50% 52%', transformStyle: 'preserve-3d' }}
        className="relative flex h-full w-[400vw] items-center"
      >
        {/* ================= WALL 0: TINY CLOTHING SHOWCASE ================= */}
        <motion.section
          aria-label="Clothing Wall"
          animate={getWallAnimation(0)}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => isStoreOverview && onSelectTab('clothing')}
          className={`relative h-full w-[100vw] shrink-0 overflow-hidden bg-[#F0EDE8] ${
            isStoreOverview ? 'cursor-pointer' : ''
          }`}
        >
          <ClothingShowcase
            isActive={activeTab === 'clothing'}
            isStoreOverview={isStoreOverview}
            ageFilter={ageFilter}
            onEnterClothing={() => onSelectTab('clothing')}
            onOpenDetailModal={onSelectProduct}
          />
        </motion.section>

        {/* ================= WALL 1: BRANDED CAPS BOUTIQUE (24 DESIGNS) ================= */}
        <motion.section
          aria-label="Caps Wall"
          animate={getWallAnimation(1)}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => isStoreOverview && onSelectTab('caps')}
          className={`relative flex h-full w-[100vw] shrink-0 flex-col overflow-hidden bg-[#F0EDE8] text-[#191919] ${
            isStoreOverview ? 'cursor-pointer' : ''
          }`}
        >
          <div className="h-full w-full overflow-y-auto px-4 pt-20 pb-26 sm:px-8 sm:pt-24 sm:pb-28 lg:px-12 no-scrollbar">
            <div className="mx-auto max-w-[1440px]">
              {/* Responsive Editorial Header */}
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-[#C9C5BE]/70 pb-3 sm:mb-6">
                <div>
                  <p className="text-[9.5px] font-semibold uppercase tracking-[0.26em] text-[#6A6660] sm:text-[10.5px]">
                    CURATED HEADWEAR — 24 DESIGNS
                  </p>
                  <h2 className="mt-1 text-lg font-bold tracking-tight text-[#191919] sm:text-2xl">
                    Caps Archive
                  </h2>
                </div>
                <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#6A6660]">
                  Nike · Adidas · New Era · Polo · Jordan
                </span>
              </div>

              {/* Clean Responsive Grid (Mobile 2 col · Tablet 3-4 col · Desktop 6 col) */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6 lg:gap-5">
                {CAPS_PRODUCTS.map((product) => {
                  const dimmed = !matchesAge(product);
                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isStoreOverview) {
                          onSelectTab('caps');
                        } else {
                          onSelectProduct(product);
                        }
                      }}
                      aria-label={`${product.name}, $${product.price}`}
                      className={`group flex flex-col text-left transition-opacity focus-visible:outline-2 focus-visible:outline-[#191919] ${
                        dimmed ? 'opacity-35' : 'opacity-100'
                      }`}
                    >
                      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-[#C9C5BE]/65 bg-[#E8E5DF]/75 p-3 transition-all duration-300 group-hover:border-[#191919]/40 group-hover:bg-[#E8E5DF] sm:p-4">
                        <motion.img
                          src={product.imageUrl}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          draggable={false}
                          whileHover={{ scale: 1.09, y: -4 }}
                          transition={{ type: 'spring', stiffness: 360, damping: 24 }}
                          className="h-full w-full object-contain select-none drop-shadow-[0_14px_18px_rgba(25,25,25,0.16)]"
                        />
                      </div>
                      <div className="mt-2 px-0.5">
                        <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#6A6660]">
                          {product.kicker}
                        </div>
                        <div className="mt-0.5 line-clamp-1 text-xs font-semibold text-[#191919] group-hover:text-[#BB080B] sm:text-[13px]">
                          {product.name}
                        </div>
                        <div className="mt-0.5 text-xs font-bold tabular-nums text-[#BB080B]">
                          ${product.price}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Architectural room corner seam */}
          <div
            className="pointer-events-none absolute right-0 top-0 bottom-0 z-20 w-10 border-r border-[#C9C5BE]/60 bg-gradient-to-l from-[#191919]/[0.05] to-transparent"
            aria-hidden="true"
          />
        </motion.section>

        {/* ================= WALL 2: ATELIER HANDBAGS (15 PIECES) ================= */}
        <motion.section
          aria-label="Bags Wall"
          animate={getWallAnimation(2)}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => isStoreOverview && onSelectTab('bags')}
          className={`relative flex h-full w-[100vw] shrink-0 items-center justify-center overflow-hidden bg-[#F0EDE8] ${
            isStoreOverview ? 'cursor-pointer' : ''
          }`}
        >
          <BagsShowcase
            isActive={activeTab === 'bags'}
            isStoreOverview={isStoreOverview}
            onEnterBags={() => onSelectTab('bags')}
            onOpenDetailModal={onSelectProduct}
          />
        </motion.section>

        {/* ================= WALL 3: BRANDED SNEAKERS BOUTIQUE (20 DESIGNS) ================= */}
        <motion.section
          aria-label="Shoes Wall"
          animate={getWallAnimation(3)}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => isStoreOverview && onSelectTab('shoes')}
          className={`relative flex h-full w-[100vw] shrink-0 flex-col overflow-hidden bg-[#F0EDE8] text-[#191919] ${
            isStoreOverview ? 'cursor-pointer' : ''
          }`}
        >
          <div
            className={`h-full w-full overflow-y-auto px-4 sm:px-8 lg:px-12 no-scrollbar ${
              shoesFullscreen ? 'pt-8 pb-10 sm:pt-10 sm:pb-12' : 'pt-20 pb-26 sm:pt-24 sm:pb-28'
            }`}
          >
            <div className="mx-auto max-w-[1440px]">
              {/* Responsive Editorial Header */}
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 border-b border-[#C9C5BE]/70 pb-3 sm:mb-6">
                <div>
                  <p className="text-[9.5px] font-semibold uppercase tracking-[0.26em] text-[#6A6660] sm:text-[10.5px]">
                    FOOTWEAR GALLERY — 20 DESIGNS
                  </p>
                  <h2 className="mt-1 text-lg font-bold tracking-tight text-[#191919] sm:text-2xl">
                    Sneaker Archive
                  </h2>
                </div>
                <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#6A6660]">
                  Nike · Jordan · Adidas · New Balance · ASICS · Salomon
                </span>
              </div>

              {/* Clean Responsive Grid (Mobile 2 col · Tablet 3-4 col · Desktop 5 col) */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-5">
                {SHOES_PRODUCTS.map((product) => {
                  const dimmed = !matchesAge(product);
                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isStoreOverview) {
                          onSelectTab('shoes');
                        } else {
                          onSelectProduct(product);
                        }
                      }}
                      aria-label={`${product.name}, $${product.price}`}
                      className={`group flex flex-col text-left transition-opacity focus-visible:outline-2 focus-visible:outline-[#191919] ${
                        dimmed ? 'opacity-35' : 'opacity-100'
                      }`}
                    >
                      <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl border border-[#C9C5BE]/65 bg-[#E8E5DF]/75 p-3 transition-all duration-300 group-hover:border-[#191919]/40 group-hover:bg-[#E8E5DF] sm:p-4">
                        <motion.img
                          src={product.imageUrl}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          draggable={false}
                          whileHover={{ scale: 1.09, y: -4 }}
                          transition={{ type: 'spring', stiffness: 360, damping: 24 }}
                          className="h-full w-full object-contain select-none drop-shadow-[0_14px_18px_rgba(25,25,25,0.16)]"
                        />
                      </div>
                      <div className="mt-2 px-0.5">
                        <div className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[#6A6660]">
                          {product.kicker}
                        </div>
                        <div className="mt-0.5 line-clamp-1 text-xs font-semibold text-[#191919] group-hover:text-[#BB080B] sm:text-[13px]">
                          {product.name}
                        </div>
                        <div className="mt-0.5 text-xs font-bold tabular-nums text-[#BB080B]">
                          ${product.price}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.section>
      </motion.div>

      {/* Soft frosted glass veil on Home overview so center BUNTO logo reads clearly */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-0 z-20 transition-opacity duration-700 ${
          isStoreOverview
            ? 'bg-[#F0EDE8]/28 opacity-100 backdrop-blur-[6px]'
            : 'opacity-0'
        }`}
      />
    </div>
  );
}
