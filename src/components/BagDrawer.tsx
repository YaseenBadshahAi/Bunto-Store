import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Minus, Plus, Trash2, X } from 'lucide-react';
import { StoreProduct } from '../data/storeCatalog';
import { ProductArtwork } from './ProductArtwork';

export interface BagEntry {
  key: string;
  product: StoreProduct;
  size: string;
  quantity: number;
}

interface BagDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entries: BagEntry[];
  onUpdateQty: (key: string, delta: number) => void;
  onRemoveEntry: (key: string) => void;
  onClearBag: () => void;
}

export function BagDrawer({
  isOpen,
  onClose,
  entries,
  onUpdateQty,
  onRemoveEntry,
  onClearBag,
}: BagDrawerProps) {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  });

  const handleClose = () => {
    setConfirmed(false);
    onClose();
  };

  const handleCheckout = () => {
    setConfirmed(true);
    onClearBag();
  };

  const totalCount = entries.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = entries.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="bag-drawer-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex justify-end bg-black/25 backdrop-blur-[2px]"
          onClick={handleClose}
          role="dialog"
          aria-modal="true"
          aria-label="Shopping Bag"
        >
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 360, damping: 34 }}
            className="flex h-full w-full max-w-md flex-col justify-between bg-[#F0EDE8] p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[#C9C5BE] pb-5">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#6A6660]">
                  BUNTO<span className="text-[#BB080B]">°</span> Virtual Store
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight tabular-nums text-[#191919]">
                  Shopping Bag ({totalCount})
                </h2>
              </div>
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close bag"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C9C5BE] text-[#191919] transition-colors hover:bg-[#191919] hover:text-[#F0EDE8]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6">
              {confirmed ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <CheckCircle2 className="h-10 w-10 text-[#BB080B]" strokeWidth={1.6} />
                  <h3 className="mt-4 text-lg font-semibold text-[#191919]">
                    Selection Reserved
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#6A6660]">
                    Thank you for shopping BUNTO°. Your organic pieces are prepared for studio dispatch.
                  </p>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="mt-6 rounded-full bg-[#191919] px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#F0EDE8] transition-colors hover:bg-[#BB080B]"
                  >
                    Continue Exploring
                  </button>
                </div>
              ) : entries.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="text-sm font-medium text-[#191919]">Your bag is empty</p>
                  <p className="mt-2 max-w-xs text-xs leading-relaxed text-[#6A6660]">
                    Browse the Clothing rack, Caps pegboard, Bags showcase, or Shoes shelf and click any piece to add it.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-[#C9C5BE]/70">
                  {entries.map((entry) => (
                    <li key={entry.key} className="flex gap-4 py-5 first:pt-0">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-[#E8E5DF] p-2">
                        <ProductArtwork
                          product={entry.product}
                          className="h-full w-full"
                          showHanger={false}
                        />
                      </div>

                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-semibold text-[#191919]">
                              {entry.product.name}
                            </h3>
                            <p className="mt-0.5 text-xs text-[#6A6660]">
                              Size {entry.size}
                            </p>
                          </div>
                          <span className="text-sm font-semibold tabular-nums text-[#191919]">
                            ${entry.product.price * entry.quantity}
                          </span>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <div className="inline-flex items-center rounded-full border border-[#C9C5BE] px-1 py-0.5">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(entry.key, -1)}
                              aria-label={`Decrease ${entry.product.name} quantity`}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-[#191919] hover:bg-[#E8E5DF]"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-medium tabular-nums text-[#191919]">
                              {entry.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(entry.key, 1)}
                              aria-label={`Increase ${entry.product.name} quantity`}
                              className="flex h-7 w-7 items-center justify-center rounded-full text-[#191919] hover:bg-[#E8E5DF]"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => onRemoveEntry(entry.key)}
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#6A6660] transition-colors hover:text-[#BB080B]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {entries.length > 0 && !confirmed && (
              <div className="border-t border-[#C9C5BE] pt-5">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-[#6A6660]">Subtotal</span>
                  <span className="text-lg font-semibold tabular-nums text-[#191919]">
                    ${subtotal}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#6A6660]">
                  Complimentary organic cotton dust bag included.
                </p>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="mt-5 flex h-12 w-full items-center justify-center rounded-full bg-[#BB080B] text-sm font-semibold text-white shadow-[0_8px_22px_rgba(187,8,11,0.25)] transition-colors hover:bg-[#990609]"
                >
                  Checkout · ${subtotal}
                </button>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
