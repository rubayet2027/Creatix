import { Link } from 'react-router-dom';
import { HiUsers, HiClock, HiArrowRight, HiStar, HiCheckCircle, HiCalendar } from 'react-icons/hi';
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
    startDate,
    prizeMoney,
    status,
    winners,
  } = contest;

  // Check if contest is upcoming (hasn't started yet)
  const isUpcoming = startDate && new Date(startDate) > new Date();
  
  // Format time display based on contest status
  const formatTimeDisplay = () => {
    const now = new Date();
    
    // If contest hasn't started yet, show "Starts in X"
    if (isUpcoming) {
      const start = new Date(startDate);
      const diff = start - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      if (days > 7) {
        return { text: `Starts ${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, icon: 'calendar', color: 'text-blue-500' };
      } else if (days > 0) {
        return { text: `Starts in ${days}d ${hours}h`, icon: 'calendar', color: 'text-blue-500' };
      } else if (hours > 0) {
        return { text: `Starts in ${hours}h`, icon: 'calendar', color: 'text-blue-500' };
      } else {
        return { text: 'Starting soon', icon: 'calendar', color: 'text-blue-500' };
      }
    }
    
    // Contest has started - show deadline countdown
    const d = new Date(deadline);
    const diff = d - now;
    
    if (diff < 0) {
      return { text: 'Ended', icon: 'check', color: 'text-gray-500' };
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 7) {
      return { text: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), icon: 'clock', color: 'text-[var(--text-muted)]' };
    } else if (days > 0) {
      return { text: `${days}d ${hours}h left`, icon: 'clock', color: days <= 1 ? 'text-red-500' : 'text-orange-500' };
    } else if (hours > 0) {
      return { text: `${hours}h left`, icon: 'clock', color: 'text-red-500' };
    } else {
      return { text: 'Ending soon', icon: 'clock', color: 'text-red-500' };
    }
  };

  const timeDisplay = formatTimeDisplay();
  const isEnded = new Date(deadline) < new Date() || status === 'completed';

  const getCategoryColor = (cat) => {
    const colors = {
      'Image Design': 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
      'Article Writing': 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      'Marketing Strategy': 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      'Digital Advertisement': 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      'Gaming Review': 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      'Book Review': 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
      'Business Idea': 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
      'Movie Review': 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
    };
    return colors[cat] || 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]';
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
          <div className={`flex items-center gap-1 text-sm ${timeDisplay.color}`}>
            {timeDisplay.icon === 'calendar' ? (
              <HiCalendar className="w-4 h-4" />
            ) : timeDisplay.icon === 'check' ? (
              <HiCheckCircle className="w-4 h-4" />
            ) : (
              <HiClock className="w-4 h-4" />
            )}
            <span>{timeDisplay.text}</span>
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
          <div className="mb-4 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
            <div className="flex items-center gap-2 mb-2">
              <HiTrophy className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">Winners</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {winners.slice(0, 3).map((winner, idx) => (
                <div key={winner.user?._id || idx} className="flex items-center gap-1">
                  <span className={`text-xs font-bold ${
                    winner.rank === 1 ? 'text-amber-500' : 
                    winner.rank === 2 ? 'text-[var(--text-muted)]' : 
                    'text-amber-700 dark:text-amber-600'
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
