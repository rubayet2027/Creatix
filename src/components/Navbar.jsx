import React, { useContext, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ThemeContext } from '../theme/ThemeProvider'

function NavLinkItem({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        'px-3 py-2 rounded-md text-sm font-medium ' + (isActive ? 'text-primary' : 'text-[var(--muted)]')
      }
    >
      {children}
    </NavLink>
  )
}

export default function Navbar() {
  const { toggle, theme } = useContext(ThemeContext)
  const [open, setOpen] = useState(false)

  return (
    <header className="backdrop-blur-sm glass fixed w-full z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">C</div>
              <span className="text-lg font-semibold">Creatix</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-2">
            <NavLinkItem to="/">Home</NavLinkItem>
            <NavLinkItem to="/all-contests">All Contests</NavLinkItem>
            <NavLinkItem to="/leaderboard">Leaderboard</NavLinkItem>
            <NavLinkItem to="/about">About</NavLinkItem>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="px-3 py-2 rounded-md bg-[var(--card)] shadow-sm text-sm"
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>

            <div className="hidden md:flex gap-2">
              <Link to="/login" className="px-4 py-2 rounded-md border text-sm">Login</Link>
              <Link to="/register" className="px-4 py-2 rounded-md bg-primary text-white text-sm">Register</Link>
            </div>

            <button className="md:hidden px-2 py-1" onClick={() => setOpen(v => !v)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden px-4 pb-4">
          <nav className="flex flex-col gap-2">
            <Link to="/">Home</Link>
            <Link to="/all-contests">All Contests</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/about">About</Link>
            <div className="flex gap-2 mt-2">
              <Link to="/login" className="px-3 py-2 rounded-md border w-full text-center">Login</Link>
              <Link to="/register" className="px-3 py-2 rounded-md bg-primary text-white w-full text-center">Register</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
