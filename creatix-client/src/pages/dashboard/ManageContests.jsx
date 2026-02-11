import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contestsAPI } from '../../api';
import { HiCheck, HiX, HiTrash, HiClock, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ManageContests = () => {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const queryClient = useQueryClient();
    const limit = 10;

    const { data, isLoading } = useQuery({
        queryKey: ['admin-contests', page, statusFilter],
        queryFn: async () => {
            const response = await contestsAPI.getAdminAll({ page, limit, status: statusFilter });
            return response.data;
        },
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }) => contestsAPI.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-contests']);
            toast.success('Contest status updated');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update status');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: contestsAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-contests']);
            toast.success('Contest deleted');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete contest');
        },
    });

    const handleStatusChange = async (contest, newStatus) => {
        const actionText = newStatus === 'approved' ? 'approve' : 'reject';
        const result = await Swal.fire({
            title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} Contest?`,
            text: `Are you sure you want to ${actionText} "${contest.name}"?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: newStatus === 'approved' ? '#10b981' : '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: `Yes, ${actionText} it!`,
        });

        if (result.isConfirmed) {
            updateStatusMutation.mutate({ id: contest._id, status: newStatus });
        }
    };

    const handleDelete = async (contest) => {
        const result = await Swal.fire({
            title: 'Delete Contest?',
            text: `Are you sure you want to delete "${contest.name}"? This cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            deleteMutation.mutate(contest._id);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 text-sm rounded-full">
                        <HiCheckCircle className="w-4 h-4" />
                        Approved
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 text-sm rounded-full">
                        <HiXCircle className="w-4 h-4" />
                        Rejected
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/20 text-amber-600 text-sm rounded-full">
                        <HiClock className="w-4 h-4" />
                        Pending
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

    const { contests = [], pagination } = data || {};

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Manage Contests</h1>
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-[var(--border-color)]">
                                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Contest</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Creator</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Prize</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Status</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contests.map((contest) => (
                                <tr key={contest._id} className="border-b border-[var(--border-color)] last:border-0">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={contest.image}
                                                alt={contest.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div>
                                                <p className="font-medium text-[var(--text-primary)]">{contest.name}</p>
                                                <p className="text-sm text-[var(--text-secondary)]">{contest.contestType}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-[var(--text-primary)]">{contest.creator?.name}</p>
                                        <p className="text-sm text-[var(--text-secondary)]">{contest.creator?.email}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-[var(--text-primary)] font-medium">
                                            ${contest.prizeMoney?.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(contest.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {contest.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusChange(contest, 'approved')}
                                                        disabled={updateStatusMutation.isPending}
                                                        className="p-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <HiCheck className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusChange(contest, 'rejected')}
                                                        disabled={updateStatusMutation.isPending}
                                                        className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <HiX className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleDelete(contest)}
                                                disabled={deleteMutation.isPending}
                                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Delete"
                                            >
                                                <HiTrash className="w-5 h-5" />
                                            </button>
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
        </div>
    );
};

export default ManageContests;
