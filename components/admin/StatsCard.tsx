import React from 'react';
import { LayoutDashboard, BookOpen, Users, ShoppingCart, Settings, TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    color?: 'blue' | 'green' | 'purple' | 'orange';
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, trend, color = 'blue' }) => {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        purple: 'bg-purple-100 text-purple-600',
        orange: 'bg-orange-100 text-orange-600'
    };

    return (
        <div className="bg-white rounded-xl p-6 border-2 border-slate-200 hover:border-blue-500 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    {icon}
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-sm font-semibold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {trend.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                        {trend.value}
                    </div>
                )}
            </div>
            <h3 className="text-slate-600 text-sm font-medium mb-1">{title}</h3>
            <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
    );
};
