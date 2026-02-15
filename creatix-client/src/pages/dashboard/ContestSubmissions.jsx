import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionsAPI, contestsAPI } from '../../api';
import { HiUser, HiMail, HiLink, HiStar, HiArrowLeft } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ContestSubmissions = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();

    const { data: contest } = useQuery({
        queryKey: ['contest', id],
        queryFn: async () => {
            const response = await contestsAPI.getById(id);
            return response.data;
        },
    });

    const { data: submissions = [], isLoading } = useQuery({
        queryKey: ['submissions', id],
        queryFn: async () => {
            const response = await submissionsAPI.getByContest(id);
            return response.data;
        },
    });

    const declareWinnerMutation = useMutation({
        mutationFn: submissionsAPI.declareWinner,
        onSuccess: () => {
            queryClient.invalidateQueries(['submissions', id]);
            queryClient.invalidateQueries(['contest', id]);
            toast.success('Winner declared successfully!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to declare winner');
        },
    });

    const handleDeclareWinner = async (submissionId, participantName) => {
        const result = await Swal.fire({
            title: 'Declare Winner?',
            text: `Are you sure you want to declare ${participantName} as the winner? This action cannot be undone.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, declare winner!',
        });

        if (result.isConfirmed) {
            declareWinnerMutation.mutate(submissionId);
        }
    };

    const isDeadlinePassed = contest && new Date(contest.deadline) < new Date();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    to="/dashboard/my-contests"
                    className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                >
                    <HiArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Submissions</h1>
                    <p className="text-[var(--text-secondary)]">{contest?.name}</p>
                </div>
            </div>

            {/* Contest Info */}
            {contest && (
                <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6">
                    <div className="flex items-center gap-4">
                        <img
                            src={contest.image}
                            alt={contest.name}
                            className="w-20 h-20 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                            <h2 className="text-lg font-semibold text-[var(--text-primary)]">{contest.name}</h2>
                            <p className="text-[var(--text-secondary)]">
                                {submissions.length} Submission{submissions.length !== 1 ? 's' : ''} •
                                Prize: ${contest.prizeMoney?.toLocaleString()}
                            </p>
                            {contest.winnerDeclared && contest.winner && (
                                <p className="text-emerald-500 font-medium flex items-center gap-2 mt-2">
                                    <HiStar className="w-4 h-4" />
                                    Winner: {contest.winner.name}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Submissions List */}
            {submissions.length === 0 ? (
                <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-12 text-center">
                    <div className="w-16 h-16 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center mx-auto mb-4">
                        <HiUser className="w-8 h-8 text-[var(--text-muted)]" />
                    </div>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">No Submissions Yet</h2>
                    <p className="text-[var(--text-secondary)]">Participants haven't submitted their work yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {submissions.map((submission) => (
                        <div
                            key={submission._id}
                            className={`bg-[var(--bg-secondary)] rounded-2xl border ${submission.isWinner ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-[var(--border-color)]'
                                } p-6`}
                        >
                            <div className="flex flex-col md:flex-row md:items-start gap-6">
                                {/* Participant Info */}
                                <div className="flex items-center gap-4 flex-shrink-0">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xl font-bold overflow-hidden">
                                        {submission.participant?.photo ? (
                                            <img
                                                src={submission.participant.photo}
                                                alt={submission.participant.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            submission.participant?.name?.charAt(0) || 'U'
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                                            {submission.participant?.name}
                                            {submission.isWinner && (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500 text-white text-xs font-medium rounded-full">
                                                    <HiStar className="w-3 h-3" />
                                                    Winner
                                                </span>
                                            )}
                                        </p>
                                        <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1">
                                            <HiMail className="w-4 h-4" />
                                            {submission.participant?.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Submission Content */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[var(--text-secondary)] mb-2 flex items-center gap-1">
                                        <HiLink className="w-4 h-4" />
                                        Submitted Work
                                    </p>
                                    <div className="p-4 bg-[var(--bg-tertiary)] rounded-lg">
                                        <p className="text-[var(--text-primary)] whitespace-pre-wrap break-words">
                                            {submission.taskSubmission}
                                        </p>
                                    </div>
                                    <p className="text-xs text-[var(--text-muted)] mt-2">
                                        Submitted on {new Date(submission.createdAt).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                        })}
                                    </p>
                                </div>

                                {/* Actions */}
                                {isDeadlinePassed && !contest?.winnerDeclared && (
                                    <button
                                        onClick={() => handleDeclareWinner(submission._id, submission.participant?.name)}
                                        disabled={declareWinnerMutation.isPending}
                                        className="shrink-0 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 font-medium flex items-center gap-2"
                                    >
                                        <HiStar className="w-4 h-4" />
                                        Declare Winner
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContestSubmissions;
