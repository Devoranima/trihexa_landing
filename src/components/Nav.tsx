import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const PRODUCT_LINKS = [
  {label: 'Автоковрики', href: '/car'},
  {label: 'Домашние коврики', href: '/home'},
  {label: 'Гаражные системы', href: '/garage'},
] as const;

const NAV_LINKS = [
  {label: 'Преимущества', href: '/#features'},
  {label: 'Контакты', href: '/#contact'},
] as const;

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* scroll listener */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
      setShowTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* close dropdown on click outside */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* mobile menu animation */
  useEffect(() => {
    const el = mobileRef.current;
    if (!el) return;
    if (menuOpen) {
      el.style.display = 'flex';
      gsap.fromTo(el,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' },
      );
    } else {
      gsap.to(el, {
        opacity: 0, y: -8, duration: 0.25, ease: 'power3.in',
        onComplete: () => { el.style.display = 'none'; },
      });
    }
  }, [menuOpen]);

  const close = () => {
    setMenuOpen(false); 
    setDropdownOpen(false);
  };

  /* shared link style */
  const linkCls = 'relative text-th-light/60 hover:text-th-white text-xs tracking-[0.3em] uppercase font-medium transition-colors duration-200 py-1';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 ${
          scrolled ? 'bg-th-dark/95 backdrop-blur-md border-b border-th-red/15' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">

          {/* logo */}
          <a href="/" className="flex items-center gap-3 group shrink-0">
            <img
              src="/ICON.svg"
              alt="TriHexa"
              className="w-9 h-9 transition-transform duration-300 group-hover:scale-110"
            />
            <span className="font-['Oswald'] font-medium text-[1.6rem] text-th-white tracking-[0.1em] leading-none">
              TRiHEXA
            </span>
          </a>

          {/* desktop nav */}
          <nav className="hidden md:flex items-center gap-10">

            {/* products + dropdown */}
            <div ref={dropdownRef} className="relative">
              <div className="flex items-center gap-1">
                <a href="/#products" className={`${linkCls} group`}>
                  Продукция
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-th-red group-hover:w-full transition-all duration-300 ease-out" />
                </a>
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  className="text-th-light/40 hover:text-th-white transition-colors duration-200 p-1"
                  aria-label="Показать продукцию"
                >
                  <svg
                    viewBox="0 0 12 12"
                    fill="none"
                    className={`w-2.5 h-2.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                  >
                    <path d="M2 4.5L6 8.5L10 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>

              {/* dropdown panel */}
              <div
                className={`absolute top-full left-0 mt-3 min-w-[200px] border border-th-white/8 bg-th-dark/95 backdrop-blur-md transition-all duration-200 ${
                  dropdownOpen
                    ? 'opacity-100 visible translate-y-0'
                    : 'opacity-0 invisible -translate-y-2'
                }`}
              >
                <div className="py-2">
                  {PRODUCT_LINKS.map(link => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setDropdownOpen(false)}
                      className="block px-5 py-2.5 text-[0.65rem] tracking-[0.2em] uppercase text-th-light/50 hover:text-th-white hover:bg-th-red/10 transition-all duration-150"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* other nav links */}
            {NAV_LINKS.map(link => (
              <a key={link.href} href={link.href} className={`${linkCls} group`}>
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-th-red group-hover:w-full transition-all duration-300 ease-out" />
              </a>
            ))}

            <a
              href="/#contact"
              className="ml-4 px-6 py-2.5 border border-th-red text-th-red hover:bg-th-red hover:text-white text-xs tracking-[0.25em] uppercase font-medium transition-all duration-300"
            >
              Заказать
            </a>
          </nav>

          {/* hamburger */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-2 shrink-0"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-px bg-th-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[6px]' : ''}`} />
            <span className={`block w-6 h-px bg-th-white transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-6 h-px bg-th-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[6px]' : ''}`} />
          </button>
        </div>

        {/* mobile menu */}
        <div
          ref={mobileRef}
          style={{ display: 'none' }}
          className="md:hidden flex-col gap-6 bg-th-dark/98 backdrop-blur-md border-t border-th-red/20 px-8 py-10"
        >
          {/* products parent + sub-links */}
          <a
            href="/#products"
            onClick={close}
            className="font-display text-4xl text-th-light hover:text-th-red tracking-widest transition-colors duration-200"
          >
            Продукция
          </a>
          <div className="pl-4 flex flex-col gap-3 border-l border-th-red/20">
            {PRODUCT_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={close}
                className="text-th-light/50 hover:text-th-red text-lg tracking-wide transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* other links */}
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={close}
              className="font-display text-4xl text-th-light hover:text-th-red tracking-widest transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/#contact"
            onClick={close}
            className="mt-2 inline-block px-8 py-4 bg-th-red text-white text-xs tracking-[0.3em] uppercase font-medium text-center"
          >
            Заказать
          </a>
        </div>
      </header>

      {/* scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-50 w-20 h-20 border border-th-red/40 bg-th-dark/80 backdrop-blur-sm text-th-red hover:bg-th-red hover:text-white flex items-center justify-center transition-all duration-300 ${
          showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
        aria-label="Наверх"
      >
        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4">
          <path d="M8 12V4M4 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </>
  );
}
