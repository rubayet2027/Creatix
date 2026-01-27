import React from 'react'

export default function Stats() {
  const stats = [
    { label: 'Contests Hosted', value: '1,280+' },
    { label: 'Participants', value: '250k+' },
    { label: 'Winners', value: '3,410+' }
  ]

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-[var(--card)] rounded-xl p-6 text-center shadow">
              <div className="text-3xl font-bold">{s.value}</div>
              <div className="mt-2 text-sm text-[var(--muted)]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
