import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-12 bg-[var(--card)] border-t py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">C</div>
            <div>
              <h3 className="font-semibold">Creatix</h3>
              <p className="text-sm text-[var(--muted)]">Competitions that empower creators worldwide.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-semibold">Navigate</h4>
            <ul className="mt-2 text-sm text-[var(--muted)] space-y-1">
              <li><Link to="/all-contests">All Contests</Link></li>
              <li><Link to="/leaderboard">Leaderboard</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold">Support</h4>
            <ul className="mt-2 text-sm text-[var(--muted)] space-y-1">
              <li>support@creatix.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
