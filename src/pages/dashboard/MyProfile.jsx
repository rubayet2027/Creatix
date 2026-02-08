import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { usersAPI } from '../../api';
import { HiUser, HiMail, HiCamera, HiLocationMarker, HiPencil, HiSave } from 'react-icons/hi';
import toast from 'react-hot-toast';

const MyProfile = () => {
    const { dbUser, refreshUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const queryClient = useQueryClient();

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: dbUser?.name || '',
            photo: dbUser?.photo || '',
            bio: dbUser?.bio || '',
            address: dbUser?.address || '',
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data) => usersAPI.update(dbUser._id, data),
        onSuccess: async () => {
            await refreshUser();
            queryClient.invalidateQueries(['user']);
            setIsEditing(false);
            toast.success('Profile updated successfully!');
        },
        onError: () => {
            toast.error('Failed to update profile');
        },
    });

    const onSubmit = (data) => {
        updateMutation.mutate(data);
    };

    const handleCancel = () => {
        reset({
            name: dbUser?.name || '',
            photo: dbUser?.photo || '',
            bio: dbUser?.bio || '',
            address: dbUser?.address || '',
        });
        setIsEditing(false);
    };

    // Calculate win percentage
    const participated = dbUser?.contestsParticipated || 0;
    const won = dbUser?.contestsWon || 0;
    const winPercentage = participated > 0 ? Math.round((won / participated) * 100) : 0;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">My Profile</h1>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        <HiPencil className="w-4 h-4" />
                        Edit Profile
                    </button>
                )}
            </div>

            {/* Win Rate Chart */}
            <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 text-white">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="relative w-32 h-32">
                        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth="10"
                            />
                            <circle
                                cx="50"
                                cy="50"
                                r="45"
                                fill="none"
                                stroke="white"
                                strokeWidth="10"
                                strokeLinecap="round"
                                strokeDasharray={`${winPercentage * 2.83} 283`}
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-3xl font-bold">{winPercentage}%</span>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Win Rate</h2>
                        <p className="text-primary-100">
                            You've won {won} out of {participated} contests
                        </p>
                    </div>
                </div>
            </div>

            {/* Profile Form */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                            {dbUser?.photo ? (
                                <img src={dbUser.photo} alt={dbUser.name} className="w-full h-full object-cover" />
                            ) : (
                                dbUser?.name?.charAt(0) || 'U'
                            )}
                        </div>
                        <div>
                            <p className="font-semibold text-[var(--text-primary)]">{dbUser?.name}</p>
                            <p className="text-sm text-[var(--text-secondary)]">{dbUser?.email}</p>
                            <p className="text-sm text-primary-500 capitalize">{dbUser?.role}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                <HiUser className="inline w-4 h-4 mr-1" />
                                Full Name
                            </label>
                            <input
                                {...register('name', { required: 'Name is required' })}
                                disabled={!isEditing}
                                className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-60"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        {/* Email (read-only) */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                <HiMail className="inline w-4 h-4 mr-1" />
                                Email
                            </label>
                            <input
                                value={dbUser?.email || ''}
                                disabled
                                className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-secondary)] opacity-60"
                            />
                        </div>

                        {/* Photo URL */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                <HiCamera className="inline w-4 h-4 mr-1" />
                                Photo URL
                            </label>
                            <input
                                {...register('photo')}
                                disabled={!isEditing}
                                placeholder="https://example.com/photo.jpg"
                                className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-60"
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                <HiLocationMarker className="inline w-4 h-4 mr-1" />
                                Address
                            </label>
                            <input
                                {...register('address')}
                                disabled={!isEditing}
                                placeholder="Your address"
                                className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-60"
                            />
                        </div>

                        {/* Bio */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Bio
                            </label>
                            <textarea
                                {...register('bio')}
                                disabled={!isEditing}
                                rows={4}
                                placeholder="Tell us about yourself..."
                                className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-60 resize-none"
                            />
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex items-center gap-4 pt-4 border-t border-[var(--border-color)]">
                            <button
                                type="submit"
                                disabled={updateMutation.isPending}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
                            >
                                <HiSave className="w-4 h-4" />
                                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-6 py-3 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--bg-primary)] transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default MyProfile;
