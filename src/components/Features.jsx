import { Search, Sparkles, Heart, Shield } from 'lucide-react';

const features = [
  {
    icon: Search,
    title: 'คัดสรรอย่างดี',
    desc: 'เลือกเฉพาะบอร์ดเกมที่ได้รับความนิยมและมีคุณภาพจากทั่วโลก',
  },
  {
    icon: Sparkles,
    title: 'ข้อมูลครบถ้วน',
    desc: 'รายละเอียดครบ ทั้งจำนวนผู้เล่น เวลาเล่น ระดับความยาก และคะแนน BGG',
  },
  {
    icon: Heart,
    title: 'เหมาะกับทุกคน',
    desc: 'มีเกมสำหรับทุกกลุ่มอายุ ตั้งแต่ครอบครัว ปาร์ตี้ ไปจนถึงเกมเมอร์ตัวจริง',
  },
  {
    icon: Shield,
    title: 'เชื่อถือได้',
    desc: 'ข้อมูลอ้างอิงจาก BoardGameGeek แหล่งรวมข้อมูลบอร์ดเกมที่ใหญ่ที่สุดในโลก',
  },
];

export default function Features() {
  return (
    <section className="py-16 bg-secondary-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl p-6 shadow-sm border border-secondary-100 card-hover"
            >
              <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600 mb-4">
                <f.icon size={24} />
              </div>
              <h3 className="font-bold text-secondary-800 mb-2">{f.title}</h3>
              <p className="text-sm text-secondary-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
