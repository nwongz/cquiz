import { ArrowLeft, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TermsOfUse() {
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
              <FileText size={24} />
            </div>
            <h1 className="text-3xl font-bold text-secondary-800">ข้อกำหนดการใช้งาน</h1>
          </div>

          <div className="text-sm text-secondary-400 mb-8">อัปเดตล่าสุด: 2 กรกฎาคม 2026</div>

          <div className="space-y-8 text-secondary-600 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-secondary-800 mb-3">1. การยอมรับข้อกำหนด</h2>
              <p>
                การเข้าใช้งานเว็บไซต์ CQuiz (cquiz.app) หมายถึงคุณยอมรับและตกลงที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขการใช้งานนี้
                หากคุณไม่เห็นด้วย กรุณาหยุดใช้งานเว็บไซต์ทันที
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-secondary-800 mb-3">2. การใช้งานเว็บไซต์</h2>
              <p className="mb-2">
                CQuiz เป็นเว็บไซต์แนะนำบอร์ดเกมที่ให้ข้อมูลและรีวิวเกี่ยวกับบอร์ดเกมต่างๆ
                เนื้อหาบนเว็บไซต์มีวัตถุประสงค์เพื่อให้ข้อมูลเท่านั้น และอาจมีการเปลี่ยนแปลงโดยไม่ต้องแจ้งให้ทราบล่วงหน้า
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-secondary-800 mb-3">3. ลิขสิทธิ์และทรัพย์สินทางปัญญา</h2>
              <p>
                เนื้อหาทั้งหมดบนเว็บไซต์ รวมถึงข้อความ รูปภาพ โลโก้ และการออกแบบ เป็นลิขสิทธิ์ของ CQuiz
                หรือผู้ให้อนุญาต ห้ามมิให้คัดลอก แจกจ่าย หรือดัดแปลงโดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-secondary-800 mb-3">4. การเชื่อมโยงไปยังเว็บไซต์อื่น</h2>
              <p>
                เว็บไซต์ของเราอาจมีลิงก์ไปยังเว็บไซต์ภายนอก เช่น BoardGameGeek
                เราไม่รับผิดชอบต่อเนื้อหา นโยบายความเป็นส่วนตัว หรือการปฏิบัติของเว็บไซต์ภายนอกเหล่านั้น
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-secondary-800 mb-3">5. การปฏิเสธความรับผิดชอบ</h2>
              <p>
                เว็บไซต์นี้ให้บริการ "ตามสภาพ" (as is) โดยไม่มีการรับประกันใดๆ
                เราไม่รับผิดชอบต่อความเสียหายที่อาจเกิดขึ้นจากการใช้งานเว็บไซต์หรือข้อมูลที่นำเสนอ
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-secondary-800 mb-3">6. การเปลี่ยนแปลงข้อกำหนด</h2>
              <p>
                เราขอสงวนสิทธิ์ในการแก้ไขข้อกำหนดการใช้งานนี้ได้ตลอดเวลา
                การเปลี่ยนแปลงจะมีผลทันทีที่เผยแพร่บนเว็บไซต์ คุณควรตรวจสอบข้อกำหนดเป็นระยะๆ
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-secondary-800 mb-3">7. กฎหมายที่ใช้บังคับ</h2>
              <p>
                ข้อกำหนดนี้อยู่ภายใต้กฎหมายของประเทศไทย และข้อพิพาทใดๆ จะอยู่ภายใต้เขตอำนาจศาลของประเทศไทย
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-secondary-800 mb-3">8. ติดต่อเรา</h2>
              <p>
                หากคุณมีคำถามเกี่ยวกับข้อกำหนดการใช้งานนี้ กรุณาติดต่อเราผ่านช่องทางที่ระบุในเว็บไซต์
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
