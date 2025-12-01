import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, CheckCircle, Clock, XCircle, DollarSign } from 'lucide-react';
import * as DB from '../../services/firebase';
import { Transaction } from '../../types';

export const PurchasesTab: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'pending'>('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTransactions();
    }, []);

    const loadTransactions = async () => {
        try {
            const txs = await DB.getTransactions();
            setTransactions(txs);
        } catch (error) {
            console.error('Failed to load transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = transactions.filter(tx => {
        const matchesSearch =
            tx.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tx.courseId.toString().includes(searchQuery);
        const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const totalRevenue = transactions
        .filter(tx => tx.status === 'confirmed')
        .reduce((sum, tx) => sum + tx.amount, 0);

    const pendingCount = transactions.filter(tx => tx.status === 'pending').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="animate-slide-in-up">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 mb-4">
                    <ShoppingBag className="text-blue-600" size={28} />
                    Purchases & Transactions
                </h1>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl border-2 border-slate-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                                <DollarSign size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Total Revenue</p>
                                <p className="text-2xl font-bold text-slate-900">₹{totalRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border-2 border-slate-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Completed</p>
                                <p className="text-2xl font-bold text-slate-900">{transactions.filter(tx => tx.status === 'confirmed').length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl border-2 border-slate-200 p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600">Pending</p>
                                <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border-2 border-slate-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by user ID or course ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                        />
                    </div>
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as any)}
                        className="px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Transaction ID
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Course
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {filteredTransactions.map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-sm text-slate-600">{tx.id}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-900">{tx.userId}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-slate-900">Course #{tx.courseId}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-semibold text-slate-900">₹{tx.amount}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${tx.status === 'confirmed'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-orange-100 text-orange-700'
                                            }`}>
                                            {tx.status === 'confirmed' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-slate-600">
                                            {new Date(tx.timestamp).toLocaleDateString()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
