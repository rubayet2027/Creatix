import { useState } from 'react';
import { HiTag, HiPencil, HiCheck, HiX } from 'react-icons/hi';

// These match the Contest model's contestType enum
const CONTEST_CATEGORIES = [
    { id: 1, name: 'Image Design', icon: '🎨', description: 'Create stunning visual designs, illustrations, and digital art', contestCount: 0, color: 'bg-pink-500' },
    { id: 2, name: 'Article Writing', icon: '✍️', description: 'Write compelling articles, blog posts, and creative pieces', contestCount: 0, color: 'bg-blue-500' },
    { id: 3, name: 'Marketing Strategy', icon: '📊', description: 'Develop innovative marketing plans and campaign strategies', contestCount: 0, color: 'bg-emerald-500' },
    { id: 4, name: 'Digital Advertisement', icon: '📱', description: 'Design digital ads for social media, web, and mobile platforms', contestCount: 0, color: 'bg-amber-500' },
    { id: 5, name: 'Gaming Review', icon: '🎮', description: 'Write in-depth reviews and analysis of video games', contestCount: 0, color: 'bg-red-500' },
    { id: 6, name: 'Book Review', icon: '📚', description: 'Review and analyze books across all genres', contestCount: 0, color: 'bg-indigo-500' },
    { id: 7, name: 'Business Idea', icon: '💡', description: 'Pitch innovative business ideas and startup concepts', contestCount: 0, color: 'bg-yellow-500' },
    { id: 8, name: 'Movie Review', icon: '🎬', description: 'Create engaging movie reviews and film critiques', contestCount: 0, color: 'bg-purple-500' },
    { id: 9, name: 'Hackathon', icon: '💻', description: 'Build software solutions within time constraints', contestCount: 0, color: 'bg-cyan-500' },
    { id: 10, name: 'Competitive Programming', icon: '🧑‍💻', description: 'Solve algorithmic challenges and coding problems', contestCount: 0, color: 'bg-slate-500' },
    { id: 11, name: 'UI/UX Design', icon: '🖥️', description: 'Design user interfaces and user experience flows', contestCount: 0, color: 'bg-violet-500' },
    { id: 12, name: 'Logo Design', icon: '✨', description: 'Create unique brand logos and visual identities', contestCount: 0, color: 'bg-fuchsia-500' },
    { id: 13, name: 'Video Editing', icon: '🎥', description: 'Edit and produce professional quality videos', contestCount: 0, color: 'bg-orange-500' },
    { id: 14, name: 'Photography', icon: '📸', description: 'Capture stunning photographs across various themes', contestCount: 0, color: 'bg-teal-500' },
    { id: 15, name: 'Music Production', icon: '🎵', description: 'Compose and produce original music tracks', contestCount: 0, color: 'bg-rose-500' },
    { id: 16, name: 'App Development', icon: '📲', description: 'Build mobile and web applications', contestCount: 0, color: 'bg-lime-500' },
    { id: 17, name: 'Data Science', icon: '📈', description: 'Analyze data and build predictive models', contestCount: 0, color: 'bg-sky-500' },
    { id: 18, name: 'AI/ML Challenge', icon: '🤖', description: 'Develop AI and machine learning solutions', contestCount: 0, color: 'bg-stone-500' },
];

const AdminCategories = () => {
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');

    const handleEdit = (cat) => {
        setEditingId(cat.id);
        setEditValue(cat.description);
    };

    const handleSave = () => {
        // In a production app, this would save to backend
        setEditingId(null);
        setEditValue('');
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Contest Categories</h1>
                <p className="text-[var(--text-secondary)]">
                    Manage the {CONTEST_CATEGORIES.length} available contest categories on the platform
                </p>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {CONTEST_CATEGORIES.map((cat) => (
                    <div
                        key={cat.id}
                        className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-5 hover:border-[var(--border-strong)] transition-colors"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 ${cat.color} rounded-xl flex items-center justify-center text-lg`}>
                                    {cat.icon}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-[var(--text-primary)]">{cat.name}</h3>
                                    <span className="text-xs text-[var(--text-muted)]">
                                        <HiTag className="inline w-3 h-3 mr-1" />
                                        Category #{cat.id}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => editingId === cat.id ? handleSave() : handleEdit(cat)}
                                className="p-1.5 rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                            >
                                {editingId === cat.id ? (
                                    <HiCheck className="w-4 h-4 text-emerald-500" />
                                ) : (
                                    <HiPencil className="w-4 h-4 text-[var(--text-muted)]" />
                                )}
                            </button>
                        </div>

                        {editingId === cat.id ? (
                            <div className="flex items-start gap-2">
                                <textarea
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    rows={2}
                                    className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-primary-500 resize-none"
                                />
                                <button
                                    onClick={() => { setEditingId(null); setEditValue(''); }}
                                    className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
                                >
                                    <HiX className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        ) : (
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                {cat.description}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminCategories;
