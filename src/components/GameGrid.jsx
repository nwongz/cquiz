import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import GameCard from './GameCard';
import GameModal from './GameModal';

export default function GameGrid({ games, categories, activeCategory, onCategoryChange }) {
  const [search, setSearch] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [sortBy, setSortBy] = useState('rating');

  const activeCatName = categories.find((c) => c.id === activeCategory)?.name || 'ทั้งหมด';

  const filtered = games
    .filter((g) => {
      const matchCat = activeCategory === 'all' || g.category === activeCategory;
      const matchSearch =
        search === '' ||
        g.name.toLowerCase().includes(search.toLowerCase()) ||
        g.thaiName.includes(search) ||
        g.tags.some((t) => t.includes(search));
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.thaiName.localeCompare(b.thaiName, 'th');
      if (sortBy === 'difficulty') {
        const order = { 'ง่าย': 1, 'ปานกลาง': 2, 'ยาก': 3 };
        return order[a.difficulty] - order[b.difficulty];
      }
      return 0;
    });

  return (
    <section id="games" className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary-800 mb-3">
              บอร์ดเกม<span className="text-primary-600">แนะนำ</span>
            </h2>
            <p className="text-secondary-500">
              แสดง <span className="font-semibold text-secondary-700">{filtered.length}</span> เกม
              {activeCategory !== 'all' && ` ในหมวด "${activeCatName}"`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative">
              <SlidersHorizontal size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-9 pr-8 py-2.5 bg-white border border-secondary-200 rounded-xl text-sm text-secondary-700 focus:outline-none focus:ring-2 focus:ring-primary-300 appearance-none cursor-pointer"
              >
                <option value="rating">เรียงตามคะแนน</option>
                <option value="name">เรียงตามชื่อ</option>
                <option value="difficulty">เรียงตามความยาก</option>
              </select>
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" />
              <input
                type="text"
                placeholder="ค้นหาเกม..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2.5 bg-white border border-secondary-200 rounded-xl text-sm text-secondary-700 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-300 w-48 md:w-64"
              />
            </div>
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((game) => (
              <GameCard key={game.id} game={game} onClick={setSelectedGame} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-secondary-700 mb-2">ไม่พบบอร์ดเกม</h3>
            <p className="text-secondary-500">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่นดู</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedGame && (
        <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
      )}
    </section>
  );
}
