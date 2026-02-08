import { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HiMenu, HiX, HiSun, HiMoon, HiChevronDown, HiUser, HiLogout, HiViewGrid } from 'react-icons/hi';
import { useTheme } from '../theme/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const dropdownRef = useRef(null);

  // Simulated auth state (UI only)
  const isLoggedIn = false;
  const user = { name: 'John Doe', avatar: null };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change / resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/all-contests', label: 'All Contests' },
    { to: '/leaderboard', label: 'Leaderboard' },
  ];

  const navLinkClass = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'text-primary-600 dark:text-primary-400'
        : 'text-[var(--text-secondary)] hover:text-primary-600 dark:hover:text-primary-400'
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--bg-primary)]/95 backdrop-blur-md shadow-lg border-b border-[var(--border-color)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/25 group-hover:shadow-primary-500/40 transition-shadow">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
              Creatix
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex justify-between items-center gap-1">
            {navLinks.map((link) => (
              <NavLink key={link.to} to={link.to} className={navLinkClass}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <HiSun className="w-5 h-5 text-amber-400" />
              ) : (
                <HiMoon className="w-5 h-5 text-secondary-600" />
              )}
            </button>

            {isLoggedIn ? (
              /* Profile Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full rounded-lg object-cover"
                      />
                    ) : (
                      <HiUser className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {user.name}
                  </span>
                  <HiChevronDown
                    className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-200 ${
                      profileDropdown ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <HiViewGrid className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => setProfileDropdown(false)}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <HiLogout className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Auth Buttons */
              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <HiSun className="w-5 h-5 text-amber-400" />
              ) : (
                <HiMoon className="w-5 h-5 text-secondary-600" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <HiX className="w-6 h-6 text-[var(--text-primary)]" />
              ) : (
                <HiMenu className="w-6 h-6 text-[var(--text-primary)]" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-[500px] pb-6' : 'max-h-0'
          }`}
        >
          <div className="flex flex-col gap-2 pt-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--border-color)]">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-[var(--text-primary)] rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    <HiViewGrid className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-500 rounded-xl border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <HiLogout className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-3 text-center text-sm font-medium text-[var(--text-primary)] rounded-xl border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 px-4 py-3 text-center text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl hover:from-primary-700 hover:to-primary-800 transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;