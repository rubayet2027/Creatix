import { Link } from 'react-router-dom';
import { HiUsers, HiClock, HiArrowRight, HiStar } from 'react-icons/hi';

const ContestCard = ({ contest }) => {
  const {
    id,
    title,
    description,
    image,
    category,
    participants,
    deadline,
    prize,
    featured,
  } = contest;

  const getCategoryColor = (cat) => {
    const colors = {
      Design: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      Photography: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      Writing: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      Art: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
      Video: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    };
    return colors[cat] || 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
  };

  return (
    <div className="group relative bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] overflow-hidden hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/5">
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold rounded-full shadow-lg">
          <HiStar className="w-3 h-3" />
          Featured
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-secondary-900/60"
          style={{
            backgroundImage: `url(${image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/80 via-transparent to-transparent" />
        
        {/* Prize Badge */}
        <div className="absolute bottom-4 right-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
          <p className="text-xs text-white/80">Prize Pool</p>
          <p className="text-lg font-bold text-white">{prize}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category & Deadline */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(category)}`}>
            {category}
          </span>
          <div className="flex items-center gap-1 text-sm text-[var(--text-muted)]">
            <HiClock className="w-4 h-4" />
            <span>{deadline}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
          {title}
        </h3>

        {/* Description */}
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 border-2 border-[var(--bg-secondary)] flex items-center justify-center text-[10px] text-white font-medium"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <span className="flex items-center gap-1">
              <HiUsers className="w-4 h-4" />
              {participants}
            </span>
          </div>

          <Link
            to={`/contest/${id}`}
            className="flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group/btn"
          >
            Details
            <HiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContestCard;
