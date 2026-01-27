import React from 'react'
import Hero from '../components/Hero'
import HowItWorksCard from '../components/HowItWorksCard'
import ContestCard from '../components/ContestCard'
import WinnerShowcase from '../components/WinnerShowcase'
import Stats from '../components/Stats'

const sampleContests = [
  { id: 1, name: 'Logo Sprint', participants: 120, description: 'Design a modern brand logo', image: 'https://source.unsplash.com/400x300/?logo' },
  { id: 2, name: 'Poster Challenge', participants: 98, description: 'Create an event poster', image: 'https://source.unsplash.com/400x300/?poster' },
  { id: 3, name: 'Short Film Fest', participants: 340, description: 'Submit a short film under 5 minutes', image: 'https://source.unsplash.com/400x300/?film' },
  { id: 4, name: 'UX Sprint', participants: 76, description: 'Prototype a mobile onboarding flow', image: 'https://source.unsplash.com/400x300/?ux' },
  { id: 5, name: 'Illustration Jam', participants: 210, description: 'Illustrate a story scene', image: 'https://source.unsplash.com/400x300/?illustration' }
]

export default function Home() {
  return (
    <div>
      <Hero />

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">How it works</h2>
            <p className="mt-2 text-[var(--muted)]">Three simple steps to start competing and shipping your best work.</p>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <HowItWorksCard title="Explore Contests" description="Browse curated contests across categories and themes." cta="Browse" />
            <HowItWorksCard title="Join & Submit" description="Enter work, follow guidelines, and submit your entry quickly." cta="Join" />
            <HowItWorksCard title="Win Rewards" description="Get recognized, earn prizes, and grow your audience." cta="Win" />
          </div>
        </div>
      </section>

      <section className="py-12 bg-[var(--bg)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Popular Contests</h3>
            <a href="/all-contests" className="text-sm text-[var(--muted)]">See all</a>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleContests.map(c => (
              <ContestCard key={c.id} contest={c} />
            ))}
          </div>
        </div>
      </section>

      <WinnerShowcase />

      <Stats />
    </div>
  )
}
