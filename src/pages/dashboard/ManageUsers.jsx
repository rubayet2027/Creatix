import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersAPI } from '../../api';
import { HiUser, HiMail, HiShieldCheck, HiUserGroup } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ManageUsers = () => {
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();
    const limit = 10;

    const { data, isLoading } = useQuery({
        queryKey: ['admin-users', page],
        queryFn: async () => {
            const response = await usersAPI.getAll({ page, limit });
            return response.data;
        },
    });

    const updateRoleMutation = useMutation({
        mutationFn: ({ id, role }) => usersAPI.updateRole(id, role),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-users']);
            toast.success('User role updated successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update role');
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    const { users = [], pagination } = data || {};

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Manage Users</h1>
                <span className="px-4 py-2 bg-primary-100 dark:bg-primary-900/20 text-primary-600 rounded-lg text-sm font-medium">
                    {pagination?.total || 0} Total Users
                </span>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--border-color)]">
                                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">User</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Email</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Current Role</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Change Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
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
                                        {getRoleBadge(user.role)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user, e.target.value)}
                                            disabled={updateRoleMutation.isPending}
                                            className="px-3 py-2 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                        >
                                            <option value="user">User</option>
                                            <option value="creator">Creator</option>
                                            <option value="admin">Admin</option>
                                        </select>
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
        </div>
    );
};

export default ManageUsers;
