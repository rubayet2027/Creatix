import React from 'react'

export default function Hero() {
  return (
    <section className="pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">Discover. Compete. Win.</h1>
          <p className="mt-4 text-[var(--muted)] max-w-xl">Join themed competitions, showcase your creativity, and earn recognition and rewards from global audiences.</p>

          <div className="mt-6 flex gap-3">
            <input aria-label="Search contests" placeholder="Search contests, categories, or creators" className="px-4 py-3 rounded-md shadow-sm w-full bg-[var(--card)] border" />
            <button className="px-5 py-3 rounded-md bg-primary text-white">Search</button>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          <div className="w-[320px] h-[220px] rounded-xl bg-gradient-to-tr from-primary to-secondary shadow-xl flex items-center justify-center text-white">
            <div className="text-center">
              <div className="font-semibold">Contest Dashboard</div>
              <div className="text-sm mt-2 text-white/80">Preview of active challenges and live entries</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
