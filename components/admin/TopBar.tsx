import React from 'react';
import { Search, Bell, Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../App';

interface TopBarProps {
    onMenuClick: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
    const { user, logout } = useAuth();

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Left: Menu + Search */}
                <div className="flex items-center gap-4 flex-1">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden text-slate-600 hover:text-slate-900"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                        />
                    </div>
                </div>

                {/* Right: Notifications + Profile */}
                <div className="flex items-center gap-4">
                    <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-slate-900">{user?.username}</p>
                            <p className="text-xs text-slate-500">Administrator</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold">
                            {user?.username?.[0]?.toUpperCase()}
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
