import { useForm, Controller } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { contestsAPI } from '../../api';
import { HiPhotograph, HiCash, HiClipboard, HiCalendar, HiTag } from 'react-icons/hi';
import toast from 'react-hot-toast';
import ImageUpload from '../../components/ImageUpload';
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
    'Hackathon',
    'Competitive Programming',
    'UI/UX Design',
    'Logo Design',
    'Video Editing',
    'Photography',
    'Music Production',
    'App Development',
    'Data Science',
    'AI/ML Challenge',
];

const AddContest = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, control, formState: { errors }, watch } = useForm({
        defaultValues: {
            name: '',
            image: '',
            description: '',
            price: '',
            prizeMoney: '',
            taskInstruction: '',
            contestType: CONTEST_TYPES[0],
            startDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        },
    });

    const watchStartDate = watch('startDate');

    const createMutation = useMutation({
        mutationFn: contestsAPI.create,
        onSuccess: () => {
            toast.success('Contest created successfully! Waiting for admin approval.');
            navigate('/dashboard/my-contests');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to create contest');
        },
    });

    const onSubmit = (data) => {
        const formData = {
            ...data,
            price: parseFloat(data.price),
            prizeMoney: parseFloat(data.prizeMoney),
        };
        createMutation.mutate(formData);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Add New Contest</h1>

            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Contest Name */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Contest Name *
                        </label>
                        <input
                            {...register('name', { required: 'Contest name is required' })}
                            placeholder="Enter contest name"
                            className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            <HiPhotograph className="inline w-4 h-4 mr-1" />
                            Contest Image *
                        </label>
                        <Controller
                            name="image"
                            control={control}
                            rules={{ required: 'Contest image is required' }}
                            render={({ field }) => (
                                <ImageUpload
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                        {errors.image && (
                            <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>
                        )}
                    </div>

                    {/* Contest Type */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            <HiTag className="inline w-4 h-4 mr-1" />
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
                                <HiCash className="inline w-4 h-4 mr-1" />
                                Entry Price ($) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                {...register('price', {
                                    required: 'Entry price is required',
                                    min: { value: 0, message: 'Price must be positive' }
                                })}
                                placeholder="10.00"
                                className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            {errors.price && (
                                <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
                            )}
                        </div>

                        {/* Prize Money */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                <HiCash className="inline w-4 h-4 mr-1" />
                                Prize Money ($) *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                {...register('prizeMoney', {
                                    required: 'Prize money is required',
                                    min: { value: 0, message: 'Prize must be positive' }
                                })}
                                placeholder="500.00"
                                className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                            {errors.prizeMoney && (
                                <p className="text-red-500 text-sm mt-1">{errors.prizeMoney.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Start Date and End Date */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Start Date */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                <HiCalendar className="inline w-4 h-4 mr-1" />
                                Start Date *
                            </label>
                            <Controller
                                control={control}
                                name="startDate"
                                rules={{ required: 'Start date is required' }}
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
                            {errors.startDate && (
                                <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
                            )}
                        </div>

                        {/* End Date (Deadline) */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                                <HiCalendar className="inline w-4 h-4 mr-1" />
                                End Date (Deadline) *
                            </label>
                            <Controller
                                control={control}
                                name="deadline"
                                rules={{ 
                                    required: 'End date is required',
                                    validate: value => !watchStartDate || new Date(value) > new Date(watchStartDate) || 'End date must be after start date'
                                }}
                                render={({ field }) => (
                                    <DatePicker
                                        selected={field.value}
                                        onChange={(date) => field.onChange(date)}
                                        showTimeSelect
                                        dateFormat="MMMM d, yyyy h:mm aa"
                                        minDate={watchStartDate || new Date()}
                                        className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                    />
                                )}
                            />
                            {errors.deadline && (
                                <p className="text-red-500 text-sm mt-1">{errors.deadline.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            Description *
                        </label>
                        <textarea
                            {...register('description', { required: 'Description is required' })}
                            rows={4}
                            placeholder="Describe what this contest is about..."
                            className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Task Instructions */}
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                            <HiClipboard className="inline w-4 h-4 mr-1" />
                            Task Instructions *
                        </label>
                        <textarea
                            {...register('taskInstruction', { required: 'Task instructions are required' })}
                            rows={4}
                            placeholder="What should participants do? Be specific about requirements..."
                            className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        />
                        {errors.taskInstruction && (
                            <p className="text-red-500 text-sm mt-1">{errors.taskInstruction.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 border-t border-[var(--border-color)]">
                        <button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="w-full md:w-auto px-8 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 font-medium"
                        >
                            {createMutation.isPending ? 'Creating...' : 'Create Contest'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddContest;
