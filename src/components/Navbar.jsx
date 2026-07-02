import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dice5, Menu, X, Ghost } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = location.hash === '' || location.hash === '#/';

  const navLinks = isHome ? [
    { label: 'หน้าแรก', href: '#hero' },
    { label: 'บอร์ดเกมแนะนำ', href: '#games' },
    { label: 'หมวดหมู่', href: '#categories' },
    { label: 'เกี่ยวกับ', href: '#about' },
  ] : [];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-lg py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
            <Dice5 size={22} />
          </div>
          <span className="text-xl font-bold text-secondary-800">
            C<span className="text-primary-600">Quiz</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-secondary-600 hover:text-primary-600 transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-0 after:h-[2px] after:bg-primary-600 after:transition-all hover:after:w-full"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/werewolf"
            className="flex items-center gap-1.5 text-sm font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-xl transition-colors"
          >
            <Ghost size={16} />
            Werewolf
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-secondary-700 hover:text-primary-600"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden glass border-t mt-3 px-6 py-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-medium text-secondary-700 hover:text-primary-600 py-2"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/werewolf"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2 text-sm font-semibold text-rose-600 py-2"
          >
            <Ghost size={16} />
            Werewolf
          </Link>
        </div>
      )}
    </nav>
  );
}
