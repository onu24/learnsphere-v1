import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, ShoppingCart, Settings, X } from 'lucide-react';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    activeTab?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeTab = 'dashboard' }) => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin#dashboard', id: 'dashboard' },
        { icon: BookOpen, label: 'Courses', path: '/admin#courses', id: 'courses' },
        { icon: Users, label: 'Users', path: '/admin#users', id: 'users' },
        { icon: ShoppingCart, label: 'Purchases', path: '/admin#purchases', id: 'purchases' },
        { icon: Settings, label: 'Settings', path: '/admin#settings', id: 'settings' }
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-slate-200 z-50
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                            L
                        </div>
                        <span className="font-bold text-slate-900">Admin Panel</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="lg:hidden text-slate-500 hover:text-slate-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = activeTab === item.id;
                        return (
                            <a
                                key={item.path}
                                href={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium ${isActive
                                        ? 'bg-blue-50 text-blue-600 border-2 border-blue-500 shadow-sm'
                                        : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600 border-2 border-transparent'
                                    }`}
                                onClick={() => onClose()}
                            >
                                <item.icon size={20} />
                                {item.label}
                            </a>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
};
