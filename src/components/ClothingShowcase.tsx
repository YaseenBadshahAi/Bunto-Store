import { useEffect, useRef, useState } from 'react';
import { animate, motion, MotionValue, useMotionValue, useTransform } from 'motion/react';
import { ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { CLOTHING_PRODUCTS, StoreProduct } from '../data/storeCatalog';

interface ClothingShowcaseProps {
  isActive: boolean;
  isStoreOverview: boolean;
  ageFilter: string;
  onEnterClothing: () => void;
  onOpenDetailModal: (product: StoreProduct) => void;
}

interface OrbitGarmentCardProps {
  index: number;
  product: StoreProduct;
  orbitMotion: MotionValue<number>;
  spreadX: number;
  isCenter: boolean;
  dimmedByAge: boolean;
  onClick: () => void;
}

const TOTAL_JACKETS = CLOTHING_PRODUCTS.length;

function wrapMod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function OrbitGarmentCard({
  index,
  product,
  orbitMotion,
  spreadX,
  isCenter,
  dimmedByAge,
  onClick,
}: OrbitGarmentCardProps) {
  const angle = useTransform(orbitMotion, (v) => ((index - v) / TOTAL_JACKETS) * Math.PI * 2);
  const x = useTransform(angle, (a) => Math.sin(a) * spreadX);
  const y = useTransform(angle, (a) => -Math.cos(a) * 24);
  const scale = useTransform(angle, (a) => 0.72 + 0.34 * Math.cos(a));
  const opacity = useTransform(angle, (a) => {
    const base = 0.62 + 0.38 * Math.max(0, Math.cos(a));
    return dimmedByAge ? base * 0.42 : base;
  });
  const zIndex = useTransform(angle, (a) => Math.round(20 + 15 * Math.cos(a)));

  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{ x, y, scale, opacity, zIndex }}
      aria-label={
        isCenter
          ? `Open ${product.name}, $${product.price}`
          : `Bring ${product.name} to front`
      }
      className="group absolute left-1/2 top-1/2 flex h-[clamp(200px,44vh,380px)] aspect-[3/4] -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center justify-center focus-visible:outline-2 focus-visible:outline-[#191919]"
    >
      <motion.img
        src={product.imageUrl}
        alt={product.name}
        referrerPolicy="no-referrer"
        draggable={false}
        whileHover={{ scale: 1.09, y: -6 }}
        transition={{ type: 'spring', stiffness: 360, damping: 24 }}
        className="h-full w-full object-contain select-none drop-shadow-[0_22px_26px_rgba(25,25,25,0.18)]"
      />
      {isCenter && (
        <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.26em] text-[#6A6660] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          View Product · <span className="text-[#BB080B] font-semibold">${product.price}</span>
        </span>
      )}
    </motion.button>
  );
}

export function ClothingShowcase({
  isActive,
  isStoreOverview,
  ageFilter,
  onEnterClothing,
  onOpenDetailModal,
}: ClothingShowcaseProps) {
  // Start with index 4 (Amber Trail Parka) front-center for warm focal balance against #F9F2E9
  const initialIndex = 4;
  const [orbitStep, setOrbitStep] = useState<number>(initialIndex);
  const [spreadX, setSpreadX] = useState<number>(290);

  const stageRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<number | null>(null);
  const wheelLockRef = useRef<number>(0);

  const orbitMotion = useMotionValue<number>(initialIndex);
  const activeIdx = wrapMod(orbitStep, TOTAL_JACKETS);
  const activeProduct = CLOTHING_PRODUCTS[activeIdx];

  // Responsive orbital spread radius
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      setSpreadX(Math.max(104, Math.min(315, w * 0.27)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Animate continuous orbital progress whenever orbitStep updates
  useEffect(() => {
    const controls = animate(orbitMotion, orbitStep, {
      duration: 0.72,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [orbitStep, orbitMotion]);

  const matchesAge = (product: StoreProduct) => {
    if (ageFilter === 'All Ages') return true;
    return product.sizes.includes(ageFilter);
  };

  const rotateBy = (delta: number) => {
    setOrbitStep((prev) => prev + delta);
  };

  const rotateToProductIndex = (targetIdx: number) => {
    let diff = wrapMod(targetIdx - activeIdx, TOTAL_JACKETS);
    if (diff > TOTAL_JACKETS / 2) diff -= TOTAL_JACKETS;
    setOrbitStep((prev) => prev + diff);
  };

  const handleCardClick = (index: number) => {
    if (isStoreOverview) {
      onEnterClothing();
      return;
    }
    if (index === activeIdx) {
      onOpenDetailModal(CLOTHING_PRODUCTS[index]);
    } else {
      rotateToProductIndex(index);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!isActive || isStoreOverview) return;
    const now = Date.now();
    if (now - wheelLockRef.current < 260) return;
    const primaryDelta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(primaryDelta) < 12) return;
    wheelLockRef.current = now;
    rotateBy(primaryDelta > 0 ? 1 : -1);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isActive || isStoreOverview) return;
    dragStartRef.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragStartRef.current === null) return;
    const dx = e.clientX - dragStartRef.current;
    if (Math.abs(dx) > 48) {
      rotateBy(dx < 0 ? 1 : -1);
      dragStartRef.current = e.clientX;
    }
  };

  const handlePointerUp = () => {
    dragStartRef.current = null;
  };

  return (
    <div
      ref={stageRef}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#F0EDE8] text-[#191919] select-none"
    >
      {/* Editorial Corner Metadata */}
      <div className="pointer-events-none absolute left-4 top-18 z-20 text-[8.5px] font-medium uppercase tracking-[0.2em] text-[#6A6660] sm:left-11 sm:top-24 sm:text-[10.5px] sm:tracking-[0.28em]">
        THE BASICS — 5 PIECES
      </div>

      <div className="pointer-events-none absolute right-4 top-18 z-20 text-right text-[8.5px] font-medium uppercase leading-[1.5] tracking-[0.2em] text-[#6A6660] sm:right-10 sm:top-24 sm:text-[10.5px] sm:leading-[1.6] sm:tracking-[0.28em]">
        ORGANIC COTTON
        <br />
        OUTERWEAR
      </div>

      <div
        className="pointer-events-none absolute left-6 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.32em] text-[#6A6660] lg:block"
        aria-hidden="true"
      >
        EVERYDAY ESSENTIALS FOR LITTLE EXPLORERS
      </div>

      {/* Giant Background TINY Watermark in subtle Chalk */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-[62%] text-center text-[clamp(140px,24vw,320px)] font-bold leading-none tracking-[-0.025em] text-[#E4E0D8]"
      >
        TINY
      </div>

      {/* 3D Orbital Carousel Stage */}
      <div className="relative z-10 flex h-[clamp(270px,52vh,460px)] w-full max-w-[1120px] items-center justify-center">
        {/* Soft Studio Floor Shadow beneath Center Jacket */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 bottom-[8%] h-10 w-[min(68vw,540px)] -translate-x-1/2 rounded-full bg-radial from-[#191919]/16 via-[#191919]/6 to-transparent blur-[4px]"
        />

        {/* Prev / Next Orbit Step Buttons */}
        {!isStoreOverview && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                rotateBy(-1);
              }}
              aria-label="Previous jacket"
              className="absolute left-3 top-1/2 z-40 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#C9C5BE] bg-[#E8E5DF]/92 text-[#191919] shadow-xs backdrop-blur-sm transition-all hover:scale-105 hover:bg-[#191919] hover:text-[#F0EDE8] focus-visible:outline-2 focus-visible:outline-[#191919] sm:left-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                rotateBy(1);
              }}
              aria-label="Next jacket"
              className="absolute right-3 top-1/2 z-40 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#C9C5BE] bg-[#E8E5DF]/92 text-[#191919] shadow-xs backdrop-blur-sm transition-all hover:scale-105 hover:bg-[#191919] hover:text-[#F0EDE8] focus-visible:outline-2 focus-visible:outline-[#191919] sm:right-8"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* 5 Transparent-Cutout Jackets on the Continuous 3D Orbital Ring */}
        {CLOTHING_PRODUCTS.map((product, idx) => (
          <OrbitGarmentCard
            key={product.id}
            index={idx}
            product={product}
            orbitMotion={orbitMotion}
            spreadX={spreadX}
            isCenter={idx === activeIdx}
            dimmedByAge={!matchesAge(product)}
            onClick={() => handleCardClick(idx)}
          />
        ))}
      </div>

      {/* Bottom-Left Editorial Index (`01 | JACKET COLLECTION`) -> opens centered jacket's Product Card */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (isStoreOverview) {
            onEnterClothing();
          } else {
            onOpenDetailModal(activeProduct);
          }
        }}
        aria-label={`Open ${activeProduct.name} product card`}
        className="absolute bottom-24 left-11 z-20 hidden items-center text-left transition-opacity hover:opacity-75 lg:bottom-8 xl:flex"
      >
        <span className="text-3xl font-extralight leading-none tracking-[-0.04em] tabular-nums text-[#191919] sm:text-5xl">
          01
        </span>
        <span className="mx-3.5 h-6 w-px bg-[#C9C5BE] sm:mx-5 sm:h-7" aria-hidden="true" />
        <span className="text-[8.5px] font-medium uppercase leading-[1.6] tracking-[0.28em] text-[#191919] sm:text-[9.5px]">
          Jacket
          <br />
          Collection
        </span>
      </button>

      {/* Bottom-Center Carousel Dots + Hint above BottomDock */}
      <div className="absolute bottom-20 left-1/2 z-20 flex w-full max-w-[90vw] -translate-x-1/2 flex-col items-center gap-2 sm:bottom-24">
        <div className="flex items-center gap-2.5" role="tablist" aria-label="Jacket carousel">
          {CLOTHING_PRODUCTS.map((product, idx) => {
            const active = idx === activeIdx;
            return (
              <button
                key={product.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Select ${product.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  rotateToProductIndex(idx);
                }}
                className={`h-2 w-2 rounded-full transition-all duration-200 ${
                  active ? 'scale-120 bg-[#BB080B]' : 'bg-[#C9C5BE] hover:bg-[#191919]/60'
                }`}
              />
            );
          })}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (isStoreOverview) {
              onEnterClothing();
            } else {
              onOpenDetailModal(activeProduct);
            }
          }}
          className="flex max-w-full flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-center text-[8.5px] font-medium uppercase tracking-[0.18em] text-[#6A6660] transition-colors hover:text-[#191919] sm:text-[9px] sm:tracking-[0.24em]"
        >
          <ArrowDown className="h-2.5 w-2.5 shrink-0 text-[#BB080B]" strokeWidth={1.6} />
          <span>
            {activeProduct.name} ·{' '}
            <span className="tabular-nums font-semibold text-[#191919]">${activeProduct.price}</span>
            <span className="hidden sm:inline"> · Click center jacket for details</span>
            <span className="sm:hidden"> · Tap for details</span>
          </span>
        </button>
      </div>

      {/* Architectural room corner seam */}
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 z-20 w-10 border-r border-[#C9C5BE]/60 bg-gradient-to-l from-[#191919]/[0.05] to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}
