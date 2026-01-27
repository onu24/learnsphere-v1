import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Mail, Lock, Bell, Globe, Save } from 'lucide-react';

export const SettingsTab: React.FC = () => {
    const [settings, setSettings] = useState({
        siteName: 'LearnSphere',
        siteEmail: 'support@learnsphere.com',
        enableNotifications: true,
        enableRegistration: true,
        maintenanceMode: false,
    });

    const handleSave = () => {
        // Save settings logic here
        alert('Settings saved successfully!');
    };

    return (
        <div className="animate-slide-in-up">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <SettingsIcon className="text-blue-600" size={28} />
                    Platform Settings
                </h1>
                <p className="text-slate-600 mt-1">Manage your platform configuration</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Settings Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* General Settings */}
                    <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Globe size={20} />
                            General Settings
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Site Name
                                </label>
                                <input
                                    type="text"
                                    value={settings.siteName}
                                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Support Email
                                </label>
                                <input
                                    type="email"
                                    value={settings.siteEmail}
                                    onChange={(e) => setSettings({ ...settings, siteEmail: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Feature Toggles */}
                    <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Bell size={20} />
                            Feature Toggles
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-900">Email Notifications</p>
                                    <p className="text-sm text-slate-500">Send email notifications to users</p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, enableNotifications: !settings.enableNotifications })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.enableNotifications ? 'bg-blue-600' : 'bg-slate-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.enableNotifications ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-900">User Registration</p>
                                    <p className="text-sm text-slate-500">Allow new users to register</p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, enableRegistration: !settings.enableRegistration })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.enableRegistration ? 'bg-blue-600' : 'bg-slate-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.enableRegistration ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-slate-900">Maintenance Mode</p>
                                    <p className="text-sm text-slate-500">Put site in maintenance mode</p>
                                </div>
                                <button
                                    onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings.maintenanceMode ? 'bg-red-600' : 'bg-slate-300'
                                        }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        onClick={handleSave}
                        className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                        <Save size={20} />
                        Save Changes
                    </button>
                </div>

                {/* Quick Info */}
                <div className="space-y-6">
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
                        <h3 className="font-bold text-blue-900 mb-2">💡 Pro Tip</h3>
                        <p className="text-sm text-blue-700">
                            Regularly review your settings to ensure optimal platform performance and user experience.
                        </p>
                    </div>
                    <div className="bg-white rounded-xl border-2 border-slate-200 p-6">
                        <h3 className="font-bold text-slate-900 mb-4">Platform Info</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-600">Version</span>
                                <span className="font-semibold text-slate-900">1.0.0</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Last Updated</span>
                                <span className="font-semibold text-slate-900">Today</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-600">Status</span>
                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                    ● Online
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
