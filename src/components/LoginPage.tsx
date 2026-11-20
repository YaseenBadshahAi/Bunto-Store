import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LogOut,
  Mail,
  Sparkles,
  X,
} from 'lucide-react';
import { StoreCategory } from '../data/storeCatalog';

export interface StoreUserSession {
  name: string;
  email: string;
  provider: 'email' | 'google';
}

interface LoginPageProps {
  user: StoreUserSession | null;
  onLoginSuccess: (session: StoreUserSession, remember: boolean) => void;
  onLogout: () => void;
  onNavigateStore: (tab?: StoreCategory) => void;
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.55-.2-2.27H12v4.51h6.47a5.54 5.54 0 0 1-2.4 3.63v3.01h3.88c2.27-2.09 3.54-5.17 3.54-8.88Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.91l-3.88-3.01c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.26v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.37-2.28v-3.1H1.26A12 12 0 0 0 0 12c0 1.94.46 3.77 1.26 5.38l4.01-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.76c1.76 0 3.34.61 4.59 1.8l3.44-3.44C17.95 1.19 15.23 0 12 0A12 12 0 0 0 1.26 6.62l4.01 3.1c.95-2.85 3.6-4.96 6.73-4.96Z"
      />
    </svg>
  );
}

export function LoginPage({
  user,
  onLoginSuccess,
  onLogout,
  onNavigateStore,
}: LoginPageProps) {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [googlePromptOpen, setGooglePromptOpen] = useState(false);
  const [googleEmail, setGoogleEmail] = useState('');
  const [formNotice, setFormNotice] = useState<{ type: 'error' | 'info'; text: string } | null>(null);
  const [legalModal, setLegalModal] = useState<'terms' | 'privacy' | 'about' | null>(null);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setFormNotice({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }
    if (password.length < 6) {
      setFormNotice({ type: 'error', text: 'Password must be at least 6 characters.' });
      return;
    }
    const derivedName =
      authMode === 'signup' && fullName.trim()
        ? fullName.trim()
        : trimmedEmail.split('@')[0].replace(/[._-]+/g, ' ');
    setFormNotice(null);
    onLoginSuccess(
      {
        name: derivedName.replace(/\b\w/g, (c) => c.toUpperCase()),
        email: trimmedEmail,
        provider: 'email',
      },
      rememberMe
    );
  };

  const handleGoogleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = googleEmail.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setFormNotice({ type: 'error', text: 'Enter your Google email address to continue.' });
      return;
    }
    const derivedName = trimmed.split('@')[0].replace(/[._-]+/g, ' ');
    setFormNotice(null);
    setGooglePromptOpen(false);
    onLoginSuccess(
      {
        name: derivedName.replace(/\b\w/g, (c) => c.toUpperCase()),
        email: trimmed,
        provider: 'google',
      },
      true
    );
  };

  const handleForgotPassword = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setFormNotice({
        type: 'info',
        text: 'Enter your email address above first to receive a reset link.',
      });
      return;
    }
    setFormNotice({
      type: 'info',
      text: `Password recovery link prepared for ${trimmedEmail}.`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-30 flex flex-col justify-between overflow-x-hidden overflow-y-auto bg-[#F0EDE8] px-6 py-5 text-[#191919] sm:px-10 sm:py-7"
    >
      {/* Top Header */}
      <header className="flex w-full items-center justify-between">
        <button
          type="button"
          onClick={() => onNavigateStore('store')}
          aria-label="Return to BUNTO store"
          className="inline-flex items-center gap-2.5 text-left transition-opacity hover:opacity-75 focus-visible:outline-2 focus-visible:outline-[#191919]"
        >
          <ArrowLeft className="h-4 w-4 text-[#191919]" strokeWidth={2} />
          <svg viewBox="0 0 60 18" className="h-3.5 w-8 text-[#191919]" fill="none" aria-hidden="true">
            <path
              d="M6 16L22 3.5L31 10.5L41 2.5L54 16"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-base font-extrabold italic tracking-tight text-[#191919]">
            BUNTO<sup className="ml-0.5 text-[0.5em] not-italic text-[#BB080B]">°</sup>
          </span>
        </button>

        <div className="flex items-center gap-4 sm:gap-6">
          <nav aria-label="Quick store links" className="hidden items-center gap-5 sm:flex">
            <button
              type="button"
              onClick={() => onNavigateStore('clothing')}
              className="text-xs font-medium text-[#6A6660] transition-colors hover:text-[#191919]"
            >
              Our Product
            </button>
            <button
              type="button"
              onClick={() => onNavigateStore('store')}
              className="text-xs font-medium text-[#6A6660] transition-colors hover:text-[#191919]"
            >
              Store
            </button>
            <button
              type="button"
              onClick={() => setLegalModal('about')}
              className="text-xs font-medium text-[#6A6660] transition-colors hover:text-[#191919]"
            >
              About
            </button>
          </nav>

          <button
            type="button"
            onClick={() => onNavigateStore('store')}
            className="rounded-full border border-[#C9C5BE] bg-[#E8E5DF] px-4 py-1.5 text-xs font-semibold text-[#191919] transition-colors hover:border-[#191919] hover:bg-[#191919] hover:text-[#F0EDE8]"
          >
            Back to Store
          </button>
        </div>
      </header>

      {/* Center Auth Form Card */}
      <div className="mx-auto my-8 w-full max-w-[400px]">
        {user ? (
          <div className="rounded-2xl border border-[#C9C5BE] bg-[#E8E5DF]/70 p-6 shadow-[0_14px_34px_rgba(25,25,25,0.06)]">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#191919] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F0EDE8]">
              <Check className="h-3 w-3 text-[#BB080B]" strokeWidth={2.8} />
              <span>Signed in via {user.provider === 'google' ? 'Google' : 'Email'}</span>
            </div>
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-[#191919]">
              Welcome back, {user.name}
            </h1>
            <p className="mt-1 text-sm text-[#6A6660]">{user.email}</p>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => onNavigateStore('store')}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#BB080B] text-sm font-semibold text-white shadow-[0_10px_24px_rgba(187,8,11,0.24)] transition-colors hover:bg-[#990609]"
              >
                <span>Continue to Store</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#C9C5BE] bg-[#F0EDE8] text-sm font-semibold text-[#191919] transition-colors hover:border-[#191919]"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-[#C9C5BE]/80 bg-[#E8E5DF]/40 p-6 shadow-[0_16px_40px_rgba(25,25,25,0.05)] sm:p-8">
            <h1 className="text-[28px] font-bold tracking-tight text-[#191919] sm:text-[32px]">
              {authMode === 'login' ? 'Welcome to BUNTO°' : 'Join BUNTO°'}
            </h1>
            <p className="mt-1.5 text-sm text-[#6A6660]">
              {authMode === 'login'
                ? 'Experience the new wardrobe built for everyday essentials.'
                : 'Create your member profile with email or Google.'}
            </p>

            <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label
                    htmlFor="bunto-fullname"
                    className="block text-xs font-semibold text-[#191919]"
                  >
                    Full Name
                  </label>
                  <input
                    id="bunto-fullname"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Mercer"
                    className="mt-1.5 h-11 w-full rounded-lg border border-[#C9C5BE] bg-[#F0EDE8] px-3.5 text-sm text-[#191919] placeholder:text-[#6A6660]/70 transition-colors focus:border-[#BB080B] focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="bunto-email"
                  className="block text-xs font-semibold text-[#191919]"
                >
                  Email
                </label>
                <input
                  id="bunto-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="mt-1.5 h-11 w-full rounded-lg border border-[#C9C5BE] bg-[#F0EDE8] px-3.5 text-sm text-[#191919] placeholder:text-[#6A6660]/70 transition-colors focus:border-[#BB080B] focus:outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="bunto-password"
                  className="block text-xs font-semibold text-[#191919]"
                >
                  Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="bunto-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="enter your password"
                    className="h-11 w-full rounded-lg border border-[#C9C5BE] bg-[#F0EDE8] pr-10 pl-3.5 text-sm text-[#191919] placeholder:text-[#6A6660]/70 transition-colors focus:border-[#BB080B] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#6A6660] transition-colors hover:text-[#191919]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-0.5 text-xs">
                <label className="inline-flex cursor-pointer items-center gap-2 text-[#191919]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-[#C9C5BE] accent-[#BB080B]"
                  />
                  <span className="font-medium">Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="font-semibold text-[#191919] transition-colors hover:text-[#BB080B]"
                >
                  Forgot Password?
                </button>
              </div>

              {formNotice && (
                <p
                  className={`rounded-lg border px-3 py-2 text-xs font-medium ${
                    formNotice.type === 'error'
                      ? 'border-[#BB080B]/35 bg-[#BB080B]/8 text-[#BB080B]'
                      : 'border-[#C9C5BE] bg-[#F0EDE8] text-[#191919]'
                  }`}
                >
                  {formNotice.text}
                </p>
              )}

              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#BB080B] text-sm font-semibold text-white shadow-[0_10px_24px_rgba(187,8,11,0.22)] transition-colors hover:bg-[#990609] focus-visible:outline-2 focus-visible:outline-[#191919]"
              >
                <Mail className="h-4 w-4" />
                <span>{authMode === 'login' ? 'Log in with Email' : 'Create Email Account'}</span>
              </button>
            </form>

            {/* Google Sign-In Button + Inline Email Step */}
            <div className="mt-3">
              {!googlePromptOpen ? (
                <button
                  type="button"
                  onClick={() => {
                    setFormNotice(null);
                    setGooglePromptOpen(true);
                  }}
                  className="flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-[#C9C5BE] bg-[#F0EDE8] text-sm font-semibold text-[#191919] transition-colors hover:border-[#191919] hover:bg-[#E8E5DF] focus-visible:outline-2 focus-visible:outline-[#191919]"
                >
                  <GoogleGlyph />
                  <span>Login with Google</span>
                </button>
              ) : (
                <form
                  onSubmit={handleGoogleContinue}
                  className="rounded-xl border border-[#C9C5BE] bg-[#F0EDE8] p-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#191919]">
                      <GoogleGlyph />
                      Continue with Google
                    </span>
                    <button
                      type="button"
                      onClick={() => setGooglePromptOpen(false)}
                      aria-label="Cancel Google login"
                      className="rounded p-0.5 text-[#6A6660] hover:text-[#191919]"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <input
                      type="email"
                      value={googleEmail}
                      onChange={(e) => setGoogleEmail(e.target.value)}
                      placeholder="your.name@gmail.com"
                      className="h-9 flex-1 rounded-md border border-[#C9C5BE] bg-[#E8E5DF]/50 px-2.5 text-xs text-[#191919] focus:border-[#191919] focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="rounded-md bg-[#191919] px-3 text-xs font-semibold text-[#F0EDE8] transition-colors hover:bg-[#BB080B]"
                    >
                      Continue
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="mt-4 text-center text-xs text-[#6A6660]">
              {authMode === 'login' ? (
                <>
                  New to BUNTO°?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setFormNotice(null);
                      setAuthMode('signup');
                    }}
                    className="font-semibold text-[#191919] underline underline-offset-4 hover:text-[#BB080B]"
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setFormNotice(null);
                      setAuthMode('login');
                    }}
                    className="font-semibold text-[#191919] underline underline-offset-4 hover:text-[#BB080B]"
                  >
                    Log in
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Contact & Legal Footer */}
      <footer className="flex flex-col items-center justify-center gap-2 text-[11px] font-medium text-[#6A6660]">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-[#191919]"
          >
            Instagram
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-[#191919]"
          >
            Facebook
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="mailto:hello@buntostudio.com"
            className="transition-colors hover:text-[#BB080B]"
          >
            hello@buntostudio.com
          </a>
        </div>
        <div className="flex items-center gap-2 text-[#6A6660]/80">
          <button
            type="button"
            onClick={() => setLegalModal('terms')}
            className="transition-colors hover:text-[#191919]"
          >
            Terms &amp; Conditions
          </button>
          <span aria-hidden="true">•</span>
          <button
            type="button"
            onClick={() => setLegalModal('privacy')}
            className="transition-colors hover:text-[#191919]"
          >
            Privacy Policy
          </button>
        </div>
      </footer>

      {/* Lightweight Info Sheet for Terms / Privacy / About */}
      <AnimatePresence>
        {legalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#191919]/45 p-4 backdrop-blur-xs"
            onClick={() => setLegalModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-[#C9C5BE] bg-[#F0EDE8] p-6 text-[#191919] shadow-2xl"
            >
              <div className="flex items-center justify-between border-b border-[#C9C5BE] pb-3">
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em]">
                  <Sparkles className="h-3.5 w-3.5 text-[#BB080B]" />
                  <span>
                    {legalModal === 'terms'
                      ? 'Terms & Conditions'
                      : legalModal === 'privacy'
                      ? 'Privacy Policy'
                      : 'About BUNTO°'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setLegalModal(null)}
                  aria-label="Close modal"
                  className="rounded-full p-1 text-[#6A6660] hover:bg-[#E8E5DF] hover:text-[#191919]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-[#6A6660]">
                {legalModal === 'terms'
                  ? 'All BUNTO° catalog drops, sizing guides, and virtual gallery showcases are curated for personal wardrobe exploration and in-store reservations.'
                  : legalModal === 'privacy'
                  ? 'Your member preferences and shopping bag are stored locally in your browser when Remember Me is enabled. No third-party tracking cookies are stored.'
                  : 'BUNTO° Virtual Store blends minimalist architectural galleries with GOTS-certified outerwear, branded headwear, artisan leather bags, and curated footwear.'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
