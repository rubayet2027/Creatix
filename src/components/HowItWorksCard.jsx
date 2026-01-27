import React from 'react'

export default function HowItWorksCard({ title, description, cta }) {
  return (
    <div className="p-6 bg-[var(--card)] rounded-xl shadow hover:shadow-lg transition-shadow">
      <div className="h-12 w-12 rounded-md bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] font-bold">✦</div>
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-[var(--muted)]">{description}</p>
      {cta && <button className="mt-4 px-4 py-2 rounded-md bg-primary text-white text-sm">{cta}</button>}
    </div>
  )
}
