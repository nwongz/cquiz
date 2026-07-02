import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cquiz_cookie_consent');
    if (!consent) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cquiz_cookie_consent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cquiz_cookie_consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[70] p-4 md:p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl border border-secondary-100 p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Cookie size={20} className="text-primary-600" />
            <h3 className="font-bold text-secondary-800">เว็บไซต์นี้ใช้คุกกี้</h3>
          </div>
          <p className="text-sm text-secondary-500 leading-relaxed">
            เราใช้คุกกี้เพื่อปรับปรุงประสบการณ์การใช้งาน วิเคราะห์การเข้าชม และแสดงโฆษณาที่เหมาะสม
            คุณสามารถอ่านรายละเอียดได้ที่{' '}
            <a href="#/privacy" className="text-primary-600 font-medium hover:underline">
              นโยบายความเป็นส่วนตัว
            </a>{' '}
            และ{' '}
            <a href="#/terms" className="text-primary-600 font-medium hover:underline">
              ข้อกำหนดการใช้งาน
            </a>
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleDecline}
            className="flex-1 md:flex-none px-5 py-2.5 text-sm font-medium text-secondary-600 bg-secondary-50 hover:bg-secondary-100 rounded-xl transition-colors"
          >
            ปฏิเสธ
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 md:flex-none px-5 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors shadow-sm"
          >
            ยอมรับ
          </button>
        </div>
        <button
          onClick={handleDecline}
          className="absolute top-3 right-3 md:static text-secondary-400 hover:text-secondary-600 p-1"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
