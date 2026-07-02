import { Star, Users, Clock, ChevronRight } from 'lucide-react';

export default function GameCard({ game, onClick }) {
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
      onClick={() => onClick(game)}
      className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-secondary-100 cursor-pointer card-hover"
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={game.image}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${getDifficultyColor(game.difficulty)}`}>
          {game.difficulty}
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-xs font-medium">
          <Star size={12} className="fill-amber-400 text-amber-400" />
          {game.rating}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-bold text-lg text-secondary-800 group-hover:text-primary-600 transition-colors">
              {game.thaiName}
            </h3>
            <p className="text-xs text-secondary-400 font-medium">{game.name}</p>
          </div>
        </div>

        <p className="text-sm text-secondary-500 line-clamp-2 mb-4 leading-relaxed">
          {game.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-secondary-400 mb-4">
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{game.players} คน</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{game.time}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {game.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 bg-secondary-50 text-secondary-500 text-xs rounded-lg font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-1 text-primary-600 text-sm font-semibold group-hover:gap-2 transition-all">
          <span>ดูรายละเอียด</span>
          <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
}
