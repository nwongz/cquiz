import { LayoutGrid, Brain, PartyPopper, Heart, Users, Layers, Hexagon } from 'lucide-react';

const iconMap = {
  LayoutGrid, Brain, PartyPopper, Heart, Users, Layers, Hexagon,
};

export default function CategorySection({ categories, activeCategory, onSelect }) {
  return (
    <section id="categories" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-3">
            เลือกตาม<span className="text-primary-600">หมวดหมู่</span>
          </h2>
          <p className="text-secondary-500 max-w-lg mx-auto">
            บอร์ดเกมแบ่งตามสไตล์การเล่น ช่วยให้คุณหาเกมที่ใช่ได้ง่ายขึ้น
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon];
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelect(cat.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25 scale-105'
                    : 'bg-secondary-50 text-secondary-600 hover:bg-secondary-100 hover:scale-105'
                }`}
              >
                {Icon && <Icon size={18} />}
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
