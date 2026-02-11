import PropTypes from 'prop-types';

export default function HowItWorksCard({ title, description, cta, onCtaClick, icon, stepNumber }) {
  return (
    <div className="p-6 bg-[var(--bg-secondary)] rounded-xl shadow hover:shadow-lg transition-shadow border border-[var(--border-color)]">
      <div
        className="h-12 w-12 rounded-md bg-primary-500/10 flex items-center justify-center text-primary-500 font-bold text-lg"
        aria-hidden="true"
      >
        {icon || stepNumber || '✦'}
      </div>

      {stepNumber && (
        <span className="sr-only">Step {stepNumber}</span>
      )}

      <h3 className="mt-4 font-semibold text-[var(--text-primary)]">
        {title}
      </h3>

      <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">
        {description}
      </p>

      {cta && (
        <button
          type="button"
          onClick={onCtaClick}
          className="mt-4 px-4 py-2 rounded-md bg-primary-600 text-white text-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
        >
          {cta}
        </button>
      )}
    </div>
  );
}

HowItWorksCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  cta: PropTypes.string,
  onCtaClick: PropTypes.func,
  icon: PropTypes.node,
  stepNumber: PropTypes.number,
};

HowItWorksCard.defaultProps = {
  cta: null,
  onCtaClick: undefined,
  icon: null,
  stepNumber: null,
};