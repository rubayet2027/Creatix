import React from 'react'

export default function WinnerShowcase() {
  const winners = [
    { name: 'Ava Martin', prize: '$2,500', img: 'https://source.unsplash.com/80x80/?portrait,woman' },
    { name: 'Liam Carter', prize: '$1,800', img: 'https://source.unsplash.com/80x80/?portrait,man' },
    { name: 'Maya Lee', prize: '$1,200', img: 'https://source.unsplash.com/80x80/?portrait,artist' }
  ]

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-semibold">Winners Showcase</h2>
        <p className="mt-3 text-[var(--muted)]">Celebrating creators who turned ideas into success stories on Creatix.</p>

        <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-6">
          {winners.map((w) => (
            <div key={w.name} className="bg-[var(--card)] rounded-xl p-4 shadow w-64">
              <div className="flex items-center gap-4">
                <img src={w.img} alt={w.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-semibold">{w.name}</div>
                  <div className="text-sm text-[var(--muted)]">Prize: {w.prize}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <a href="/leaderboard" className="inline-block px-5 py-2 bg-primary text-white rounded-md">View Leaderboard</a>
        </div>
      </div>
    </section>
  )
}
