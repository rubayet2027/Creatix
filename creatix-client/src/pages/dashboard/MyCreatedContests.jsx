import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { contestsAPI } from '../../api';
import { HiPencil, HiTrash, HiEye, HiClock, HiCheckCircle, HiXCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const MyCreatedContests = () => {
    const queryClient = useQueryClient();

    const { data: contests = [], isLoading } = useQuery({
        queryKey: ['my-created-contests'],
        queryFn: async () => {
            const response = await contestsAPI.getMyContests();
            return response.data;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: contestsAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['my-created-contests']);
            toast.success('Contest deleted successfully');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to delete contest');
        },
    });

    const handleDelete = async (id, name) => {
        const result = await Swal.fire({
            title: 'Delete Contest?',
            text: `Are you sure you want to delete "${name}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            deleteMutation.mutate(id);
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

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Created Contests</h1>
                <Link
                    to="/dashboard/add-contest"
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                    + Add New Contest
                </Link>
            </div>

            {contests.length === 0 ? (
                <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-12 text-center">
                    <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiClock className="w-8 h-8 text-primary-500" />
                    </div>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No Contests Yet</h2>
                    <p className="text-[var(--text-secondary)] mb-6">Create your first contest and start engaging creators!</p>
                    <Link
                        to="/dashboard/add-contest"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors"
                    >
                        Create Contest
                    </Link>
                </div>
            ) : (
                <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[var(--border-color)]">
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Contest</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Prize</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-[var(--text-secondary)]">Participants</th>
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
                                            <span className="text-[var(--text-primary)] font-medium">
                                                ${contest.prizeMoney?.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-[var(--text-primary)]">
                                                {contest.participantsCount || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(contest.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Link
                                                    to={`/dashboard/submissions/${contest._id}`}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                    title="View Submissions"
                                                >
                                                    <HiEye className="w-5 h-5" />
                                                </Link>
                                                {contest.status === 'pending' && (
                                                    <>
                                                        <Link
                                                            to={`/dashboard/edit-contest/${contest._id}`}
                                                            className="p-2 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                                                            title="Edit Contest"
                                                        >
                                                            <HiPencil className="w-5 h-5" />
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(contest._id, contest.name)}
                                                            className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                            title="Delete Contest"
                                                        >
                                                            <HiTrash className="w-5 h-5" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyCreatedContests;
