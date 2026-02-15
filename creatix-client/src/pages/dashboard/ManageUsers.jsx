import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI } from '../../api';
import { HiUser, HiMail, HiShieldCheck, HiUserGroup, HiCheck, HiX, HiClock, HiBan, HiTrash, HiFilter } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ManageUsers = () => {
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState('all'); // 'all' or 'pending'
    const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'user', 'creator', 'admin'
    const queryClient = useQueryClient();
    const limit = 10;

    // Fetch all users
    const { data, isLoading } = useQuery({
        queryKey: ['admin-users', page],
        queryFn: async () => {
            const response = await usersAPI.getAll({ page, limit });
            return response.data;
        },
    });

    // Fetch pending creator requests
    const { data: pendingData, isLoading: pendingLoading } = useQuery({
        queryKey: ['pending-creator-requests'],
        queryFn: async () => {
            const response = await usersAPI.getPendingCreatorRequests();
            return response.data;
        },
    });

    const updateRoleMutation = useMutation({
        mutationFn: ({ id, role }) => usersAPI.updateRole(id, role),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-users']);
            queryClient.invalidateQueries(['pending-creator-requests']);
            toast.success('User role updated successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update role');
        },
    });

    const approveCreatorMutation = useMutation({
        mutationFn: (userId) => usersAPI.approveCreator(userId),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-users']);
            queryClient.invalidateQueries(['pending-creator-requests']);
            toast.success('Creator request approved!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to approve creator');
        },
    });

    const rejectCreatorMutation = useMutation({
        mutationFn: (userId) => usersAPI.rejectCreator(userId),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-users']);
            queryClient.invalidateQueries(['pending-creator-requests']);
            toast.success('Creator request rejected');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to reject request');
        },
    });

    const banUserMutation = useMutation({
        mutationFn: (userId) => usersAPI.ban(userId),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-users']);
            toast.success('User banned successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to ban user');
        },
    });

    const unbanUserMutation = useMutation({
        mutationFn: (userId) => usersAPI.unban(userId),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-users']);
            toast.success('User unbanned successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to unban user');
        },
    });

    const deleteUserMutation = useMutation({
        mutationFn: (userId) => usersAPI.delete(userId),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-users']);
            toast.success('User deleted successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        },
    });

    const handleRoleChange = async (user, newRole) => {
        if (newRole === user.role) return;

        const result = await Swal.fire({
            title: 'Change User Role?',
            html: `Change <strong>${user.name}</strong>'s role to <strong>${newRole}</strong>?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#8b5cf6',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, change it!',
        });

        if (result.isConfirmed) {
            updateRoleMutation.mutate({ id: user._id, role: newRole });
        }
    };

    const handleApproveCreator = async (user) => {
        const result = await Swal.fire({
            title: 'Approve Creator Request?',
            html: `Approve <strong>${user.name}</strong> as a Contest Creator? They will be able to create and manage contests.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, approve!',
        });

        if (result.isConfirmed) {
            approveCreatorMutation.mutate(user._id);
        }
    };

    const handleRejectCreator = async (user) => {
        const result = await Swal.fire({
            title: 'Reject Creator Request?',
            html: `Reject <strong>${user.name}</strong>'s creator application?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, reject',
        });

        if (result.isConfirmed) {
            rejectCreatorMutation.mutate(user._id);
        }
    };

    const handleBanUser = async (user) => {
        const result = await Swal.fire({
            title: 'Ban User?',
            html: `Are you sure you want to ban <strong>${user.name}</strong>? They will not be able to access the platform.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, ban user',
        });

        if (result.isConfirmed) {
            banUserMutation.mutate(user._id);
        }
    };

    const handleUnbanUser = async (user) => {
        const result = await Swal.fire({
            title: 'Unban User?',
            html: `Are you sure you want to unban <strong>${user.name}</strong>? They will regain access to the platform.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, unban user',
        });

        if (result.isConfirmed) {
            unbanUserMutation.mutate(user._id);
        }
    };

    const handleDeleteUser = async (user) => {
        const result = await Swal.fire({
            title: 'Delete User?',
            html: `<strong class="text-red-500">This action cannot be undone!</strong><br><br>Are you sure you want to permanently delete <strong>${user.name}</strong>'s account?`,
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete permanently',
            input: 'text',
            inputPlaceholder: 'Type DELETE to confirm',
            inputValidator: (value) => {
                if (value !== 'DELETE') {
                    return 'Please type DELETE to confirm';
                }
            },
        });

        if (result.isConfirmed) {
            deleteUserMutation.mutate(user._id);
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 text-sm font-medium rounded-full">
                        <HiShieldCheck className="w-4 h-4" />
                        Admin
                    </span>
                );
            case 'creator':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-600 text-sm font-medium rounded-full">
                        <HiUserGroup className="w-4 h-4" />
                        Creator
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-600 text-sm font-medium rounded-full">
                        <HiUser className="w-4 h-4" />
                        User
                    </span>
                );
        }
    };

    const getStatusBadge = (status) => {
        if (status === 'banned') {
            return (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 text-xs font-medium rounded-full">
                    <HiBan className="w-3 h-3" />
                    Banned
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 text-xs font-medium rounded-full">
                <HiCheck className="w-3 h-3" />
                Active
            </span>
        );
    };

    const getCreatorStatusBadge = (user) => {
        if (user.role === 'creator' || user.role === 'admin') return null;
        
        switch (user.creatorStatus) {
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 text-xs font-medium rounded-full">
                        <HiClock className="w-3 h-3" />
                        Pending
                    </span>
                );
            case 'approved':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-600 text-xs font-medium rounded-full">
                        <HiCheck className="w-3 h-3" />
                        Approved
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 text-xs font-medium rounded-full">
                        <HiX className="w-3 h-3" />
                        Rejected
                    </span>
                );
            default:
                return null;
        }
    };

    if (isLoading || pendingLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    const { users = [], pagination } = data || {};
    const pendingRequests = pendingData?.users || [];

    // Filter users by role
    const filteredUsers = roleFilter === 'all' 
        ? users 
        : users.filter(user => user.role === roleFilter);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Manage Users</h1>
                <div className="flex flex-wrap items-center gap-3">
                    {pendingRequests.length > 0 && (
                        <span className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 rounded-lg text-sm font-medium">
                            {pendingRequests.length} Pending Requests
                        </span>
                    )}
                    <span className="px-4 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-600 rounded-lg text-sm font-medium">
                        {pagination?.total || 0} Total Users
                    </span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-[var(--border-color)]">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                        activeTab === 'all'
                            ? 'border-primary-600 text-primary-600'
                            : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                >
                    All Users
                </button>
                <button
                    onClick={() => setActiveTab('pending')}
                    className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px flex items-center gap-2 ${
                        activeTab === 'pending'
                            ? 'border-primary-600 text-primary-600'
                            : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                    }`}
                >
                    Creator Requests
                    {pendingRequests.length > 0 && (
                        <span className="px-2 py-0.5 bg-yellow-500 text-white text-xs rounded-full">
                            {pendingRequests.length}
                        </span>
                    )}
                </button>

                {/* Role Filter - Only shown on All Users tab */}
                {activeTab === 'all' && (
                    <div className="ml-auto flex items-center gap-2 py-2">
                        <HiFilter className="w-4 h-4 text-[var(--text-secondary)]" />
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-3 py-1.5 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            <option value="all">All Roles</option>
                            <option value="admin">Admins</option>
                            <option value="creator">Creators</option>
                            <option value="user">Users</option>
                        </select>
                    </div>
                )}
            </div>

            {activeTab === 'pending' ? (
                // Pending Creator Requests Tab
                <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
                    {pendingRequests.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <HiClock className="w-12 h-12 mx-auto text-[var(--text-muted)] mb-4" />
                            <p className="text-[var(--text-secondary)]">No pending creator requests</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[var(--border-color)]">
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">User</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Email</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Requested</th>
                                        <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendingRequests.map((user) => (
                                        <tr key={user._id} className="border-b border-[var(--border-color)] last:border-0">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold overflow-hidden">
                                                        {user.photo ? (
                                                            <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            user.name?.charAt(0) || 'U'
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-[var(--text-primary)]">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[var(--text-secondary)] flex items-center gap-2">
                                                    <HiMail className="w-4 h-4" />
                                                    {user.email}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-[var(--text-muted)]">
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleApproveCreator(user)}
                                                        disabled={approveCreatorMutation.isPending}
                                                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                                                    >
                                                        <HiCheck className="w-4 h-4" />
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectCreator(user)}
                                                        disabled={rejectCreatorMutation.isPending}
                                                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                                                    >
                                                        <HiX className="w-4 h-4" />
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : (
                // All Users Tab
                <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[var(--border-color)]">
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">User</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Email</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Role</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Creator Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user._id} className={`border-b border-[var(--border-color)] last:border-0 ${user.status === 'banned' ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold overflow-hidden ${user.status === 'banned' ? 'opacity-50 grayscale' : ''}`}>
                                                    {user.photo ? (
                                                        <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        user.name?.charAt(0) || 'U'
                                                    )}
                                                </div>
                                                <span className={`font-medium text-[var(--text-primary)] ${user.status === 'banned' ? 'line-through opacity-60' : ''}`}>{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[var(--text-secondary)] flex items-center gap-2">
                                                <HiMail className="w-4 h-4" />
                                                {user.email}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getRoleBadge(user.role)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(user.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {getCreatorStatusBadge(user) || (
                                                <span className="text-[var(--text-muted)] text-sm">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {user.creatorStatus === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApproveCreator(user)}
                                                            disabled={approveCreatorMutation.isPending}
                                                            className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors disabled:opacity-50"
                                                            title="Approve Creator"
                                                        >
                                                            <HiCheck className="w-3 h-3" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleRejectCreator(user)}
                                                            disabled={rejectCreatorMutation.isPending}
                                                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors disabled:opacity-50"
                                                            title="Reject Request"
                                                        >
                                                            <HiX className="w-3 h-3" />
                                                        </button>
                                                    </>
                                                )}
                                                
                                                {/* Role Change Dropdown - Only for non-admin users */}
                                                {user.role !== 'admin' && (
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => handleRoleChange(user, e.target.value)}
                                                        disabled={updateRoleMutation.isPending || user.status === 'banned'}
                                                        className="px-2 py-1 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                                                    >
                                                        <option value="user">User</option>
                                                        <option value="creator">Creator</option>
                                                    </select>
                                                )}
                                                
                                                {/* Ban/Unban Button - Only for non-admin users */}
                                                {user.role !== 'admin' && (
                                                    <>
                                                        {user.status === 'banned' ? (
                                                            <button
                                                                onClick={() => handleUnbanUser(user)}
                                                                disabled={unbanUserMutation.isPending}
                                                                className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors disabled:opacity-50 flex items-center gap-1"
                                                                title="Unban User"
                                                            >
                                                                <HiCheck className="w-3 h-3" />
                                                                Unban
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleBanUser(user)}
                                                                disabled={banUserMutation.isPending}
                                                                className="px-2 py-1 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium rounded transition-colors disabled:opacity-50 flex items-center gap-1"
                                                                title="Ban User"
                                                            >
                                                                <HiBan className="w-3 h-3" />
                                                                Ban
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                                
                                                {/* Delete Button - Only for non-admin users */}
                                                {user.role !== 'admin' && (
                                                    <button
                                                        onClick={() => handleDeleteUser(user)}
                                                        disabled={deleteUserMutation.isPending}
                                                        className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors disabled:opacity-50"
                                                        title="Delete User"
                                                    >
                                                        <HiTrash className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination && pagination.pages > 1 && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--border-color)]">
                            <p className="text-sm text-[var(--text-secondary)]">
                                Page {pagination.page} of {pagination.pages}
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                                    disabled={page === pagination.pages}
                                    className="px-4 py-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-lg hover:bg-[var(--bg-primary)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageUsers;
