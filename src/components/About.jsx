import { Dice5, ArrowUpRight } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-primary-50 rounded-full px-4 py-2 text-sm text-primary-700 mb-6">
              <Dice5 size={16} />
              <span>เกี่ยวกับ CQuiz</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-6 leading-snug">
              เราคือแหล่งรวม
              <span className="text-primary-600">บอร์ดเกม</span>
              <br />
              ที่คุณวางใจได้
            </h2>
            <p className="text-secondary-500 leading-relaxed mb-6">
              CQuiz ถูกสร้างขึ้นโดยผู้ที่หลงใหลในบอร์ดเกม เรารวบรวมข้อมูลบอร์ดเกมยอดนิยมจากทั่วโลก
              เพื่อช่วยให้คุณค้นหาเกมที่เหมาะกับสไตล์และโอกาสของคุณได้ง่ายขึ้น
            </p>
            <p className="text-secondary-500 leading-relaxed mb-8">
              ไม่ว่าคุณจะเป็นมือใหม่ที่เพิ่งเริ่มเล่นบอร์ดเกม หรือเกมเมอร์ตัวยงที่กำลังมองหาเกมใหม่ๆ
              เรามีตัวเลือกที่เหมาะสมสำหรับคุณเสมอ
            </p>

            <div className="flex flex-wrap gap-8">
              <div>
                <div className="text-3xl font-bold text-primary-600">12+</div>
                <div className="text-sm text-secondary-500">บอร์ดเกมแนะนำ</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600">6</div>
                <div className="text-sm text-secondary-500">หมวดหมู่</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary-600">8.4</div>
                <div className="text-sm text-secondary-500">คะแนนสูงสุด</div>
              </div>
            </div>
          </div>

          {/* Right - decorative cards */}
          <div className="relative h-[400px] hidden lg:block">
            <div className="absolute top-0 left-0 w-64 h-64 bg-primary-100 rounded-3xl rotate-[-6deg] opacity-70" />
            <div className="absolute top-8 left-8 w-64 h-64 bg-primary-200 rounded-3xl rotate-[3deg] opacity-60" />
            <div className="absolute top-16 left-16 w-64 h-64 bg-white rounded-3xl shadow-xl p-6 flex flex-col justify-between rotate-0">
              <div>
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white mb-4">
                  <Dice5 size={20} />
                </div>
                <h3 className="font-bold text-secondary-800 text-lg">CQuiz</h3>
                <p className="text-sm text-secondary-500 mt-1">แนะนำบอร์ดเกม</p>
              </div>
              <div className="flex items-center gap-2 text-primary-600 text-sm font-semibold">
                <span>เริ่มสำรวจ</span>
                <ArrowUpRight size={16} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
