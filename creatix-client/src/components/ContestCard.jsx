import { Link } from 'react-router-dom';
import { HiUsers, HiClock, HiArrowRight, HiStar, HiCheckCircle } from 'react-icons/hi';
import { HiTrophy } from 'react-icons/hi2';

const ContestCard = ({ contest, showWinners = false }) => {
  const {
    _id,
    name,
    description,
    image,
    contestType,
    participantsCount,
    deadline,
    prizeMoney,
    status,
    winners,
  } = contest;

  // Format deadline
  const formatDeadline = (date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = d - now;
    
    if (diff < 0) {
      return 'Ended';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 7) {
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else if (days > 0) {
      return `${days}d ${hours}h left`;
    } else if (hours > 0) {
      return `${hours}h left`;
    } else {
      return 'Ending soon';
    }
  };

  const isEnded = new Date(deadline) < new Date() || status === 'completed';

  const getCategoryColor = (cat) => {
    const colors = {
      'Image Design': 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
      'Article Writing': 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
      'Marketing Strategy': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
      'Digital Advertisement': 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
      'Gaming Review': 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
      'Book Review': 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
      'Business Idea': 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
      'Movie Review': 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
    };
    return colors[cat] || 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
  };

  return (
    <div className="group relative bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] overflow-hidden hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/5">
      {/* Ended Badge */}
      {isEnded && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1 px-3 py-1 bg-gray-600 text-white text-xs font-semibold rounded-full shadow-lg">
          <HiCheckCircle className="w-3 h-3" />
          Completed
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
          <p className="text-lg font-bold text-white">${prizeMoney}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category & Deadline */}
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(contestType)}`}>
            {contestType}
          </span>
          <div className={`flex items-center gap-1 text-sm ${isEnded ? 'text-gray-500' : 'text-[var(--text-muted)]'}`}>
            <HiClock className="w-4 h-4" />
            <span>{formatDeadline(deadline)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
          {name}
        </h3>

        {/* Description */}
        <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-4 line-clamp-2">
          {description}
        </p>

        {/* Winners Section (for past contests) */}
        {showWinners && winners && winners.length > 0 && (
          <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 mb-2">
              <HiTrophy className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">Winners</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {winners.slice(0, 3).map((winner, idx) => (
                <div key={winner.user?._id || idx} className="flex items-center gap-1">
                  <span className={`text-xs font-bold ${
                    winner.rank === 1 ? 'text-amber-500' : 
                    winner.rank === 2 ? 'text-gray-400' : 
                    'text-amber-700'
                  }`}>
                    #{winner.rank}
                  </span>
                  <span className="text-xs text-[var(--text-secondary)]">
                    {winner.user?.name || 'Winner'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

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
              {participantsCount || 0}
            </span>
          </div>

          <Link
            to={`/contest/${_id}`}
            className="flex items-center gap-1 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors group/btn"
          >
            {isEnded ? 'View Results' : 'Details'}
            <HiArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ContestCard;
