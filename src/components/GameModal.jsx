import { X, Star, Users, Clock, Baby, ExternalLink } from 'lucide-react';

export default function GameModal({ game, onClose }) {
  if (!game) return null;

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 'ง่าย': return 'bg-emerald-100 text-emerald-700';
      case 'ปานกลาง': return 'bg-amber-100 text-amber-700';
      case 'ยาก': return 'bg-rose-100 text-rose-700';
      default: return 'bg-secondary-100 text-secondary-700';
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative h-64 md:h-80">
          <img
            src={game.image}
            alt={game.name}
            className="w-full h-full object-cover rounded-t-3xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-t-3xl" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-secondary-700 hover:bg-white transition-colors shadow-lg"
          >
            <X size={20} />
          </button>

          <div className="absolute bottom-4 left-6">
            <h2 className="text-3xl font-bold text-white mb-1">{game.thaiName}</h2>
            <p className="text-white/80 text-sm">{game.name}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <div className="bg-secondary-50 rounded-2xl p-4 text-center">
              <Star size={20} className="text-amber-500 mx-auto mb-1" />
              <div className="text-lg font-bold text-secondary-800">{game.rating}</div>
              <div className="text-xs text-secondary-400">คะแนน BGG</div>
            </div>
            <div className="bg-secondary-50 rounded-2xl p-4 text-center">
              <Users size={20} className="text-primary-500 mx-auto mb-1" />
              <div className="text-lg font-bold text-secondary-800">{game.players}</div>
              <div className="text-xs text-secondary-400">ผู้เล่น</div>
            </div>
            <div className="bg-secondary-50 rounded-2xl p-4 text-center">
              <Clock size={20} className="text-primary-500 mx-auto mb-1" />
              <div className="text-lg font-bold text-secondary-800">{game.time}</div>
              <div className="text-xs text-secondary-400">ระยะเวลา</div>
            </div>
            <div className="bg-secondary-50 rounded-2xl p-4 text-center">
              <Baby size={20} className="text-primary-500 mx-auto mb-1" />
              <div className="text-lg font-bold text-secondary-800">{game.age}</div>
              <div className="text-xs text-secondary-400">อายุ</div>
            </div>
          </div>

          {/* Difficulty */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-sm text-secondary-500 font-medium">ระดับความยาก:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(game.difficulty)}`}>
              {game.difficulty}
            </span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-secondary-800 mb-3">เกี่ยวกับเกม</h3>
            <p className="text-secondary-600 leading-relaxed">{game.description}</p>
          </div>

          {/* Tags */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-secondary-800 mb-2">แท็ก</h3>
            <div className="flex flex-wrap gap-2">
              {game.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-primary-50 text-primary-700 text-sm rounded-xl font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Link */}
          <a
            href={game.bggLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-secondary-800 hover:bg-secondary-900 text-white font-semibold py-4 rounded-2xl transition-colors"
          >
            <span>ดูข้อมูลเพิ่มเติมที่ BoardGameGeek</span>
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}
