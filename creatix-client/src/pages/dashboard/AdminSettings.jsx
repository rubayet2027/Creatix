import { useState } from 'react';
import { HiCog, HiShieldCheck, HiMail, HiGlobe, HiBell, HiColorSwatch } from 'react-icons/hi';
import { useTheme } from '../../theme/ThemeContext';
import toast from 'react-hot-toast';

const AdminSettings = () => {
    const { theme, toggleTheme } = useTheme();
    const [settings, setSettings] = useState({
        siteName: 'Creatix',
        siteDescription: 'The Ultimate Contest Platform',
        contactEmail: 'support@creatix.com',
        maintenanceMode: false,
        allowRegistrations: true,
        emailNotifications: true,
        maxFileUploadSize: 10,
        defaultContestDuration: 14,
        minEntryFee: 0,
        maxEntryFee: 1000,
    });

    const handleChange = (key, value) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        toast.success('Settings saved successfully!');
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Platform Settings</h1>
                <p className="text-[var(--text-secondary)]">Configure platform-wide settings and preferences</p>
            </div>

            {/* General Settings */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                        <HiGlobe className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">General Settings</h2>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Site Name</label>
                        <input
                            type="text"
                            value={settings.siteName}
                            onChange={(e) => handleChange('siteName', e.target.value)}
                            className="input-field max-w-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Site Description</label>
                        <input
                            type="text"
                            value={settings.siteDescription}
                            onChange={(e) => handleChange('siteDescription', e.target.value)}
                            className="input-field max-w-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Contact Email</label>
                        <input
                            type="email"
                            value={settings.contactEmail}
                            onChange={(e) => handleChange('contactEmail', e.target.value)}
                            className="input-field max-w-md"
                        />
                    </div>
                </div>
            </div>

            {/* Security Settings */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                        <HiShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">Security & Access</h2>
                </div>

                <div className="space-y-5">
                    <div className="flex items-center justify-between max-w-md">
                        <div>
                            <p className="font-medium text-[var(--text-primary)]">Maintenance Mode</p>
                            <p className="text-sm text-[var(--text-muted)]">Disable public access during maintenance</p>
                        </div>
                        <button
                            onClick={() => handleChange('maintenanceMode', !settings.maintenanceMode)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${settings.maintenanceMode ? 'bg-red-500' : 'bg-[var(--bg-tertiary)]'
                                }`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.maintenanceMode ? 'translate-x-6' : ''
                                    }`}
                            />
                        </button>
                    </div>

                    <div className="flex items-center justify-between max-w-md">
                        <div>
                            <p className="font-medium text-[var(--text-primary)]">Allow New Registrations</p>
                            <p className="text-sm text-[var(--text-muted)]">Allow new users to create accounts</p>
                        </div>
                        <button
                            onClick={() => handleChange('allowRegistrations', !settings.allowRegistrations)}
                            className={`relative w-12 h-6 rounded-full transition-colors ${settings.allowRegistrations ? 'bg-emerald-500' : 'bg-[var(--bg-tertiary)]'
                                }`}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.allowRegistrations ? 'translate-x-6' : ''
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center">
                        <HiBell className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">Notifications</h2>
                </div>

                <div className="flex items-center justify-between max-w-md">
                    <div>
                        <p className="font-medium text-[var(--text-primary)]">Email Notifications</p>
                        <p className="text-sm text-[var(--text-muted)]">Send email notifications for contest updates</p>
                    </div>
                    <button
                        onClick={() => handleChange('emailNotifications', !settings.emailNotifications)}
                        className={`relative w-12 h-6 rounded-full transition-colors ${settings.emailNotifications ? 'bg-emerald-500' : 'bg-[var(--bg-tertiary)]'
                            }`}
                    >
                        <span
                            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${settings.emailNotifications ? 'translate-x-6' : ''
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* Appearance */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                        <HiColorSwatch className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">Appearance</h2>
                </div>

                <div className="flex items-center justify-between max-w-md">
                    <div>
                        <p className="font-medium text-[var(--text-primary)]">Dark Mode</p>
                        <p className="text-sm text-[var(--text-muted)]">Current: {theme === 'dark' ? 'Dark' : 'Light'} theme</p>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className={`relative w-12 h-6 rounded-full transition-colors ${theme === 'dark' ? 'bg-primary-500' : 'bg-[var(--bg-tertiary)]'
                            }`}
                    >
                        <span
                            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${theme === 'dark' ? 'translate-x-6' : ''
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* Contest Defaults */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center">
                        <HiCog className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-lg font-bold text-[var(--text-primary)]">Contest Defaults</h2>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                            Default Contest Duration (days)
                        </label>
                        <input
                            type="number"
                            value={settings.defaultContestDuration}
                            onChange={(e) => handleChange('defaultContestDuration', Number(e.target.value))}
                            className="input-field max-w-32"
                            min={1}
                            max={90}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4 max-w-md">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Min Entry Fee ($)</label>
                            <input
                                type="number"
                                value={settings.minEntryFee}
                                onChange={(e) => handleChange('minEntryFee', Number(e.target.value))}
                                className="input-field"
                                min={0}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">Max Entry Fee ($)</label>
                            <input
                                type="number"
                                value={settings.maxEntryFee}
                                onChange={(e) => handleChange('maxEntryFee', Number(e.target.value))}
                                className="input-field"
                                min={0}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                            Max File Upload Size (MB)
                        </label>
                        <input
                            type="number"
                            value={settings.maxFileUploadSize}
                            onChange={(e) => handleChange('maxFileUploadSize', Number(e.target.value))}
                            className="input-field max-w-32"
                            min={1}
                            max={50}
                        />
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button onClick={handleSave} className="btn-primary px-8">
                    Save All Settings
                </button>
            </div>
        </div>
    );
};

export default AdminSettings;
