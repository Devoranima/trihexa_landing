import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const INTEREST_OPTIONS = ['Автоковрики', 'Для дома', 'Гаражные системы', 'Индивидуальный заказ'] as const;

export default function Contact() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headingRef  = useRef<HTMLDivElement>(null);
  const leftRef     = useRef<HTMLDivElement>(null);
  const rightRef    = useRef<HTMLDivElement>(null);
  const [interest, setInterest] = useState<string>('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(headingRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 80%' } });

      gsap.fromTo(leftRef.current,
        { x: -70, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: leftRef.current, start: 'top 75%' } });

      gsap.fromTo(rightRef.current,
        { x: 70, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: rightRef.current, start: 'top 75%' } });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError(null);

    const form = e.target as HTMLFormElement;
    const formData = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      interest,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch('/api/mail.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.ok) {
        setSent(true);
      } else {
        setError(data.errors?.join(', ') || data.error || 'Ошибка отправки');
      }
    } catch {
      setError('Не удалось отправить сообщение. Проверьте соединение.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden bg-th-dark"
    >
      {/* background elements */}
      <div className="absolute inset-0 hex-pattern opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-br from-th-dark via-th-dark/95 to-[#0a0a0b]" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-th-red/50 to-transparent" />

      {/* large background text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <span
          className="font-display text-[30vw] text-th-red/[0.025] leading-none"
          style={{ whiteSpace: 'nowrap' }}
        >
          КОНТАКТЫ
        </span>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-28 lg:py-36">

        {/* section header */}
        <div ref={headingRef} className="mb-16 lg:mb-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="block w-10 h-px bg-th-red" />
            <span className="text-th-light/50 text-[0.6rem] tracking-[0.45em] uppercase font-semibold">
              Свяжитесь с нами
            </span>
          </div>
          <h2
            className="font-display text-th-white leading-none mb-4"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)' }}
          >
            ГОТОВЫ <span className="text-th-red">ОСНАСТИТЬ</span>
          </h2>
          <h2
            className="font-display leading-none"
            style={{ fontSize: 'clamp(3rem, 8vw, 7rem)', color: 'rgba(244,244,244,0.55)' }}
          >
            ВАШЕ ПРОСТРАНСТВО?
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">

          {/* left: contact info */}
          <div ref={leftRef} className="space-y-10">
            <p className="text-th-light/50 text-base leading-relaxed max-w-[40ch]">
              Нужен один коврик или комплект на весь автопарк — мы подберём
              идеальное решение под ваши задачи.
            </p>

            <div className="space-y-6">
              {[
                {
                  label: 'Почта',
                  value: 'ceo@trihexapro.ru',
                  href:  'mailto:ceo@trihexapro.ru',
                  icon:  (
                    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 shrink-0">
                      <rect x="2" y="5" width="16" height="12" rx="1" stroke="#A80000" strokeWidth="1.3" />
                      <path d="M2 7l8 5 8-5" stroke="#A80000" strokeWidth="1.3" />
                    </svg>
                  ),
                },
                {
                  label: 'Телефон',
                  value: '+7 (906) 328-33-28',
                  href:  'tel:+79063283328',
                  icon:  (
                    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 shrink-0">
                      <path d="M4 3h4l2 4-2 2c1 2 3 4 5 5l2-2 4 2v4c0 1-1 2-2 2C7 19 1 13 1 5c0-1 1-2 2-2h1z"
                            stroke="#A80000" strokeWidth="1.3" strokeLinejoin="round" />
                    </svg>
                  ),
                },
                {
                  label: 'Расположение',
                  value: 'Доставка по всей России',
                  href:  undefined,
                  icon:  (
                    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 shrink-0">
                      <path d="M10 2C7.2 2 5 4.2 5 7c0 4.5 5 11 5 11s5-6.5 5-11c0-2.8-2.2-5-5-5z"
                            stroke="#A80000" strokeWidth="1.3" />
                      <circle cx="10" cy="7" r="2" stroke="#A80000" strokeWidth="1" />
                    </svg>
                  ),
                },
              ].map(c => (
                <div key={c.label} className="flex items-center gap-4 group">
                  {c.icon}
                  <div>
                    <div className="text-th-light/30 text-[0.6rem] tracking-[0.35em] uppercase mb-1">{c.label}</div>
                    {c.href ? (
                      <a
                        href={c.href}
                        className="text-th-light hover:text-th-red transition-colors duration-200 text-sm font-medium"
                      >
                        {c.value}
                      </a>
                    ) : (
                      <span className="text-th-light text-sm font-medium">{c.value}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* social row */}
            {/* <div className="pt-6 border-t border-th-white/8">
              <div className="text-th-light/25 text-[0.6rem] tracking-[0.4em] uppercase mb-4">Мы в соцсетях</div>
              <div className="flex gap-4">
                {['Telegram', 'WhatsApp', 'Instagram'].map(s => (
                  <a
                    key={s}
                    href="#"
                    className="text-[0.65rem] tracking-[0.3em] uppercase text-th-light/35 hover:text-th-red transition-colors duration-200"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div> */}
          </div>

          {/* right: contact form */}
          <div ref={rightRef}>
            {sent ? (
              <div className="h-full flex flex-col items-start justify-center gap-4 py-16">
                <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
                  <circle cx="24" cy="24" r="20" stroke="#A80000" strokeWidth="1.5" />
                  <path d="M14 24l7 7 13-14" stroke="#A80000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <h3 className="font-display text-th-white text-4xl tracking-widest">СООБЩЕНИЕ ОТПРАВЛЕНО</h3>
                <p className="text-th-light/40 text-sm">Мы свяжемся с вами в течение одного рабочего дня.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* name + email row */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { id: 'name', label: 'Имя', type: 'text', placeholder: 'Иван Иванов' },
                    { id: 'email', label: 'Электронная почта', type: 'email', placeholder: 'ivan@example.com' },
                  ].map(f => (
                    <div key={f.id}>
                      <label htmlFor={f.id} className="block text-th-light/40 text-[0.6rem] tracking-[0.4em] uppercase mb-2">
                        {f.label}
                      </label>
                      <input
                        id={f.id}
                        type={f.type}
                        placeholder={f.placeholder}
                        required
                        className="w-full bg-th-white/4 border border-th-white/10 text-th-dark text-sm px-4 py-3 placeholder-th-light/20 focus:border-th-red/60 focus:outline-none transition-colors duration-200"
                      />
                    </div>
                  ))}
                </div>

                {/* interest chips */}
                <div>
                  <div className="text-th-light/40 text-[0.6rem] tracking-[0.4em] uppercase mb-3">
                    Меня интересует
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {INTEREST_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setInterest(opt)}
                        className={`px-4 py-2 text-[0.65rem] tracking-[0.25em] uppercase border transition-all duration-200 ${
                          interest === opt
                            ? 'border-th-red bg-th-red/15 text-th-light'
                            : 'border-th-white/12 text-th-light/40 hover:border-th-red/40 hover:text-th-light/70'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* message */}
                <div>
                  <label htmlFor="message" className="block text-th-light/40 text-[0.6rem] tracking-[0.4em] uppercase mb-2">
                    Сообщение
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Расскажите о вашем проекте или требованиях…"
                    required
                    className="w-full bg-th-white/4 border border-th-white/10 text-th-dark text-sm px-4 py-3 placeholder-th-light/20 focus:border-th-red/60 focus:outline-none transition-colors duration-200 resize-none"
                  />
                </div>

                {error && (
                  <div className="text-[#f06060] text-sm py-2">{error}</div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  className="mag-btn relative w-full py-4 bg-th-red text-white text-[0.7rem] tracking-[0.35em] uppercase font-semibold hover:bg-[#8a0000] transition-colors duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? 'Отправка...' : 'Отправить'}
                  {!sending && (
                    <svg viewBox="0 0 20 20" fill="none" className="w-6 h-6 absolute right-2 top-1/2 -translate-y-1/2">
                      <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
