export default function HowItWorksCard({ title, description, cta }) {
  return (
    <div className="p-6 bg-(--bg-secondary) rounded-xl shadow hover:shadow-lg transition-shadow border border-(--border-color)">
      <div className="h-12 w-12 rounded-md bg-primary-500/10 flex items-center justify-center text-primary-500 font-bold">✦</div>
      <h3 className="mt-4 font-semibold text-(--text-primary)">{title}</h3>
      <p className="mt-2 text-sm text-(--text-secondary)">{description}</p>
      {cta && <button className="mt-4 px-4 py-2 rounded-md bg-primary-600 text-white text-sm hover:bg-primary-700 transition-colors">{cta}</button>}
    </div>
  )
}
