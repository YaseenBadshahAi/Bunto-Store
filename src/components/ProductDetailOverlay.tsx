import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  X,
} from 'lucide-react';
import {
  ColorSwatch,
  STORE_TABS,
  StoreCategory,
  StoreProduct,
} from '../data/storeCatalog';
import { ProductArtwork } from './ProductArtwork';

interface ProductDetailOverlayProps {
  product: StoreProduct | null;
  categoryProducts: StoreProduct[];
  bagCount: number;
  onClose: () => void;
  onSelectProduct: (product: StoreProduct) => void;
  onSelectTab: (tab: StoreCategory) => void;
  onOpenBag: () => void;
  onAddToBag: (product: StoreProduct, size: string, quantity: number) => void;
}

type ThumbnailView = 0 | 1 | 2 | 3;

export function ProductDetailOverlay({
  product,
  categoryProducts,
  bagCount,
  onClose,
  onSelectProduct,
  onSelectTab,
  onOpenBag,
  onAddToBag,
}: ProductDetailOverlayProps) {
  return (
    <AnimatePresence>
      {product && (
        <ProductDetailContent
          key="split-product-card-overlay"
          product={product}
          categoryProducts={categoryProducts}
          bagCount={bagCount}
          onClose={onClose}
          onSelectProduct={onSelectProduct}
          onSelectTab={onSelectTab}
          onOpenBag={onOpenBag}
          onAddToBag={onAddToBag}
        />
      )}
    </AnimatePresence>
  );
}

function ProductDetailContent({
  product,
  categoryProducts,
  bagCount,
  onClose,
  onSelectProduct,
  onSelectTab,
  onOpenBag,
  onAddToBag,
}: Omit<ProductDetailOverlayProps, 'product'> & { product: StoreProduct }) {
  const [stateForProductId, setStateForProductId] = useState<string>(product.id);
  const [selectedSize, setSelectedSize] = useState<string>(product.defaultSize);
  const [selectedSwatch, setSelectedSwatch] = useState<ColorSwatch | null>(
    product.swatches[0] ?? null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [useInches, setUseInches] = useState<boolean>(false);
  const [rotateProgress, setRotateProgress] = useState<number>(0.5); // 0..1 -> -42deg..+42deg
  const [activeThumb, setActiveThumb] = useState<ThumbnailView>(0);
  const [addedState, setAddedState] = useState<boolean>(false);
  const [slideDir, setSlideDir] = useState<1 | -1>(1);

  if (product.id !== stateForProductId) {
    setStateForProductId(product.id);
    setSelectedSize(product.defaultSize);
    setSelectedSwatch(product.swatches[0] ?? null);
    setQuantity(1);
    setRotateProgress(0.5);
    setActiveThumb(0);
    setAddedState(false);
  }

  const arcRef = useRef<HTMLDivElement>(null);
  const draggingArcRef = useRef<boolean>(false);

  const selectPhoto = (nextThumb: ThumbnailView, dir?: 1 | -1) => {
    if (nextThumb === activeThumb) return;
    setSlideDir(dir ?? (nextThumb > activeThumb ? 1 : -1));
    setActiveThumb(nextThumb);
    setRotateProgress(
      nextThumb === 0 ? 0.5 : nextThumb === 1 ? 0.16 : nextThumb === 2 ? 0.84 : 0.68
    );
  };

  const stepPhoto = (delta: number) => {
    const nextThumb = ((activeThumb + delta + 4) % 4) as ThumbnailView;
    selectPhoto(nextThumb, delta > 0 ? 1 : -1);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        stepPhoto(1);
      } else if (e.key === 'ArrowLeft') {
        stepPhoto(-1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const updateArcFromClientX = (clientX: number) => {
    if (!arcRef.current) return;
    const rect = arcRef.current.getBoundingClientRect();
    const raw = (clientX - rect.left) / rect.width;
    const clamped = Math.max(0, Math.min(1, raw));
    setRotateProgress(clamped);
  };

  const handleArcPointerDown = (e: React.PointerEvent) => {
    draggingArcRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    updateArcFromClientX(e.clientX);
  };

  const handleArcPointerMove = (e: React.PointerEvent) => {
    if (!draggingArcRef.current) return;
    updateArcFromClientX(e.clientX);
  };

  const handleArcPointerUp = () => {
    draggingArcRef.current = false;
  };

  // Compute rotation angle & arc knob position along quadratic Bezier (M 10 8 Q 110 34 210 8)
  const t = rotateProgress;
  const p0 = { x: 10, y: 8 };
  const p1 = { x: 110, y: 34 };
  const p2 = { x: 210, y: 8 };
  const knobX = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
  const knobY = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
  const angleDeg = (t - 0.5) * 84; // -42deg .. +42deg

  const formatMeasure = (cm: number) => {
    if (!useInches) return `${cm}`;
    return (cm / 2.54).toFixed(1);
  };

  const unitLabel = useInches ? 'in' : 'cm';

  const handleAddToCart = () => {
    onAddToBag(product, selectedSize || product.defaultSize, quantity);
    setAddedState(true);
    window.setTimeout(() => {
      setAddedState(false);
    }, 1600);
  };

  const handleBuyNow = () => {
    onAddToBag(product, selectedSize || product.defaultSize, quantity);
    onOpenBag();
  };

  const thumbTransform =
    activeThumb === 1
      ? { scale: 1.52, x: 16, y: 42, rotateZ: -3 }
      : activeThumb === 2
      ? { scale: 1.52, x: -16, y: -42, rotateZ: 3 }
      : activeThumb === 3
      ? { scale: 1.24, x: -12, y: 12, rotateZ: 7 }
      : { scale: 1, x: 0, y: 0, rotateZ: 0 };

  const activeOverride = selectedSwatch
    ? {
        primaryColor: selectedSwatch.primaryColor,
        secondaryColor: selectedSwatch.secondaryColor,
        accentColor: selectedSwatch.accentColor,
        imageUrl: selectedSwatch.imageUrl,
        imageCrop: selectedSwatch.imageCrop,
      }
    : undefined;

  return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-50 flex flex-col overflow-x-hidden overflow-y-auto bg-[#F0EDE8] lg:flex-row lg:overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
      >
        {/* ================= LEFT PANE: CARARRA STUDIO STAGE ================= */}
        <motion.section
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -18 }}
          transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex min-h-fit w-full flex-col justify-between bg-[#F0EDE8] px-5 pt-4 pb-6 sm:px-10 sm:py-7 lg:h-full lg:w-1/2"
        >
          {/* Top-left: Back to Room + Brand Mark */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2.5 text-[#191919] transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-[#191919]"
              aria-label="Back to virtual store"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2} />
              <svg
                viewBox="0 0 60 18"
                className="h-3.5 w-8 text-[#191919]"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 16L22 3.5L31 10.5L41 2.5L54 16"
                  stroke="currentColor"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="text-sm font-extrabold tracking-[0.18em] uppercase text-[#191919]">
                BUNTO<sup className="text-[#BB080B]">°</sup>
              </span>
            </button>

            {/* Mobile-only Cart + Close */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                type="button"
                onClick={onOpenBag}
                aria-label={`Shopping bag, ${bagCount} items`}
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#191919] hover:bg-[#191919]/6"
              >
                <ShoppingCart className="h-4 w-4" strokeWidth={1.75} />
                {bagCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#BB080B] px-1 text-[9px] font-bold tabular-nums text-white">
                    {bagCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close product card"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C9C5BE] text-[#191919]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Center: Product Studio Artwork + Prev/Next arrows */}
          <div className="relative my-auto flex flex-col items-center justify-center py-4">
            <div className="relative flex w-full max-w-lg items-center justify-center">
              <button
                type="button"
                onClick={() => stepPhoto(-1)}
                aria-label="Previous photo"
                className="absolute left-0 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#C9C5BE] bg-[#E8E5DF] text-[#191919] shadow-xs transition-colors hover:border-[#191919] hover:bg-[#191919] hover:text-[#F0EDE8]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              <div
                className="flex h-[240px] w-[240px] items-center justify-center overflow-hidden sm:h-[310px] sm:w-[310px]"
                style={{ perspective: '900px' }}
              >
                <AnimatePresence mode="wait" custom={slideDir}>
                  <motion.div
                    key={`${product.id}-${selectedSwatch?.name ?? 'base'}-${activeThumb}`}
                    custom={slideDir}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.4}
                    onDragEnd={(_e, info) => {
                      if (info.offset.x < -38 || info.velocity.x < -280) {
                        stepPhoto(1);
                      } else if (info.offset.x > 38 || info.velocity.x > 280) {
                        stepPhoto(-1);
                      }
                    }}
                    variants={{
                      enter: (dir: 1 | -1) => ({ opacity: 0, x: dir * 48, scale: 0.94 }),
                      exit: (dir: 1 | -1) => ({ opacity: 0, x: -dir * 48, scale: 0.94 }),
                    }}
                    initial="enter"
                    animate={{
                      opacity: 1,
                      x: thumbTransform.x,
                      y: thumbTransform.y,
                      rotateY: angleDeg,
                      rotateZ: thumbTransform.rotateZ,
                      scale: thumbTransform.scale,
                    }}
                    exit="exit"
                    transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full w-full cursor-grab active:cursor-grabbing touch-pan-y"
                  >
                    <ProductArtwork
                      product={product}
                      overrideColors={activeOverride}
                      showHanger={product.category === 'clothing'}
                      className="h-full w-full drop-shadow-[0_24px_30px_rgba(17,21,36,0.14)]"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              <button
                type="button"
                onClick={() => stepPhoto(1)}
                aria-label="Next photo"
                className="absolute right-0 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-[#C9C5BE] bg-[#E8E5DF] text-[#191919] shadow-xs transition-colors hover:border-[#191919] hover:bg-[#191919] hover:text-[#F0EDE8]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Soft Studio Floor Shadow */}
            <div
              className="mt-1 h-4 w-48 rounded-full bg-radial from-[#191919]/24 via-[#191919]/8 to-transparent blur-[2px]"
              aria-hidden="true"
            />

            {/* Curved Interactive Rotate Arc Slider */}
            <div className="mt-3 flex flex-col items-center">
              <div
                ref={arcRef}
                onPointerDown={handleArcPointerDown}
                onPointerMove={handleArcPointerMove}
                onPointerUp={handleArcPointerUp}
                onPointerCancel={handleArcPointerUp}
                className="relative h-10 w-[220px] cursor-ew-resize touch-none select-none"
                role="slider"
                aria-label="Rotate product angle"
                aria-valuemin={-42}
                aria-valuemax={42}
                aria-valuenow={Math.round(angleDeg)}
              >
                <svg viewBox="0 0 220 40" className="h-full w-full overflow-visible">
                  <path
                    d="M 10 8 Q 110 34 210 8"
                    fill="none"
                    stroke="#C9C5BE"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  {/* Knob outer ring */}
                  <circle
                    cx={knobX}
                    cy={knobY}
                    r="6.5"
                    fill="#F0EDE8"
                    stroke="#BB080B"
                    strokeWidth="3.5"
                    className="drop-shadow-[0_2px_6px_rgba(187,8,11,0.35)]"
                  />
                </svg>
              </div>
              <span className="-mt-1 text-[11px] font-semibold tracking-wide text-[#191919]">
                Rotate
              </span>
            </div>

            {/* 4 Rounded Draggable Detail Thumbnails */}
            <div className="mt-4 flex items-center justify-center gap-2.5 sm:gap-3.5">
              {([0, 1, 2, 3] as ThumbnailView[]).map((viewIdx) => {
                const isSelected = activeThumb === viewIdx;
                const cropStyle =
                  viewIdx === 1
                    ? 'scale-[1.78] translate-x-1.5 translate-y-4 -rotate-3'
                    : viewIdx === 2
                    ? 'scale-[1.78] -translate-x-1.5 -translate-y-4 rotate-3'
                    : viewIdx === 3
                    ? 'scale-[1.35] -translate-x-1 translate-y-1 rotate-6'
                    : 'scale-95';

                return (
                  <button
                    key={viewIdx}
                    type="button"
                    onClick={() => selectPhoto(viewIdx)}
                    aria-label={
                      viewIdx === 0
                        ? 'Full studio view'
                        : viewIdx === 1
                        ? 'Upper fabric detail'
                        : viewIdx === 2
                        ? 'Lower stitch detail'
                        : 'Angled studio profile'
                    }
                    className={`relative h-14 w-14 overflow-hidden rounded-xl bg-[#E8E5DF] p-2 transition-all sm:h-[68px] sm:w-[68px] ${
                      isSelected
                        ? 'ring-2 ring-[#191919] shadow-sm'
                        : 'border border-[#C9C5BE] opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className={`h-full w-full transition-transform duration-200 ${cropStyle}`}>
                      <ProductArtwork
                        product={product}
                        overrideColors={activeOverride}
                        showHanger={false}
                        className="h-full w-full"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* ================= RIGHT PANE: CHALK PURCHASE PANEL ================= */}
        <motion.section
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 18 }}
          transition={{ duration: 0.36, ease: [0.16, 1, 0.3, 1] }}
          className="flex w-full flex-col justify-between bg-[#E8E5DF] px-5 py-6 pb-10 sm:px-12 sm:py-7 lg:h-full lg:w-1/2 lg:px-16"
        >
          {/* Top Navigation inside Right Pane */}
          <div className="hidden items-center justify-end gap-7 lg:flex">
            <nav aria-label="Quick store navigation" className="flex items-center gap-6">
              {STORE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    onClose();
                    onSelectTab(tab.id);
                  }}
                  className={`text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    tab.id === product.category
                      ? 'text-[#BB080B] font-semibold'
                      : 'text-[#6A6660] hover:text-[#191919]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onOpenBag}
                aria-label={`Shopping bag, ${bagCount} items`}
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#191919] transition-colors hover:bg-[#191919]/6"
              >
                <ShoppingCart className="h-[18px] w-[18px]" strokeWidth={1.7} />
                {bagCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#BB080B] px-1 text-[9px] font-bold tabular-nums text-white">
                    {bagCount}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close product card"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#C9C5BE] bg-[#F0EDE8] text-[#191919] transition-colors hover:bg-[#191919] hover:text-[#F0EDE8]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Main Product Details Stack */}
          <div className="my-auto max-w-md py-4 lg:py-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6A6660]">
              {product.kicker}
            </p>

            <h1 className="mt-2 text-xl font-bold tracking-tight text-[#191919] sm:text-[30px]">
              {product.name}
            </h1>

            {/* Rating + Reviews */}
            <div className="mt-2.5 flex items-center gap-1.5 text-xs">
              <Star className="h-3.5 w-3.5 fill-[#BB080B] text-[#BB080B]" />
              <span className="font-bold tabular-nums text-[#191919]">{product.rating}</span>
              <span className="text-[#C9C5BE]">·</span>
              <span className="font-medium text-[#6A6660]">
                {product.reviewCount} Reviews
              </span>
            </div>

            {/* Color Swatches */}
            <div className="mt-5 flex items-center gap-3">
              {product.swatches.map((swatch) => {
                const isActive = selectedSwatch?.name === swatch.name;
                return (
                  <button
                    key={swatch.name}
                    type="button"
                    onClick={() => setSelectedSwatch(swatch)}
                    aria-label={`Select color ${swatch.name}`}
                    title={swatch.name}
                    className={`h-6 w-6 rounded-full border border-[#C9C5BE] transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-[#191919] ${
                      isActive ? 'ring-2 ring-[#191919] ring-offset-2 ring-offset-[#E8E5DF]' : ''
                    }`}
                    style={{ backgroundColor: swatch.primaryColor }}
                  />
                );
              })}
              {selectedSwatch && (
                <span className="ml-1 text-xs font-medium text-[#6A6660]">
                  {selectedSwatch.name}
                </span>
              )}
            </div>

            {/* Short Editorial Description */}
            <p className="mt-5 text-[13.5px] leading-relaxed text-[#6A6660]">
              {product.description}
            </p>

            {/* Dimensions Box + View in Inches Toggle */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="inline-grid grid-cols-2 divide-x divide-[#C9C5BE] rounded-[3px] border border-[#C9C5BE] bg-[#F0EDE8]/45">
                <div className="px-4 py-2.5">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6A6660]">
                    {product.dimensions.labelA}
                  </div>
                  <div className="mt-0.5 text-base font-bold tabular-nums text-[#191919]">
                    {formatMeasure(product.dimensions.valueACm)}
                    <span className="ml-0.5 text-[11px] font-normal text-[#6A6660]">
                      {unitLabel}
                    </span>
                  </div>
                </div>
                <div className="px-4 py-2.5">
                  <div className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#6A6660]">
                    {product.dimensions.labelB}
                  </div>
                  <div className="mt-0.5 text-base font-bold tabular-nums text-[#191919]">
                    {formatMeasure(product.dimensions.valueBCm)}
                    <span className="ml-0.5 text-[11px] font-normal text-[#6A6660]">
                      {unitLabel}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setUseInches((v) => !v)}
                className="text-xs font-medium text-[#6A6660] underline underline-offset-4 transition-colors hover:text-[#191919]"
              >
                {useInches ? 'view in cm' : 'view in inches'}
              </button>
            </div>

            {/* Compact Size Selector */}
            <div className="mt-5 flex flex-wrap items-center gap-1.5">
              {product.sizes.map((size) => {
                const isActive = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-[#191919] text-[#F0EDE8]'
                        : 'border border-[#C9C5BE] bg-[#F0EDE8]/70 text-[#191919]/80 hover:border-[#191919] hover:text-[#191919]'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            {/* Price */}
            <div className="mt-6 text-2xl font-bold tabular-nums text-[#191919]">
              ${product.price.toFixed(2)}
            </div>

            {/* Quantity Stepper ([ − ] 1 [ + ]) */}
            <div className="mt-4 flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-[#C9C5BE] bg-[#F0EDE8] text-[#191919] transition-colors hover:border-[#191919]"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-4 text-center text-sm font-semibold tabular-nums text-[#191919]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="flex h-8 w-8 items-center justify-center rounded-md bg-[#191919] text-[#F0EDE8] transition-colors hover:bg-[#BB080B]"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Dual CTAs: ADD TO CART (Cararra bordered) + BUY NOW (Milano Red) */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl px-6 text-xs font-bold uppercase tracking-[0.12em] transition-all whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#191919] ${
                  addedState
                    ? 'bg-[#191919] text-[#F0EDE8] shadow-[0_8px_22px_rgba(25,25,25,0.22)]'
                    : 'border border-[#C9C5BE] bg-[#F0EDE8] text-[#191919] shadow-[0_6px_18px_rgba(25,25,25,0.05)] hover:border-[#191919]'
                }`}
              >
                {addedState ? (
                  <>
                    <span>Added</span>
                    <Check className="h-4 w-4" strokeWidth={2.4} />
                  </>
                ) : (
                  <span>Add to cart</span>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                className="flex h-12 flex-1 items-center justify-center rounded-xl bg-[#BB080B] px-6 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-[0_12px_28px_rgba(187,8,11,0.28)] transition-colors hover:bg-[#990609] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#191919]"
              >
                Buy now
              </button>
            </div>
          </div>

          <div className="hidden h-4 lg:block" aria-hidden="true" />
        </motion.section>
      </motion.div>
  );
}
