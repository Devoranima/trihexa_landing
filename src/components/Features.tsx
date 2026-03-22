import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* data */
const features = [
  {
    icon: (
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="group-hover:scale-110 transition-transform duration-500"
      >
        <path
          d="M36.8203 10.2881V29.7109L20 39.4229L3.17969 29.7109V10.2881L20 0.576172L36.8203 10.2881Z"
          className="stroke-th-dark group-hover:stroke-th-red transition-all duration-500"
        />
        <path
          d="M20 8L30.3923 14V26L20 32L9.6077 26V14L20 8Z"
          className="fill-th-dark group-hover:fill-th-red transition-all duration-500"
          fillOpacity="0.3"
        />
        <path
          d="M20 16L23.4641 18V22L20 24L16.5359 22V18L20 16Z"
          className="fill-th-dark group-hover:fill-th-red transition-all duration-500"
        />
      </svg>
    ),
    title: "Нескользящая основа",
    detail:
      "Рельефная структура TPE надёжно фиксирует коврик на любом покрытии — плитка, ламинат, бетон.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        fill="none"
        viewBox="0 0 40 40"
        className="group-hover:scale-110 transition-transform duration-500"
      >
        <path
          className="fill-th-dark group-hover:fill-th-red transition-all duration-500"
          d="M11.667 28.333V15H8.334v-3.333H15v16.666zm6.667 0V25h3.333v3.333zm8.333 0V15h-3.334v-3.333H30v16.666zm-8.333-6.666v-3.334h3.333v3.334z"
        />
      </svg>
    ),
    title: "Точная форма",
    detail:
      "Вакуумная формовка по пресс-формам повторяет контуры вашего автомобиля или помещения. Без зазоров, без перехлёстов.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        fill="none"
        viewBox="0 0 40 40"
        className="group-hover:scale-110 transition-transform duration-500"
      >
        <path
          className="fill-th-dark group-hover:fill-th-red transition-all duration-500"
          d="M21.083 3.733a1.67 1.67 0 0 0-2.168.002l-.148.128a56.669 56.669 0 0 0-5.887 6.12c-1.504 1.824-3.039 3.955-4.203 6.204-1.159 2.233-2.01 4.693-2.01 7.146a13.333 13.333 0 1 0 26.666 0c0-2.453-.852-4.913-2.01-7.146-1.166-2.25-2.7-4.38-4.203-6.205a57 57 0 0 0-5.498-5.77l-.537-.477zM10 23.333c0-1.713.607-3.628 1.635-5.613 1.023-1.97 2.405-3.902 3.816-5.618A53 53 0 0 1 20 7.25a53 53 0 0 1 4.547 4.848c1.413 1.717 2.794 3.65 3.816 5.62 1.03 1.985 1.637 3.9 1.637 5.614a10 10 0 1 1-20 0z"
        />
        <path
          className="fill-th-dark group-hover:fill-th-red transition-all duration-500"
          d="M13.933 23.403a1.667 1.667 0 0 0-1.123 2.072 7.52 7.52 0 0 0 5.048 5.048 1.666 1.666 0 1 0 .95-3.195 4.18 4.18 0 0 1-2.803-2.803 1.666 1.666 0 0 0-2.072-1.122"
        />
      </svg>
    ),
    title: "Стойкость к погоде",
    detail:
      "UV-стабильные компаунды не выгорают, не трескаются и не деформируются от жары и мороза.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        fill="none"
        viewBox="0 0 40 40"
        className="group-hover:scale-110 transition-transform duration-500"
      >
        <path
          className="fill-th-dark group-hover:fill-th-red transition-all duration-500"
          d="M8.333 38.333a3.2 3.2 0 0 1-2.353-.978A3.22 3.22 0 0 1 5 35v-8.333q0-3.458 2.438-5.895t5.895-2.439H15V5q0-1.375.98-2.353a3.22 3.22 0 0 1 2.353-.98h3.334q1.374 0 2.355.98T25 5v13.333h1.667q3.457 0 5.896 2.439T35 26.667V35q0 1.376-.978 2.355a3.2 3.2 0 0 1-2.355.978zm0-3.333h3.334v-5q0-.708.48-1.187t1.186-.48a1.6 1.6 0 0 1 1.189.48q.48.482.478 1.187v5h3.333v-5q0-.708.48-1.187t1.187-.48q.706 0 1.188.48.481.482.479 1.187v5H25v-5q0-.708.48-1.187t1.187-.48q.706 0 1.188.48.481.482.478 1.187v5h3.334v-8.333q0-2.085-1.459-3.542-1.458-1.458-3.541-1.458H13.333q-2.084 0-3.541 1.458-1.46 1.458-1.459 3.542z"
        />
      </svg>
    ),
    title: "Лёгкая чистка",
    detail:
      "Структура ячеек отталкивает воду, грязь и шерсть. Промыл — и готово.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        fill="none"
        viewBox="0 0 40 40"
        className="group-hover:scale-110 transition-transform duration-500"
      >
        <path
          className="fill-th-dark group-hover:fill-th-red transition-all duration-500"
          fillRule="evenodd"
          d="M20 35a15 15 0 1 0 0-30.002A15 15 0 0 0 20 35m-.387-8.933 8.334-10-2.56-2.134-7.167 8.599-3.708-3.71-2.357 2.356 5 5 1.29 1.29z"
          clipRule="evenodd"
        />
      </svg>
    ),
    title: "Контроль качества",
    detail:
      "Каждая партия проходит многоступенчатую проверку перед отправкой с производства.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        fill="none"
        viewBox="0 0 40 40"
        className="group-hover:scale-110 transition-transform duration-500"
      >
        <path
          className="fill-th-dark group-hover:fill-th-red transition-all duration-500"
          d="M31.667 5H8.333A3.343 3.343 0 0 0 5 8.333v23.334C5 33.5 6.5 35 8.333 35h23.334C33.5 35 35 33.5 35 31.667V8.333C35 6.5 33.5 5 31.667 5m-3.334 26.667V13.333c0-.916-.75-1.666-1.666-1.666H8.333V8.333h23.334v23.334z"
        />
      </svg>
    ),
    title: "Под любой размер",
    detail:
      "Изготовим нестандартные размеры для спецтехники, промышленных зон и нетиповых планировок.",
  },
];

const year = new Date().getFullYear();

const stats = [
  { value: 3, unit: "", label: "Линейки продукции" },
  { value: 100, unit: "+", label: "Видов ковриков" },
  { value: (year-2016), unit: "", label: "Лет на рынке" },
  { value: 100, unit: "%", label: "Качество" },
];

/* counter hook */
function useCounter(target: number, trigger: Element | null) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!ref.current || !trigger) return;
    const scroller = document.getElementById('scroller')!;
    const obj = { val: 0 };
    const anim = gsap.to(obj, {
      val: target,
      duration: 2.5,
      ease: "power2.out",
      onUpdate: () => {
        if (ref.current)
          ref.current.textContent = Math.round(obj.val).toString();
      },
      scrollTrigger: { trigger, start: "top 75%", once: true, scroller },
    });
    return () => {
      anim.kill();
    };
  }, [target, trigger]);
  return ref;
}

function Stat({ value, unit, label }: (typeof stats)[number]) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const numRef = useCounter(value, wrapRef.current);

  return (
    <div ref={wrapRef} className="text-center">
      <div
        className="font-display text-th-navy"
        style={{ fontSize: "clamp(3rem, 5vw, 5.5rem)", lineHeight: 1 }}
      >
        <span ref={numRef}>{value}</span>
        <span className="text-th-red">{unit}</span>
      </div>
      <div className="text-th-navy text-[0.6rem] tracking-[0.4em] uppercase mt-2">
        {label}
      </div>
    </div>
  );
}

function Feature({ feature }: { feature: (typeof features)[number] }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{
    
    function basicHandleMouseMove(e: any) {
      //Store card so we can use the shorthand
      const card = cardRef.current;
      if (!card) return;
      //Cards height and width
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    }

    cardRef.current?.addEventListener("mousemove", basicHandleMouseMove);

    return ()=>{
      cardRef.current?.removeEventListener("mouseover", basicHandleMouseMove);
    }

  }, [])

  return (
    <div
      className="feature_card relative group w-full h-full p-[2px] bg-th-light"
      ref={cardRef}
      key={feature.title}
    >
      <div
        className="z-2 p-4 h-full w-full bg-th-white rounded-[inherit]"
      >
        <div className="mb-6 transition-transform duration-300">
          <div className="relative w-fit h-fit">
            {feature.icon}
            {/* <div className="hex_bg absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 w-[60px] -z-10 bg-transparent group-hover:bg-th-red transition-all duration-500"></div> */}
          </div>
        </div>
        <h3 className="text-th-navy font-semibold tracking-wide mb-3 text-base">
          {feature.title}
        </h3>
        <p className="text-th-navy/60 text-sm leading-relaxed">{feature.detail}</p>
      </div>
    </div>
  );
}

/* main component */
export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = document.getElementById('scroller')!;
    const ctx = gsap.context(() => {
      /* header */
      gsap.fromTo(
        headerRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: headerRef.current, start: "top 80%", scroller },
        },
      );

      /* stats row */
      gsap.fromTo(
        Array.from(statsRef.current?.children ?? []),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: statsRef.current, start: "top 78%", scroller },
        },
      );

      /* feature cards */
      gsap.fromTo(
        Array.from(cardsRef.current?.children ?? []),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.65,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: cardsRef.current, start: "top 75%", scroller },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="bg-th-light relative overflow-hidden"
    >
      {/* subtle grid */}
      <div className="absolute inset-0 grid-pattern opacity-5" />
      <div className="absolute inset-0 bg-gradient-to-t from-th-light to-th-light/0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 py-28">
        {/* header */}
        <div ref={headerRef} className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <span className="block w-10 h-px bg-th-red" />
            <span className="text-th-red text-[0.6rem] tracking-[0.45em] uppercase font-semibold">
              Почему TriHexa
            </span>
          </div>
          <h2
            className="font-display text-th-dark leading-none mb-5"
            style={{ fontSize: "clamp(2.5rem, 5vw, 5rem)" }}
          >
            СДЕЛАНО <span className="text-th-red">НАДОЛГО</span>
          </h2>
          <p className="text-th-dark/80 text-sm max-w-[50ch] leading-relaxed">
            Каждый коврик TRiHEXA — TPE-полимер, сформованный вакуумом, литьём
            или вулканизацией для максимальной точности и долговечности.
          </p>
        </div>

        {/* stats */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20 py-12 border-y border-th-red/85"
        >
          {stats.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>

        {/* feature cards */}
        <div
          ref={cardsRef}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((f, i) => (
            <Feature feature={f} key={i}/>
          ))}
        </div>
      </div>
    </section>
  );
}
