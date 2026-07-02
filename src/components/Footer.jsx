import { Link } from 'react-router-dom';
import { Dice5, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary-800 text-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center text-white">
                <Dice5 size={18} />
              </div>
              <span className="text-lg font-bold">
                C<span className="text-primary-400">Quiz</span>
              </span>
            </div>
            <p className="text-secondary-300 text-sm leading-relaxed">
              แหล่งรวมบอร์ดเกมยอดนิยมจากทั่วโลก ช่วยคุณค้นหาเกมที่เหมาะกับทุกโอกาส
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">ลิงก์ด่วน</h4>
            <ul className="space-y-2.5 text-sm text-secondary-300">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">หน้าแรก</Link></li>
              <li><a href="/#games" className="hover:text-primary-400 transition-colors">บอร์ดเกมแนะนำ</a></li>
              <li><a href="/#categories" className="hover:text-primary-400 transition-colors">หมวดหมู่</a></li>
              <li><a href="/#about" className="hover:text-primary-400 transition-colors">เกี่ยวกับ</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">แหล่งข้อมูล</h4>
            <ul className="space-y-2.5 text-sm text-secondary-300">
              <li>
                <a href="https://boardgamegeek.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">
                  BoardGameGeek
                </a>
              </li>
              <li>
                <a href="https://www.thailandboardgame.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary-400 transition-colors">
                  Thailand Board Game
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">ข้อกำหนด</h4>
            <ul className="space-y-2.5 text-sm text-secondary-300">
              <li><Link to="/privacy" className="hover:text-primary-400 transition-colors">นโยบายความเป็นส่วนตัว</Link></li>
              <li><Link to="/terms" className="hover:text-primary-400 transition-colors">ข้อกำหนดการใช้งาน</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-700 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-secondary-400 flex items-center gap-1">
            สร้างด้วย <Heart size={14} className="text-rose-400 fill-rose-400" /> โดย CQuiz
          </p>
          <p className="text-sm text-secondary-500">
            &copy; {new Date().getFullYear()} CQuiz. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
