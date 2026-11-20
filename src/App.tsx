import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, Maximize2, Minimize2, ShoppingBag, User } from 'lucide-react';
import {
  getProductsByCategory,
  StoreCategory,
  StoreProduct,
} from './data/storeCatalog';
import { VirtualRoom } from './components/VirtualRoom';
import { BottomDock } from './components/BottomDock';
import { ProductDetailOverlay } from './components/ProductDetailOverlay';
import { BagDrawer, BagEntry } from './components/BagDrawer';
import { LoginPage, StoreUserSession } from './components/LoginPage';

const USER_STORAGE_KEY = 'bunto_member_session';

export default function App() {
  const [activeTab, setActiveTab] = useState<StoreCategory>('store');
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [userSession, setUserSession] = useState<StoreUserSession | null>(() => {
    try {
      const saved = window.localStorage.getItem(USER_STORAGE_KEY);
      return saved ? (JSON.parse(saved) as StoreUserSession) : null;
    } catch {
      return null;
    }
  });
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(null);
  const [bagOpen, setBagOpen] = useState(false);
  const [bagEntries, setBagEntries] = useState<BagEntry[]>([]);
  const [ageFilter, setAgeFilter] = useState<string>('All Ages');
  const [shoesFullscreen, setShoesFullscreen] = useState(false);
  const [viewportHeight, setViewportHeight] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerHeight : 800
  );

  const totalBagCount = bagEntries.reduce((sum, entry) => sum + entry.quantity, 0);

  useEffect(() => {
    const onResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Keyboard shortcuts to cycle tabs or exit full screen when no modal is open
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedProduct || bagOpen || loginOpen) return;
      if (e.key === 'Escape' && shoesFullscreen) {
        setShoesFullscreen(false);
        if (document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
        }
        return;
      }
      const order: StoreCategory[] = ['store', 'clothing', 'caps', 'bags', 'shoes'];
      const idx = order.indexOf(activeTab);
      if (e.key === 'ArrowRight') {
        setActiveTab(order[(idx + 1) % order.length]);
      } else if (e.key === 'ArrowLeft') {
        setActiveTab(order[(idx - 1 + order.length) % order.length]);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeTab, selectedProduct, bagOpen, shoesFullscreen, loginOpen]);

  // Keep state synced if user exits native fullscreen via browser Esc
  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setShoesFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const handleToggleShoesFullscreen = () => {
    const next = !shoesFullscreen;
    setShoesFullscreen(next);
    if (next) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
  };

  const handleBack = () => {
    if (selectedProduct) {
      setSelectedProduct(null);
    } else if (loginOpen) {
      setLoginOpen(false);
    } else if (shoesFullscreen) {
      setShoesFullscreen(false);
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
    } else if (activeTab !== 'store') {
      setActiveTab('store');
    }
  };

  const handleSelectTab = (tab: StoreCategory) => {
    setSelectedProduct(null);
    setLoginOpen(false);
    if (tab !== 'shoes' && shoesFullscreen) {
      setShoesFullscreen(false);
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
    }
    setActiveTab(tab);
  };

  const handleOpenLogin = () => {
    setSelectedProduct(null);
    if (shoesFullscreen) {
      setShoesFullscreen(false);
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
    }
    setLoginOpen(true);
  };

  const handleLoginSuccess = (session: StoreUserSession, remember: boolean) => {
    setUserSession(session);
    try {
      if (remember) {
        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(session));
      } else {
        window.localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch {
      // ignore storage failure
    }
  };

  const handleLogout = () => {
    setUserSession(null);
    try {
      window.localStorage.removeItem(USER_STORAGE_KEY);
    } catch {
      // ignore storage failure
    }
  };

  const handleAddToBag = (product: StoreProduct, size: string, quantity: number) => {
    const key = `${product.id}__${size}`;
    setBagEntries((prev) => {
      const existing = prev.find((item) => item.key === key);
      if (existing) {
        return prev.map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { key, product, size, quantity }];
    });
  };

  const handleUpdateQty = (key: string, delta: number) => {
    setBagEntries((prev) =>
      prev
        .map((item) =>
          item.key === key ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveEntry = (key: string) => {
    setBagEntries((prev) => prev.filter((item) => item.key !== key));
  };

  const categoryProducts = selectedProduct
    ? getProductsByCategory(selectedProduct.category)
    : [];

  const hideStoreHeader =
    loginOpen || Boolean(selectedProduct) || (activeTab === 'shoes' && shoesFullscreen);
  const hideDock =
    loginOpen || Boolean(selectedProduct) || (activeTab === 'shoes' && shoesFullscreen);
  const isHome = activeTab === 'store';
  const homeCenterOffsetY = Math.max(120, Math.round(viewportHeight * 0.5 - 42));
  const logoTransition = { duration: 0.78, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <main className="relative h-full w-full overflow-hidden bg-[#F0EDE8] text-[#191919]">
      {/* Fixed Top Navigation Chrome (hidden in Login split view, full-screen shoe showcase, or split product card) */}
      {!hideStoreHeader && (
        <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 sm:px-8 sm:py-5">
          {/* Top-left circular Back button */}
          <div className="pointer-events-auto">
            <button
              type="button"
              onClick={handleBack}
              aria-label={selectedProduct ? 'Back to gallery wall' : 'Return to home'}
              className={`flex h-10 w-10 items-center justify-center rounded-full transition-all focus-visible:outline-2 focus-visible:outline-[#191919] ${
                selectedProduct || !isHome
                  ? 'bg-[#191919] text-[#F0EDE8] shadow-md hover:scale-105 hover:bg-[#BB080B]'
                  : 'pointer-events-none opacity-0'
              }`}
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>

          {/* Spacer balancing the centered gliding brand lockup */}
          <div className="h-10 w-24" aria-hidden="true" />

          {/* Top-right Account & Shopping Bag Buttons */}
          <div className="pointer-events-auto flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleOpenLogin}
              aria-label={userSession ? `Account (${userSession.name})` : 'Sign in to BUNTO'}
              className="flex h-10 items-center gap-1.5 rounded-full px-2.5 text-[#191919] transition-colors hover:bg-[#191919]/6 focus-visible:outline-2 focus-visible:outline-[#191919]"
            >
              <User className="h-[18px] w-[18px]" strokeWidth={1.65} />
              <span className="hidden text-xs font-semibold sm:inline">
                {userSession ? userSession.name.split(' ')[0] : 'Login'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setBagOpen(true)}
              aria-label={`Shopping bag, ${totalBagCount} ${totalBagCount === 1 ? 'item' : 'items'}`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#191919] transition-colors hover:bg-[#191919]/6 focus-visible:outline-2 focus-visible:outline-[#191919]"
            >
              <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.6} />
              {totalBagCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#BB080B] px-1 text-[9px] font-semibold tabular-nums text-white">
                  {totalBagCount}
                </span>
              )}
            </button>
          </div>
        </header>
      )}

      {/* Interactive 3D-Perspective Virtual Gallery Room */}
      <VirtualRoom
        activeTab={activeTab}
        ageFilter={ageFilter}
        shoesFullscreen={shoesFullscreen}
        onSelectTab={handleSelectTab}
        onSelectProduct={setSelectedProduct}
      />

      {/* Persistent Gliding Brand Logo: starts dead-center on Home and glides smoothly upward into header on section enter */}
      <AnimatePresence>
        {!hideStoreHeader && (
          <motion.button
            key="bunto-gliding-logo"
            type="button"
            onClick={() => {
              if (!isHome) handleSelectTab('store');
            }}
            aria-label={isHome ? 'BUNTO Virtual Store' : 'Return to Home'}
            tabIndex={isHome ? -1 : 0}
            initial={false}
            animate={{
              y: isHome ? homeCenterOffsetY : 0,
              opacity: 1,
            }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            transition={logoTransition}
            style={{ willChange: 'transform' }}
            className={`fixed left-1/2 top-4 z-40 flex h-11 w-48 -translate-x-1/2 flex-col items-center justify-center overflow-visible text-center select-none sm:top-5 focus-visible:outline-2 focus-visible:outline-[#191919] ${
              isHome ? 'pointer-events-none cursor-default' : 'pointer-events-auto cursor-pointer'
            }`}
          >
            <motion.svg
              viewBox="0 0 60 18"
              animate={{
                y: isHome ? -46 : -15,
                scale: isHome ? 1 : 0.42,
              }}
              transition={logoTransition}
              className="absolute h-9 w-24 text-[#191919]"
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
            </motion.svg>

            <motion.span
              animate={{
                y: isHome ? 4 : -1,
                scale: isHome ? 1 : 0.25,
              }}
              transition={logoTransition}
              className="absolute whitespace-nowrap text-[44px] font-extrabold italic tracking-tight text-[#191919] leading-none sm:text-[62px]"
            >
              BUNTO<sup className="ml-0.5 text-[0.34em] font-bold not-italic text-[#BB080B]">°</sup>
            </motion.span>

            <motion.span
              animate={{
                y: isHome ? 44 : 14,
                scale: isHome ? 1 : 0.72,
                color: isHome ? 'rgba(25, 25, 25, 0.72)' : 'rgba(106, 102, 96, 1)',
              }}
              transition={logoTransition}
              className="absolute whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.28em] sm:text-[11px] sm:tracking-[0.38em]"
            >
              Virtual Store
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Full-Screen Showcase Toggle Button on Shoes Wall */}
      <AnimatePresence>
        {!loginOpen && activeTab === 'shoes' && !selectedProduct && (
          <motion.button
            key="shoes-fullscreen-btn"
            type="button"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={handleToggleShoesFullscreen}
            aria-label={shoesFullscreen ? 'Exit full screen showcase' : 'View shoes showcase in full screen'}
            className={`fixed z-40 inline-flex items-center gap-2 rounded-full border border-[#C9C5BE] bg-[#F0EDE8]/95 px-3 py-1.5 text-xs font-semibold text-[#191919] shadow-md backdrop-blur-md transition-all hover:bg-[#F0EDE8] sm:px-3.5 sm:py-2 focus-visible:outline-2 focus-visible:outline-[#191919] ${
              shoesFullscreen ? 'right-4 top-4 sm:right-6 sm:top-5' : 'right-4 top-16 sm:top-auto sm:right-8 sm:bottom-7'
            }`}
          >
            {shoesFullscreen ? (
              <>
                <Minimize2 className="h-3.5 w-3.5" />
                <span>Exit Full Screen</span>
              </>
            ) : (
              <>
                <Maximize2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Full Screen</span>
              </>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Split-Screen Editorial Login View */}
      <AnimatePresence>
        {loginOpen && (
          <LoginPage
            user={userSession}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
            onNavigateStore={(tab) => handleSelectTab(tab ?? 'store')}
          />
        )}
      </AnimatePresence>

      {/* Product Detail Focus Overlay (50/50 Split Card) */}
      <ProductDetailOverlay
        product={selectedProduct}
        categoryProducts={categoryProducts}
        bagCount={totalBagCount}
        onClose={() => setSelectedProduct(null)}
        onSelectProduct={setSelectedProduct}
        onSelectTab={handleSelectTab}
        onOpenBag={() => setBagOpen(true)}
        onAddToBag={handleAddToBag}
      />

      {/* Floating Bottom Pill Navbar (hidden on Login page, full-screen shoe showcase, or split product card) */}
      {!hideDock && (
        <BottomDock
          activeTab={activeTab}
          isLoginOpen={loginOpen}
          onSelectTab={handleSelectTab}
          ageFilter={ageFilter}
          onSelectAgeFilter={setAgeFilter}
        />
      )}

      {/* Slide-over Shopping Bag Drawer */}
      <BagDrawer
        isOpen={bagOpen}
        onClose={() => setBagOpen(false)}
        entries={bagEntries}
        onUpdateQty={handleUpdateQty}
        onRemoveEntry={handleRemoveEntry}
        onClearBag={() => setBagEntries([])}
      />
    </main>
  );
}
