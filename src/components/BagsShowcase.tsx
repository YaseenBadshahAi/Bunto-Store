import { useEffect, useRef, useState } from 'react';
import { animate, motion, MotionValue, useMotionValue, useTransform } from 'motion/react';
import { ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { ATELIER_BAGS_PRODUCTS, StoreProduct } from '../data/storeCatalog';

interface BagsShowcaseProps {
  isActive: boolean;
  isStoreOverview: boolean;
  onEnterBags: () => void;
  onOpenDetailModal: (product: StoreProduct) => void;
}

interface OrbitBagCardProps {
  index: number;
  product: StoreProduct;
  orbitMotion: MotionValue<number>;
  spreadX: number;
  isCenter: boolean;
  onClick: () => void;
}

const TOTAL_BAGS = ATELIER_BAGS_PRODUCTS.length;

function wrapMod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function wrapSigned(diff: number, m: number) {
  const w = wrapMod(diff + m / 2, m) - m / 2;
  return w;
}

function OrbitBagCard({
  index,
  product,
  orbitMotion,
  spreadX,
  isCenter,
  onClick,
}: OrbitBagCardProps) {
  // Shortest signed offset around the 15-bag ring: centered at 0, ±1, ±2 visible smoothly in front arc
  const signedOffset = useTransform(orbitMotion, (v) => wrapSigned(index - v, TOTAL_BAGS));
  const x = useTransform(signedOffset, (d) => Math.sin(Math.max(-3, Math.min(3, d)) * 0.56) * spreadX);
  const y = useTransform(signedOffset, (d) => Math.abs(d) * -10);
  const scale = useTransform(signedOffset, (d) => Math.max(0.46, 1.08 - Math.abs(d) * 0.22));
  const opacity = useTransform(signedOffset, (d) => {
    const abs = Math.abs(d);
    if (abs >= 2.65) return 0;
    if (abs <= 1.2) return 1;
    return Math.max(0, 1 - (abs - 1.2) / 1.45);
  });
  const zIndex = useTransform(signedOffset, (d) => Math.round(40 - Math.abs(d) * 10));
  const pointerEvents = useTransform(signedOffset, (d) => (Math.abs(d) < 2.25 ? 'auto' : 'none'));

  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{ x, y, scale, opacity, zIndex, pointerEvents }}
      aria-label={
        isCenter
          ? `Open ${product.name}, $${product.price}`
          : `Bring ${product.name} to center`
      }
      className="group absolute left-1/2 top-1/2 flex h-[clamp(190px,40vh,350px)] aspect-square -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center justify-center focus-visible:outline-2 focus-visible:outline-[#191919]"
    >
      <motion.img
        src={product.imageUrl}
        alt={product.name}
        referrerPolicy="no-referrer"
        draggable={false}
        whileHover={{ scale: 1.11, y: -8 }}
        transition={{ type: 'spring', stiffness: 360, damping: 24 }}
        className="h-full w-full object-contain select-none drop-shadow-[0_24px_30px_rgba(25,25,25,0.2)]"
      />
      {isCenter && (
        <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.26em] text-[#6A6660] opacity-0 transition-opacity duration-200 group-hover:opacity-100 whitespace-nowrap">
          View Details · <span className="font-semibold text-[#BB080B]">${product.price}</span>
        </span>
      )}
    </motion.button>
  );
}

export function BagsShowcase({
  isActive,
  isStoreOverview,
  onEnterBags,
  onOpenDetailModal,
}: BagsShowcaseProps) {
  const initialIndex = 0;
  const [orbitStep, setOrbitStep] = useState<number>(initialIndex);
  const [spreadX, setSpreadX] = useState<number>(330);

  const stageRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<number | null>(null);
  const wheelLockRef = useRef<number>(0);

  const orbitMotion = useMotionValue<number>(initialIndex);
  const activeIdx = wrapMod(orbitStep, TOTAL_BAGS);
  const activeProduct = ATELIER_BAGS_PRODUCTS[activeIdx];

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      setSpreadX(Math.max(108, Math.min(365, w * 0.285)));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const controls = animate(orbitMotion, orbitStep, {
      duration: 0.68,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [orbitStep, orbitMotion]);

  const rotateBy = (delta: number) => {
    setOrbitStep((prev) => prev + delta);
  };

  const rotateToProductIndex = (targetIdx: number) => {
    let diff = wrapMod(targetIdx - activeIdx, TOTAL_BAGS);
    if (diff > TOTAL_BAGS / 2) diff -= TOTAL_BAGS;
    setOrbitStep((prev) => prev + diff);
  };

  const handleCardClick = (index: number) => {
    if (isStoreOverview) {
      onEnterBags();
      return;
    }
    if (index === activeIdx) {
      onOpenDetailModal(ATELIER_BAGS_PRODUCTS[index]);
    } else {
      rotateToProductIndex(index);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!isActive || isStoreOverview) return;
    const now = Date.now();
    if (now - wheelLockRef.current < 220) return;
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
    if (Math.abs(dx) > 46) {
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
      <div className="pointer-events-none absolute left-5 top-18 z-20 text-[9.5px] font-medium uppercase tracking-[0.26em] text-[#6A6660] sm:left-11 sm:top-24 sm:text-[10.5px] sm:tracking-[0.28em]">
        ATELIER HANDBAGS — 15 PIECES
      </div>

      <div
        className="pointer-events-none absolute left-6 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.32em] text-[#6A6660] lg:block"
        aria-hidden="true"
      >
        FULL-GRAIN CALFSKIN &amp; ARTISAN SUEDE
      </div>

      {/* 3D Orbital Bag Stage + Prev/Next Controls */}
      <div className="relative z-10 -mt-10 flex h-[clamp(250px,48vh,430px)] w-full max-w-[1160px] items-center justify-center">
        {/* Soft Studio Contact Shadow beneath Center Bag */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 bottom-[7%] h-9 w-[min(64vw,440px)] -translate-x-1/2 rounded-full bg-radial from-[#191919]/18 via-[#191919]/6 to-transparent blur-[4px]"
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
              aria-label="Previous handbag"
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
              aria-label="Next handbag"
              className="absolute right-3 top-1/2 z-40 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#C9C5BE] bg-[#E8E5DF]/92 text-[#191919] shadow-xs backdrop-blur-sm transition-all hover:scale-105 hover:bg-[#191919] hover:text-[#F0EDE8] focus-visible:outline-2 focus-visible:outline-[#191919] sm:right-8"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* 15 High-Res Transparent Cutout Handbags */}
        {ATELIER_BAGS_PRODUCTS.map((product, idx) => (
          <OrbitBagCard
            key={product.id}
            index={idx}
            product={product}
            orbitMotion={orbitMotion}
            spreadX={spreadX}
            isCenter={idx === activeIdx}
            onClick={() => handleCardClick(idx)}
          />
        ))}
      </div>

      {/* Bottom-Left Editorial Index (`01 | ATELIER LEATHER`) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (isStoreOverview) {
            onEnterBags();
          } else {
            onOpenDetailModal(activeProduct);
          }
        }}
        aria-label={`Open ${activeProduct.name} product card`}
        className="absolute bottom-22 left-5 z-20 hidden items-center text-left transition-opacity hover:opacity-75 lg:bottom-8 lg:left-11 xl:flex"
      >
        <span className="text-3xl font-extralight leading-none tracking-[-0.04em] tabular-nums text-[#191919] sm:text-5xl">
          {String(activeIdx + 1).padStart(2, '0')}
        </span>
        <span className="mx-3.5 h-6 w-px bg-[#C9C5BE] sm:mx-5 sm:h-7" aria-hidden="true" />
        <span className="text-[8.5px] font-medium uppercase leading-[1.6] tracking-[0.28em] text-[#191919] sm:text-[9.5px]">
          Atelier
          <br />
          Leather
        </span>
      </button>

      {/* Bottom-Center 15-Bag Miniature Cutout Strip + Active Metadata */}
      <div className="absolute bottom-20 left-1/2 z-30 flex w-full max-w-[92vw] -translate-x-1/2 flex-col items-center gap-2 sm:bottom-24">
        <div
          className="flex max-w-full items-center gap-1.5 overflow-x-auto px-3 py-1.5 sm:gap-2 no-scrollbar"
          role="tablist"
          aria-label="15 Atelier Handbags"
        >
          {ATELIER_BAGS_PRODUCTS.map((product, idx) => {
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
                  if (isStoreOverview) {
                    onEnterBags();
                  } else {
                    rotateToProductIndex(idx);
                  }
                }}
                className="group relative flex h-10 w-10 shrink-0 cursor-pointer flex-col items-center justify-center focus-visible:outline-2 focus-visible:outline-[#191919] sm:h-11 sm:w-11"
              >
                <motion.img
                  src={product.imageUrl}
                  alt=""
                  aria-hidden="true"
                  referrerPolicy="no-referrer"
                  draggable={false}
                  whileHover={{ scale: 1.24, y: -4 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                  className={`h-full w-full object-contain transition-opacity duration-200 select-none ${
                    active
                      ? 'opacity-100 drop-shadow-[0_6px_10px_rgba(25,25,25,0.28)]'
                      : 'opacity-55 group-hover:opacity-95'
                  }`}
                />
                <span
                  aria-hidden="true"
                  className={`mt-0.5 h-[2px] rounded-full transition-all duration-200 ${
                    active ? 'w-5 bg-[#BB080B]' : 'w-0 bg-transparent'
                  }`}
                />
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (isStoreOverview) {
              onEnterBags();
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
            <span className="hidden sm:inline"> · Open Product Card</span>
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
