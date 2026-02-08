import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    HiHome,
    HiTrophy,
    HiUser,
    HiPlus,
    HiCollection,
    HiClipboardList,
    HiUserGroup,
    HiCog,
    HiLogout,
    HiArrowLeft
} from 'react-icons/hi';
import Container from '../components/layout/Container';

const DashboardLayout = () => {
    const { dbUser, logout, isAdmin, isCreator } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    // User navigation items
    const userNavItems = [
        { to: '/dashboard', icon: HiHome, label: 'Overview', end: true },
        { to: '/dashboard/participated', icon: HiCollection, label: 'My Contests' },
        { to: '/dashboard/winning', icon: HiTrophy, label: 'Winnings' },
        { to: '/dashboard/profile', icon: HiUser, label: 'Profile' },
    ];

    // Creator navigation items
    const creatorNavItems = [
        { to: '/dashboard/add-contest', icon: HiPlus, label: 'Add Contest' },
        { to: '/dashboard/my-contests', icon: HiClipboardList, label: 'My Contests' },
    ];

    // Admin navigation items
    const adminNavItems = [
        { to: '/dashboard/manage-users', icon: HiUserGroup, label: 'Manage Users' },
        { to: '/dashboard/manage-contests', icon: HiCog, label: 'Manage Contests' },
    ];

    const NavItem = ({ to, icon: Icon, label, end }) => (
        <NavLink
            to={to}
            end={end}
            className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)]'
                }`
            }
        >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
        </NavLink>
    );

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <Container>
                <div className="flex gap-8 py-8">
                    {/* Sidebar */}
                    <aside className="hidden lg:block w-64 shrink-0">
                        <div className="sticky top-24 bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6">
                            {/* User Info */}
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[var(--border-color)]">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-lg">
                                    {dbUser?.name?.charAt(0) || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-[var(--text-primary)] truncate">
                                        {dbUser?.name || 'User'}
                                    </p>
                                    <p className="text-sm text-[var(--text-secondary)] capitalize">
                                        {dbUser?.role || 'user'}
                                    </p>
                                </div>
                            </div>

                            {/* Navigation */}
                            <nav className="space-y-2">
                                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                                    Dashboard
                                </p>
                                {userNavItems.map((item) => (
                                    <NavItem key={item.to} {...item} />
                                ))}

                                {isCreator && (
                                    <>
                                        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mt-6 mb-3">
                                            Creator
                                        </p>
                                        {creatorNavItems.map((item) => (
                                            <NavItem key={item.to} {...item} />
                                        ))}
                                    </>
                                )}

                                {isAdmin && (
                                    <>
                                        <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mt-6 mb-3">
                                            Admin
                                        </p>
                                        {adminNavItems.map((item) => (
                                            <NavItem key={item.to} {...item} />
                                        ))}
                                    </>
                                )}

                                {/* Actions */}
                                <div className="pt-6 mt-6 border-t border-[var(--border-color)] space-y-2">
                                    <NavLink
                                        to="/"
                                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] transition-all"
                                    >
                                        <HiArrowLeft className="w-5 h-5" />
                                        <span className="font-medium">Back to Home</span>
                                    </NavLink>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                                    >
                                        <HiLogout className="w-5 h-5" />
                                        <span className="font-medium">Logout</span>
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        <Outlet />
                    </main>
                </div>
            </Container>
        </div>
    );
};

export default DashboardLayout;
