import { useState, useEffect, useRef } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HiMenu, HiX, HiSun, HiMoon, HiChevronDown, HiUser, HiLogout, HiViewGrid, HiShieldCheck, HiUserGroup, HiCog, HiPencil, HiStar, HiClock, HiBadgeCheck } from 'react-icons/hi';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { dbUser, logout, isAuthenticated, loading } = useAuth();
  const dropdownRef = useRef(null);

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

  const handleLogout = async () => {
    setProfileDropdown(false);
    setIsOpen(false);
    await logout();
  };

  // Different nav links based on authentication state
  const publicNavLinks = [
    { to: '/', label: 'Home' },
    { to: '/all-contests', label: 'All Contests' },
    { to: '/leaderboard', label: 'Leaderboard' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  const authenticatedNavLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/all-contests', label: 'All Contests' },
    { to: '/leaderboard', label: 'Leaderboard' },
  ];

  // Use different nav links based on whether user is logged in
  const navLinks = isAuthenticated && dbUser ? authenticatedNavLinks : publicNavLinks;

  const navLinkClass = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${isActive
      ? 'text-primary-600 dark:text-primary-400'
      : 'text-[var(--text-secondary)] hover:text-primary-600 dark:hover:text-primary-400'
    }`;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-[var(--bg-primary)]/95 backdrop-blur-md shadow-lg border-b border-[var(--border-color)]'
          : 'bg-[var(--bg-primary)]/80 backdrop-blur-sm'
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

            {loading ? (
              <div className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] animate-pulse" />
            ) : isAuthenticated && dbUser ? (
              /* Profile Dropdown */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center overflow-hidden">
                    {dbUser.photo ? (
                      <img
                        src={dbUser.photo}
                        alt={dbUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <HiUser className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {dbUser.name?.split(' ')[0] || 'User'}
                  </span>
                  <HiChevronDown
                    className={`w-4 h-4 text-[var(--text-secondary)] transition-transform duration-200 ${profileDropdown ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Header with name and role */}
                    <div className="px-4 py-3 border-b border-[var(--border-color)]">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{dbUser.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {dbUser.role === 'admin' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-600 text-xs font-medium rounded-full">
                            <HiShieldCheck className="w-3 h-3" />
                            Admin
                          </span>
                        )}
                        {dbUser.role === 'creator' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/20 text-purple-600 text-xs font-medium rounded-full">
                            <HiUserGroup className="w-3 h-3" />
                            Creator
                          </span>
                        )}
                        {dbUser.role === 'user' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-600 text-xs font-medium rounded-full">
                            <HiUser className="w-3 h-3" />
                            User
                          </span>
                        )}
                        {dbUser.creatorStatus === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 text-xs font-medium rounded-full">
                            <HiClock className="w-3 h-3" />
                            Creator Pending
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Dashboard Link */}
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <HiViewGrid className="w-4 h-4" />
                      Dashboard
                    </Link>

                    {/* Profile Link */}
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setProfileDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <HiCog className="w-4 h-4" />
                      My Profile
                    </Link>

                    {/* Creator-specific links */}
                    {(dbUser.role === 'creator' || dbUser.role === 'admin') && (
                      <Link
                        to="/dashboard/my-contests"
                        onClick={() => setProfileDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        <HiPencil className="w-4 h-4" />
                        My Contests
                      </Link>
                    )}

                    {/* User links */}
                    <Link
                      to="/dashboard/participated"
                      onClick={() => setProfileDropdown(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <HiStar className="w-4 h-4" />
                      My Participations
                    </Link>

                    {/* Apply as Creator - only show for regular users */}
                    {dbUser.role === 'user' && dbUser.creatorStatus !== 'pending' && (
                      <Link
                        to="/dashboard/apply-creator"
                        onClick={() => setProfileDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                      >
                        <HiBadgeCheck className="w-4 h-4" />
                        Apply as Creator
                      </Link>
                    )}

                    {/* Admin-specific links */}
                    {dbUser.role === 'admin' && (
                      <Link
                        to="/dashboard/manage-users"
                        onClick={() => setProfileDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        <HiUserGroup className="w-4 h-4" />
                        Manage Users
                      </Link>
                    )}

                    {/* Divider */}
                    <div className="my-1 border-t border-[var(--border-color)]" />

                    <button
                      onClick={handleLogout}
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
              className="p-2.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors shadow-sm"
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
              className="p-2.5 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors shadow-sm border border-[var(--border-color)]"
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
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] pb-6' : 'max-h-0'
            }`}
        >
          <div className="flex flex-col gap-2 pt-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <div className="flex gap-2 mt-4 pt-4 border-t border-[var(--border-color)]">
              {isAuthenticated && dbUser ? (
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
                    onClick={handleLogout}
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