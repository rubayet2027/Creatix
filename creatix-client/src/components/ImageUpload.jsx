import { useState, useRef } from 'react';
import { HiPhotograph, HiX, HiCloudUpload } from 'react-icons/hi';
import toast from 'react-hot-toast';

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

const ImageUpload = ({ value, onChange, className = '' }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const uploadImage = async (file) => {
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size must be less than 5MB');
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                onChange(data.data.display_url);
                toast.success('Image uploaded successfully!');
            } else {
                throw new Error(data.error?.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Image upload error:', error);
            toast.error('Failed to upload image');
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            uploadImage(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            uploadImage(file);
        }
    };

    const handleRemove = () => {
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={className}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="image-upload"
            />

            {value ? (
                <div className="relative group">
                    <img
                        src={value}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-xl border border-[var(--border-color)]"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                        <HiX className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                        w-full h-48 flex flex-col items-center justify-center gap-3
                        border-2 border-dashed rounded-xl cursor-pointer transition-all
                        ${isDragging
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-[var(--border-color)] hover:border-primary-400 hover:bg-[var(--bg-tertiary)]'
                        }
                        ${isUploading ? 'opacity-50 cursor-wait' : ''}
                    `}
                >
                    {isUploading ? (
                        <>
                            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
                            <p className="text-sm text-[var(--text-secondary)]">Uploading...</p>
                        </>
                    ) : (
                        <>
                            <div className="p-3 bg-[var(--bg-tertiary)] rounded-xl">
                                <HiCloudUpload className="w-8 h-8 text-primary-500" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-medium text-[var(--text-primary)]">
                                    Drop your image here, or{' '}
                                    <span className="text-primary-500">browse</span>
                                </p>
                                <p className="text-xs text-[var(--text-muted)] mt-1">
                                    PNG, JPG, GIF up to 5MB
                                </p>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
