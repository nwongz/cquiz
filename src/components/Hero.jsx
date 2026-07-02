import { ArrowDown, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Background decoration — hidden on mobile to prevent GPU freeze */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50" />
      <div className="hidden md:block absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full blur-[100px] opacity-40" />
      <div className="hidden md:block absolute bottom-20 right-10 w-96 h-96 bg-primary-300 rounded-full blur-[120px] opacity-30" />
      <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary-200 rounded-full blur-[150px] opacity-20" />

      {/* Floating shapes — hidden on mobile */}
      <div className="hidden md:block absolute top-32 right-[15%] w-16 h-16 border-2 border-primary-300 rounded-2xl rotate-12 opacity-50 animate-bounce" style={{ animationDuration: '3s' }} />
      <div className="hidden md:block absolute bottom-40 left-[12%] w-12 h-12 bg-primary-400 rounded-full opacity-30 animate-bounce" style={{ animationDuration: '4s' }} />
      <div className="hidden md:block absolute top-[20%] left-[20%] w-8 h-8 border-2 border-secondary-300 rounded-full opacity-40 animate-pulse" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-primary-200 rounded-full px-4 py-2 text-sm text-primary-700 mb-8 shadow-sm">
          <Sparkles size={16} />
          <span>ค้นพบบอร์ดเกมที่ใช่สำหรับคุณ</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-secondary-800 leading-tight mb-6">
          แนะนำบอร์ดเกม
          <br />
          <span className="gradient-text">ที่คุณจะต้องชอบ</span>
        </h1>

        <p className="text-lg md:text-xl text-secondary-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          รวบรวมบอร์ดเกมยอดฮิตจากทั่วโลก คัดสรรมาเพื่อทุกโอกาส
          ไม่ว่าจะเล่นกับครอบครัว เพื่อน หรือคู่รัก
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#games"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-4 rounded-2xl shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 transition-all hover:-translate-y-0.5"
          >
            สำรวจบอร์ดเกม
          </a>
          <a
            href="#categories"
            className="inline-flex items-center gap-2 bg-white hover:bg-secondary-50 text-secondary-700 font-semibold px-8 py-4 rounded-2xl border border-secondary-200 transition-all hover:-translate-y-0.5"
          >
            ดูหมวดหมู่
          </a>
        </div>

        <div className="mt-20 animate-bounce">
          <a href="#games" className="text-secondary-400 hover:text-primary-600 transition-colors">
            <ArrowDown size={28} />
          </a>
        </div>
      </div>
    </section>
  );
}
