import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import { contestsAPI } from '../../api';
import { HiArrowLeft } from 'react-icons/hi';
import toast from 'react-hot-toast';
import 'react-datepicker/dist/react-datepicker.css';

const CONTEST_TYPES = [
    'Image Design',
    'Article Writing',
    'Marketing Strategy',
    'Digital Advertisement',
    'Gaming Review',
    'Book Review',
    'Business Idea',
    'Movie Review',
];

const EditContest = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: contest, isLoading } = useQuery({
        queryKey: ['contest', id],
        queryFn: async () => {
            const response = await contestsAPI.getById(id);
            return response.data;
        },
    });

    const { register, handleSubmit, control, formState: { errors } } = useForm({
        values: contest ? {
            name: contest.name,
            image: contest.image,
            description: contest.description,
            price: contest.price,
            prizeMoney: contest.prizeMoney,
            taskInstruction: contest.taskInstruction,
            contestType: contest.contestType,
            deadline: new Date(contest.deadline),
        } : undefined,
    });

    const updateMutation = useMutation({
        mutationFn: (data) => contestsAPI.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(['contest', id]);
            queryClient.invalidateQueries(['my-created-contests']);
            toast.success('Contest updated successfully!');
            navigate('/dashboard/my-contests');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update contest');
        },
    });

    const onSubmit = (data) => {
        const formData = {
            ...data,
            price: parseFloat(data.price),
            prizeMoney: parseFloat(data.prizeMoney),
        };
        updateMutation.mutate(formData);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!contest) {
        return (
            <div className="text-center py-20">
                <p className="text-[var(--text-secondary)]">Contest not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] rounded-lg transition-colors"
                >
                    <HiArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Edit Contest</h1>
            </div>

            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Contest Name */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Contest Name *
                        </label>
                        <input
                            {...register('name', { required: 'Contest name is required' })}
                            className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Contest Image URL *
                        </label>
                        <input
                            {...register('image', { required: 'Image URL is required' })}
                            className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
                    </div>

                    {/* Contest Type */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Contest Type *
                        </label>
                        <select
                            {...register('contestType', { required: 'Contest type is required' })}
                            className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                            {CONTEST_TYPES.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Entry Price */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Entry Price ($) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('price', { required: 'Entry price is required' })}
                                className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                        </div>

                        {/* Prize Money */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                Prize Money ($) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('prizeMoney', { required: 'Prize money is required' })}
                                className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            {errors.prizeMoney && <p className="text-red-500 text-sm mt-1">{errors.prizeMoney.message}</p>}
                        </div>
                    </div>

                    {/* Deadline */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Deadline *
                        </label>
                        <Controller
                            control={control}
                            name="deadline"
                            rules={{ required: 'Deadline is required' }}
                            render={({ field }) => (
                                <DatePicker
                                    selected={field.value}
                                    onChange={(date) => field.onChange(date)}
                                    showTimeSelect
                                    dateFormat="MMMM d, yyyy h:mm aa"
                                    minDate={new Date()}
                                    className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                />
                            )}
                        />
                        {errors.deadline && <p className="text-red-500 text-sm mt-1">{errors.deadline.message}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Description *
                        </label>
                        <textarea
                            {...register('description', { required: 'Description is required' })}
                            rows={4}
                            className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                    </div>

                    {/* Task Instructions */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Task Instructions *
                        </label>
                        <textarea
                            {...register('taskInstruction', { required: 'Task instructions are required' })}
                            rows={4}
                            className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        />
                        {errors.taskInstruction && <p className="text-red-500 text-sm mt-1">{errors.taskInstruction.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-[var(--border-color)] flex gap-4">
                        <button
                            type="submit"
                            disabled={updateMutation.isPending}
                            className="px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 font-medium"
                        >
                            {updateMutation.isPending ? 'Updating...' : 'Update Contest'}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-8 py-3 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-xl hover:bg-[var(--bg-primary)] transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditContest;
