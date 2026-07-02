import { ArrowLeft, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-secondary-500 hover:text-primary-600 mb-8 transition-colors"
        >
          <ArrowLeft size={18} />
          <span>กลับหน้าแรก</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-secondary-100 p-8 md:p-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-primary-600">
              <Shield size={24} />
            </div>
            <h1 className="text-3xl font-bold text-secondary-800">นโยบายความเป็นส่วนตัว</h1>
          </div>

          <div className="text-sm text-secondary-400 mb-8">อัปเดตล่าสุด: 2 กรกฎาคม 2026</div>

          <div className="space-y-8 text-secondary-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-secondary-800 mb-3">1. บทนำ</h2>
              <p>
                CQuiz ("เรา") ให้ความสำคัญกับความเป็นส่วนตัวของผู้ใช้งาน นโยบายนี้อธิบายว่าเราเก็บรวบรวม ใช้ และปกป้องข้อมูลส่วนบุคคลของคุณอย่างไร
                เมื่อคุณเข้าใช้งานเว็บไซต์ cquiz.app
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-secondary-800 mb-3">2. ข้อมูลที่เราเก็บรวบรวม</h2>
              <p className="mb-2">เราอาจเก็บรวบรวมข้อมูลต่อไปนี้:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>ข้อมูลการใช้งาน:</strong> หน้าเว็บที่เข้าชม ระยะเวลาการใช้งาน ประเภทอุปกรณ์ และเบราว์เซอร์</li>
                <li><strong>คุกกี้และเทคโนโลยีที่คล้ายคลึง:</strong> ใช้เพื่อปรับปรุงประสบการณ์และแสดงโฆษณาที่เหมาะสม</li>
                <li><strong>ข้อมูลทางเทคนิค:</strong> IP address, ข้อมูลการเข้าถึง (access logs)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-secondary-800 mb-3">3. การใช้ข้อมูล</h2>
              <p className="mb-2">เราใช้ข้อมูลของคุณเพื่อ:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>ปรับปรุงและพัฒนาเว็บไซต์</li>
                <li>วิเคราะห์พฤติกรรมการใช้งานของผู้เยี่ยมชม</li>
                <li>แสดงโฆษณาที่เกี่ยวข้องผ่าน Google AdSense</li>
                <li>รักษาความปลอดภัยของระบบ</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-secondary-800 mb-3">4. คุกกี้ (Cookies)</h2>
              <p>
                เว็บไซต์ของเราใช้คุกกี้เพื่อจดจำการตั้งค่าและปรับปรุงประสบการณ์การใช้งาน
                คุณสามารถปิดการใช้งานคุกกี้ผ่านการตั้งค่าเบราว์เซอร์ของคุณได้
                แต่อาจส่งผลต่อฟังก์ชันการทำงานบางอย่างของเว็บไซต์
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-secondary-800 mb-3">5. การแชร์ข้อมูลกับบุคคลที่สาม</h2>
              <p>
                เราอาจแชร์ข้อมูลกับบุคคลที่สาม เช่น Google (Google AdSense, Google Analytics)
                เพื่อวัตถุประสงค์ในการวิเคราะห์และแสดงโฆษณา โดยเป็นไปตามนโยบายความเป็นส่วนตัวของบุคคลที่สามนั้นๆ
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-secondary-800 mb-3">6. สิทธิของคุณ</h2>
              <p className="mb-2">คุณมีสิทธิ์ในการ:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>ขอเข้าถึง แก้ไข หรือลบข้อมูลส่วนตัวของคุณ</li>
                <li>ปฏิเสธการใช้งานคุกกี้ที่ไม่จำเป็น</li>
                <li>ยื่นข้อร้องเรียนต่อหน่วยงานที่เกี่ยวข้อง</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-secondary-800 mb-3">7. ติดต่อเรา</h2>
              <p>
                หากคุณมีคำถามเกี่ยวกับนโยบายความเป็นส่วนตัวนี้ กรุณาติดต่อเราผ่านช่องทางที่ระบุในเว็บไซต์
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
