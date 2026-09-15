"use client";

import React, { useState, useEffect, useRef } from "react";
import { MotionFooter } from "@/components/ui/motion-footer";

interface ClickEffect {
  id: number;
  x: number;
  y: number;
}

interface SlideItem {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
}

const slides: SlideItem[] = [
  {
    id: 1,
    title: "طراحی وب‌سایت مدرن و ریسپانسیو",
    category: "Web Design & Development",
    description: "پیاده‌سازی سایت‌های فوق‌سریع، بهینه‌شده و منطبق با مدرن‌ترین الگوهای کاربری و استانداردهای جهانی.",
    image: "/services/web.jpg",
  },
  {
    id: 2,
    title: "طراحی و توسعه اپلیکیشن کاربردی",
    category: "Mobile Application",
    description: "توسعه نرم‌افزارهای روان، امن و اختصاصی با جدیدترین فریم‌ورک‌های روز دنیا متناسب با نیاز کسب‌وکار شما.",
    image: "/services/app.jpg",
  },
  {
    id: 3,
    title: "تولید تیزر تبلیغاتی و موشن گرافیک",
    category: "Motion & Graphic Design",
    description: "خلق هویت بصری، ویدیوهای انیمیشنی چشم‌نواز و تیزرهای داینامیک برای برندینگ و رشد فروش کسب‌وکار شما.",
    image: "/services/motion.jpg",
  },
  {
    id: 4,
    title: "ترجمه تخصصی و بومی‌سازی محتوا",
    category: "Professional Translation",
    description: "ترجمه دقیق و روان مقالات علمی، اسناد شرکتی و چندزبانه کردن پلتفرم‌ها به زبان‌های مختلف.",
    image: "/services/translate.jpg",
  },
];

export default function Home() {
  const [clicks, setClicks] = useState<ClickEffect[]>([]);
  const [edgeGlow, setEdgeGlow] = useState<"top" | "bottom" | null>(null);
  
  // مقیاس و جابه‌جایی واکنش‌گرای فلش نئونی با اسکرول
  const [arrowScale, setArrowScale] = useState(1);
  const [arrowTranslate, setArrowTranslate] = useState(0);
  
  const [currentSlide, setCurrentSlide] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; blast: number }>({
    x: -2000,
    y: -2000,
    blast: 1,
  });

  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());
  const glowTimeout = useRef<any>(null);

  // سیستم ذرات تعاملی پس‌زمینه
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const numParticles = Math.min(Math.floor((width * height) / 9000), 100);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseX: number;
      baseY: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.size = Math.random() * 2 + 1.5;
        this.color = Math.random() > 0.45 ? "99, 102, 241" : "34, 211, 238";
      }

      update() {
        this.baseX += this.vx;
        this.baseY += this.vy;

        if (this.baseX < 0 || this.baseX > width) this.vx *= -1;
        if (this.baseY < 0 || this.baseY > height) this.vy *= -1;

        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const effectiveRadius = 140 * mouseRef.current.blast;

        if (distance < effectiveRadius && distance > 0) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (effectiveRadius - distance) / effectiveRadius;
          const push = force * 24 * mouseRef.current.blast;

          this.x -= forceDirectionX * push;
          this.y -= forceDirectionY * push;
        } else {
          this.x += (this.baseX - this.x) * 0.05;
          this.y += (this.baseY - this.y) * 0.05;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${this.color})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgb(${this.color})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    const particles: Particle[] = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 125) {
            const alpha = (1 - dist / 125) * 0.4;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      if (mouseRef.current.blast > 1) {
        mouseRef.current.blast -= 0.06;
        if (mouseRef.current.blast < 1) mouseRef.current.blast = 1;
      }

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -2000;
      mouseRef.current.y = -2000;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const nextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // واکنش فیزیکی و تغییر اندازه فلش با اسکرول بالا و پایین
  useEffect(() => {
    let isScrolling: any;

    const handleScroll = () => {
      const now = Date.now();
      const currentScrollY = window.scrollY;
      const deltaTime = Math.max(now - lastTime.current, 10);
      const deltaY = currentScrollY - lastScrollY.current;
      const velocity = deltaY / deltaTime;

      // تغییر اندازه و کشیدگی فلش متناسب با سرعت و مقدار اسکرول
      const scaleValue = Math.min(1 + Math.abs(velocity) * 0.5, 1.8);
      const translateValue = Math.min(deltaY * 0.4, 25);
      
      setArrowScale(scaleValue);
      setArrowTranslate(translateValue);

      if (Math.abs(velocity) > 1.8) {
        const edge = velocity > 0 ? "bottom" : "top";
        setEdgeGlow(edge);

        if (glowTimeout.current) clearTimeout(glowTimeout.current);
        glowTimeout.current = setTimeout(() => {
          setEdgeGlow(null);
        }, 750);
      }

      lastScrollY.current = currentScrollY;
      lastTime.current = now;
    };

    const handleScrollEnd = () => {
      setArrowScale(1);
      setArrowTranslate(0);
    };

    const onScrollWithStop = () => {
      handleScroll();
      clearTimeout(isScrolling);
      isScrolling = setTimeout(handleScrollEnd, 140);
    };

    window.addEventListener("scroll", onScrollWithStop, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScrollWithStop);
      clearTimeout(isScrolling);
      if (glowTimeout.current) clearTimeout(glowTimeout.current);
    };
  }, []);

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    mouseRef.current.x = e.clientX;
    mouseRef.current.y = e.clientY;
    mouseRef.current.blast = 3.6;

    const newClick = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
    };
    setClicks((prev) => [...prev, newClick]);

    setTimeout(() => {
      setClicks((prev) => prev.filter((item) => item.id !== newClick.id));
    }, 800);
  };

  return (
    <div
      onClick={handlePageClick}
      className="relative min-h-screen bg-[#070709] text-white overflow-x-hidden select-none cursor-default"
      dir="rtl"
    >
      <canvas
        ref={canvasRef}
        className="pointer-events-none fixed inset-0 z-0 opacity-90"
      />

      {clicks.map((click) => (
        <span
          key={click.id}
          className="pointer-events-none fixed -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-500/50 via-purple-500/40 to-cyan-400/40 blur-2xl w-60 h-60 z-50 animate-ping"
          style={{
            left: `${click.x}px`,
            top: `${click.y}px`,
          }}
        />
      ))}

      <div
        className={`pointer-events-none fixed top-0 left-0 right-0 h-44 bg-gradient-to-b from-indigo-500/50 via-purple-600/20 to-transparent blur-3xl z-40 transition-opacity duration-700 ${
          edgeGlow === "top" ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`pointer-events-none fixed bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-cyan-400/40 via-indigo-600/30 to-transparent blur-3xl z-40 transition-opacity duration-700 ${
          edgeGlow === "bottom" ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* بخش هیرو */}
      <section className="relative z-10 min-h-[85vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[280px] bg-indigo-600/20 blur-[150px] rounded-full pointer-events-none" />

        <span className="inline-block py-1 px-4 mb-4 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs sm:text-sm font-medium tracking-wide backdrop-blur-sm">
          استودیوی خلاق و پرتفولیو
        </span>

        <h1 className="text-4xl sm:text-7xl font-black mb-4 tracking-tight text-white drop-shadow-md">
          محمدرضا خاکی
        </h1>

        <p className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-cyan-400 text-xl sm:text-2xl font-semibold mb-6">
          طراح سایت • دیزاینر رابط کاربری • گرافیست
        </p>

        <p className="text-neutral-400 text-sm sm:text-base max-w-lg mb-12 font-light leading-relaxed">
          ارائه‌دهنده راهکارهای نوآورانه دیجیتال، طراحی تجربیات وب مدرن و خلق جلوه‌های بصری پویا با بالاترین استانداردها.
        </p>

        {/* فلش مینیمال نئونی با قابلیت تغییر سایز داینامیک */}
        <div
          className="flex flex-col items-center gap-3 transition-transform duration-300 ease-out cursor-pointer"
          style={{
            transform: `translateY(${arrowTranslate}px) scale(${arrowScale})`,
          }}
          onClick={() => {
            window.scrollTo({ top: window.innerHeight * 0.85, behavior: "smooth" });
          }}
        >
          <span className="text-[11px] tracking-widest text-cyan-400/80 uppercase font-medium">
            مشاهده خدمات
          </span>

          {/* آیکون مینیمال با درخشش نئونی */}
          <div className="relative flex items-center justify-center py-2 animate-bounce">
            <svg
              className="w-7 h-7 text-cyan-400 filter drop-shadow-[0_0_12px_rgba(34,211,238,0.9)]"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
            
            {/* هاله نور پس‌زمینه فلش */}
            <div className="absolute w-8 h-8 bg-cyan-400/20 blur-lg rounded-full pointer-events-none" />
          </div>
        </div>
      </section>

      {/* اسلایدر مستطیلی استاندارد */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            خدمات و حوزه‌های فعالیت
          </h2>
        </div>

        {/* فریم مستطیلی اصلی */}
        <div className="relative w-full max-w-4xl min-h-[460px] mx-auto rounded-3xl border border-indigo-500/30 bg-neutral-950/85 backdrop-blur-xl shadow-[0_10px_40px_rgba(99,102,241,0.15)] flex flex-col items-center justify-between p-6 sm:p-10">
          
          {/* محفظه استیج تصاویر مستطیلی */}
          <div className="relative w-full h-64 sm:h-72 flex items-center justify-center overflow-hidden">
            {slides.map((slide, index) => {
              const isActive = index === currentSlide;
              const isPrev = index === (currentSlide - 1 + slides.length) % slides.length;
              const isNext = index === (currentSlide + 1) % slides.length;

              let positionStyle = "opacity-0 scale-75 pointer-events-none";
              if (isActive) {
                positionStyle = "opacity-100 scale-100 z-20 translate-x-0 shadow-[0_10px_35px_rgba(99,102,241,0.35)] border-cyan-400";
              } else if (isPrev) {
                positionStyle = "opacity-35 scale-85 z-10 translate-x-36 sm:translate-x-48 border-neutral-800 cursor-pointer";
              } else if (isNext) {
                positionStyle = "opacity-35 scale-85 z-10 -translate-x-36 sm:-translate-x-48 border-neutral-800 cursor-pointer";
              }

              return (
                <div
                  key={slide.id}
                  onClick={() => setCurrentSlide(index)}
                  className={`absolute w-60 h-44 sm:w-80 sm:h-56 rounded-2xl border bg-neutral-900/90 p-2 transition-all duration-500 ease-out overflow-hidden flex items-center justify-center backdrop-blur-md ${positionStyle}`}
                >
                  <img
                    src={slide.image}
                    alt={slide.title}
                    draggable={false}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              );
            })}
          </div>

          {/* متن توضیحات خدمات */}
          <div className="text-center w-full max-w-lg z-20 mt-4">
            <span className="inline-block text-xs font-bold text-cyan-400 tracking-widest uppercase mb-1 drop-shadow-sm">
              {slides[currentSlide].category}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-2 transition-all duration-300">
              {slides[currentSlide].title}
            </h3>
            <p className="text-neutral-300 text-xs sm:text-sm font-light leading-relaxed">
              {slides[currentSlide].description}
            </p>
          </div>

          {/* دکمه قبلی (راست) */}
          <button
            onClick={prevSlide}
            aria-label="اسلاید قبلی"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-neutral-700/80 bg-neutral-900/90 text-white flex items-center justify-center shadow-lg hover:border-cyan-400 hover:text-cyan-400 hover:scale-110 active:scale-95 transition-all z-30"
          >
            &#10095;
          </button>

          {/* دکمه بعدی (چپ) */}
          <button
            onClick={nextSlide}
            aria-label="اسلاید بعدی"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-neutral-700/80 bg-neutral-900/90 text-white flex items-center justify-center shadow-lg hover:border-cyan-400 hover:text-cyan-400 hover:scale-110 active:scale-95 transition-all z-30"
          >
            &#10094;
          </button>
        </div>

        {/* نشانگرهای نقطه‌ای */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSlide(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? "w-8 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" : "w-2 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </section>

      {/* بخش شبکه‌های اجتماعی */}
      <section className="relative z-10 max-w-md mx-auto px-6 py-10 text-center">
        <h3 className="text-sm font-semibold tracking-wider text-neutral-400 uppercase mb-6">
          راه‌های ارتباط و ثبت سفارش
        </h3>

        <div className="flex items-center justify-center gap-5">
          <a
            href="https://t.me/lkhakil"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label="تلگرام محمدرضا خاکی"
            className="w-14 h-14 p-3.5 rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-sm text-neutral-400 hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-neutral-800 transition-all duration-300 hover:scale-110 flex items-center justify-center shadow-lg hover:shadow-cyan-500/20"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.99 1.27-5.63 3.72-.53.36-1.02.54-1.45.53-.48-.01-1.4-.27-2.09-.49-.84-.27-1.51-.42-1.45-.89.03-.25.38-.51 1.07-.78 4.2-1.83 7-3.04 8.42-3.64 4.01-1.68 4.84-1.97 5.39-1.98.12 0 .39.03.56.17.15.12.19.28.21.46-.02.06-.02.13-.04.2z" />
            </svg>
          </a>

          <a
            href="https://instagram.com/mohammad_.rk"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label="اینستاگرام محمدرضا خاکی"
            className="w-14 h-14 p-3.5 rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-sm text-neutral-400 hover:text-pink-400 hover:border-pink-500/50 hover:bg-neutral-800 transition-all duration-300 hover:scale-110 flex items-center justify-center shadow-lg hover:shadow-pink-500/20"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>

          <a
            href="https://wa.me/989200600192"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label="واتس‌اپ محمدرضا خاکی"
            className="w-14 h-14 p-3.5 rounded-2xl border border-neutral-800 bg-neutral-900/80 backdrop-blur-sm text-neutral-400 hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-neutral-800 transition-all duration-300 hover:scale-110 flex items-center justify-center shadow-lg hover:shadow-emerald-500/20"
          >
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </a>
        </div>
      </section>

      <MotionFooter />
    </div>
  );
}