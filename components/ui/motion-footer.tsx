"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function MotionFooter() {
  const footerRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!footerRef.current || !headingRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
          end: "bottom bottom",
          scrub: 1,
        },
        y: 50,
        opacity: 0.2,
        ease: "power2.out",
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      dir="rtl"
      className="relative w-full overflow-hidden bg-neutral-950 text-neutral-200 border-t border-neutral-800/80 pt-20 pb-12 font-sans"
    >
      {/* هاله نوری پس‌زمینه فوتر */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[250px] bg-indigo-600/15 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center">
        {/* نوار متحرک عبارات مفهومی */}
        <div className="w-full overflow-hidden whitespace-nowrap mb-12 opacity-25 select-none" dir="ltr">
          <div className="animate-pulse inline-block font-black text-4xl sm:text-6xl tracking-widest uppercase">
            <span>• WEB DESIGN • UI/UX • MOTION GRAPHICS • CREATIVITY • TRANSLATION • </span>
            <span>• WEB DESIGN • UI/UX • MOTION GRAPHICS • CREATIVITY • TRANSLATION • </span>
          </div>
        </div>

        {/* عنوان متحرک انیمیشنی با GSAP */}
        <h2
          ref={headingRef}
          className="text-4xl sm:text-7xl md:text-8xl font-black tracking-tight text-center text-white mb-12 select-none"
        >
          شروع یک همکاری خلاق
        </h2>

        {/* دسته‌بندی ستون‌های فوتر */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 my-10 text-sm text-right">
          {/* ستون خدمات */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 border-r-2 border-indigo-500 pr-2">
              خدمات تخصصی
            </h4>
            <ul className="space-y-2.5 text-neutral-400">
              <li className="hover:text-indigo-300 transition-colors">طراحی سایت و لندینگ پیج</li>
              <li className="hover:text-indigo-300 transition-colors">طراحی و توسعه اپلیکیشن</li>
              <li className="hover:text-indigo-300 transition-colors">تولید تیزر و موشن گرافیک</li>
              <li className="hover:text-indigo-300 transition-colors">ترجمه و بومی‌سازی متون تخصصی</li>
            </ul>
          </div>

          {/* ستون درباره دیزاینر */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 border-r-2 border-indigo-500 pr-2">
              محمدرضا خاکی
            </h4>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              طراح وب‌سایت، دیزاینر و گرافیست با تمرکز بر پیاده‌سازی رابط‌های کاربری تعاملی، مدرن و سرعت‌محور بر پایه جدیدترین تکنولوژی‌های فرانت‌اند.
            </p>
          </div>

          {/* راه‌های ارتباطی مستقیم */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 border-r-2 border-indigo-500 pr-2">
              شبکه‌های اجتماعی
            </h4>
            <ul className="space-y-2.5 text-neutral-400">
              <li>
                <a
                  href="https://t.me/lkhakil"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  تلگرام: lkhakil@
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/mohammad_.rk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-pink-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
                  اینستاگرام: mohammad_.rk@
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/989200600192"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  واتس‌اپ: ۰۹۲۰۰۶۰۰۱۹۲
                </a>
              </li>
            </ul>
          </div>

          {/* اطلاعات تماس */}
          <div>
            <h4 className="text-white font-bold text-base mb-4 border-r-2 border-indigo-500 pr-2">
              سفارش و مشاوره
            </h4>
            <p className="text-neutral-400 text-xs leading-relaxed mb-4">
              آماده پذیرش پروژه‌های شرکتی، فروشگاهی و خلاقانه با بالاترین کیفیت بصری و فنی.
            </p>
            <a
              href="https://wa.me/989200600192"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 rounded-xl bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold hover:bg-indigo-600 hover:text-white transition-all duration-300"
            >
              ارسال پیام مستقیم
            </a>
          </div>
        </div>

        {/* نوار پایانی کپی‌رایت */}
        <div className="w-full border-t border-neutral-800/80 pt-8 mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© تمامی حقوق برای محمدرضا خاکی محفوظ است.</p>
          <div className="flex gap-6">
            <span className="text-neutral-400">طراحی و اجرا: محمدرضا خاکی</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default MotionFooter;