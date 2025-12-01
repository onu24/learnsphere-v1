import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { Sidebar } from '../components/admin/Sidebar';
import { TopBar } from '../components/admin/TopBar';
import { CoursesTab } from '../components/admin/CoursesTab';
import { UsersTab } from '../components/admin/UsersTab';
import { PurchasesTab } from '../components/admin/PurchasesTab';
import { SettingsTab } from '../components/admin/SettingsTab';
import { CourseTable } from '../components/admin/CourseTable';
import { StatsCard } from '../components/admin/StatsCard';
import { Users, BookOpen, DollarSign, Activity, Plus, UserPlus, ShoppingBag } from 'lucide-react';
import * as DB from '../services/firebase';
import { Course, User } from '../types';

export const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [courses, setCourses] = useState<Course[]>([]);
    const [showCourseForm, setShowCourseForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);

    // Stats state
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);

    const [newCourse, setNewCourse] = useState({
        name: '',
        price: '',
        image: '',
        description: '',
        trailerUrl: ''
    });

    useEffect(() => {
        refreshCourses();
        loadStats();
    }, []);

    // Handle hash-based routing
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash) setActiveTab(hash);
        };

        // Set initial tab based on hash
        handleHashChange();

        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, []);

    const refreshCourses = async () => {
        const allCourses = await DB.getCourses();
        setCourses(allCourses);
    };

    const loadStats = async () => {
        // Mock stats loading - replace with actual DB calls
        setTotalStudents(1250);
        setTotalRevenue(450000);
        setActiveUsers(320);
    };

    const handleAddCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCourse) {
            await DB.updateCourse(editingCourse.id, {
                ...newCourse,
                price: parseFloat(newCourse.price)
            });
            setEditingCourse(null);
        } else {
            await DB.addCourse({
                ...newCourse,
                price: parseFloat(newCourse.price),
                rating: 0,
                reviews: 0,
                duration: "0h 0m",
                modules: 0,
                students: 0,
                level: "Beginner",
                lastUpdated: new Date().toISOString()
            });
        }

        refreshCourses();
        setNewCourse({ name: '', price: '', image: '', description: '', trailerUrl: '' });
        setShowCourseForm(false);
    };

    const handleDeleteCourse = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            await DB.deleteCourse(id);
            refreshCourses();
        }
    };

    const handleEditCourse = (course: Course) => {
        setEditingCourse(course);
        setNewCourse({
            name: course.name,
            price: course.price.toString(),
            image: course.image,
            description: course.description,
            trailerUrl: course.trailerUrl || ''
        });
        setShowCourseForm(true);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'courses':
                return (
                    <div className="animate-slide-in-up">
                        <CoursesTab
                            courses={courses}
                            onEdit={handleEditCourse}
                            onDelete={handleDeleteCourse}
                            onAddNew={() => setShowCourseForm(true)}
                        />
                    </div>
                );
            case 'users':
                return (
                    <div className="animate-slide-in-up">
                        <UsersTab />
                    </div>
                );
            case 'purchases':
                return (
                    <div className="animate-slide-in-up">
                        <PurchasesTab />
                    </div>
                );
            case 'settings':
                return (
                    <div className="animate-slide-in-up">
                        <SettingsTab />
                    </div>
                );
            case 'dashboard':
            default:
                return (
                    <div className="animate-slide-in-up space-y-8">
                        {/* Page Header */}
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
                            <p className="text-slate-600">Welcome back, {user?.username}!</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatsCard
                                title="Total Students"
                                value={totalStudents}
                                icon={<Users size={24} />}
                                trend={{ value: "+12%", isPositive: true }}
                                color="blue"
                            />
                            <StatsCard
                                title="Total Courses"
                                value={courses.length}
                                icon={<BookOpen size={24} />}
                                trend={{ value: "+3", isPositive: true }}
                                color="green"
                            />
                            <StatsCard
                                title="Revenue"
                                value={`₹${totalRevenue.toLocaleString()}`}
                                icon={<DollarSign size={24} />}
                                trend={{ value: "+8%", isPositive: true }}
                                color="purple"
                            />
                            <StatsCard
                                title="Active Users"
                                value={activeUsers}
                                icon={<Activity size={24} />}
                                trend={{ value: "-2%", isPositive: false }}
                                color="orange"
                            />
                        </div>

                        {/* Quick Actions */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    onClick={() => {
                                        setShowCourseForm(!showCourseForm);
                                        window.location.hash = 'courses';
                                    }}
                                    className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-blue-500 hover:shadow-lg transition-all duration-300 group"
                                >
                                    <div className="p-3 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <Plus size={20} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-slate-900">Add New Course</h3>
                                        <p className="text-sm text-slate-500">Create a new course</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => window.location.hash = 'users'}
                                    className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-green-500 hover:shadow-lg transition-all duration-300 group"
                                >
                                    <div className="p-3 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
                                        <UserPlus size={20} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-slate-900">Manage Users</h3>
                                        <p className="text-sm text-slate-500">View all users</p>
                                    </div>
                                </button>

                                <button
                                    onClick={() => window.location.hash = 'purchases'}
                                    className="flex items-center gap-3 p-4 bg-white rounded-xl border-2 border-slate-200 hover:border-purple-500 hover:shadow-lg transition-all duration-300 group"
                                >
                                    <div className="p-3 bg-purple-100 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                        <ShoppingBag size={20} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-slate-900">View Purchases</h3>
                                        <p className="text-sm text-slate-500">See all transactions</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Add Course Form */}
                        {showCourseForm && (
                            <div className="bg-white rounded-xl border-2 border-slate-200 p-6 animate-slide-in-up">
                                <h2 className="text-xl font-bold text-slate-900 mb-4">
                                    {editingCourse ? 'Edit Course' : 'Add New Course'}
                                </h2>
                                <form onSubmit={handleAddCourse} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input
                                            type="text"
                                            placeholder="Course Name"
                                            value={newCourse.name}
                                            onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                                            className="px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                            required
                                        />
                                        <input
                                            type="number"
                                            placeholder="Price"
                                            value={newCourse.price}
                                            onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })}
                                            className="px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <input
                                        type="url"
                                        placeholder="Image URL"
                                        value={newCourse.image}
                                        onChange={(e) => setNewCourse({ ...newCourse, image: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    />
                                    <textarea
                                        placeholder="Description"
                                        value={newCourse.description}
                                        onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                        rows={3}
                                        required
                                    />
                                    <input
                                        type="url"
                                        placeholder="Trailer URL (optional)"
                                        value={newCourse.trailerUrl}
                                        onChange={(e) => setNewCourse({ ...newCourse, trailerUrl: e.target.value })}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    />
                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                                        >
                                            {editingCourse ? 'Update Course' : 'Add Course'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowCourseForm(false);
                                                setEditingCourse(null);
                                                setNewCourse({ name: '', price: '', image: '', description: '', trailerUrl: '' });
                                            }}
                                            className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Course Management */}
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Recent Courses</h2>
                            <CourseTable
                                courses={courses.slice(0, 5)}
                                onEdit={handleEditCourse}
                                onDelete={handleDeleteCourse}
                            />
                        </div>
                    </div>
                );
        }
    };

    if (!user) return null;

    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                activeTab={activeTab}
            />

            <div className="flex-1 flex flex-col min-w-0">
                <TopBar onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {renderTabContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};
