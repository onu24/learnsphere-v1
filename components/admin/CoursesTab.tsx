import React from 'react';
import { BookOpen, Search, Filter } from 'lucide-react';
import { Course } from '../../types';
import { CourseTable } from './CourseTable';

interface CoursesTabProps {
    courses: Course[];
    onEdit: (course: Course) => void;
    onDelete: (id: number) => void;
    onAddNew: () => void;
}

export const CoursesTab: React.FC<CoursesTabProps> = ({ courses, onEdit, onDelete, onAddNew }) => {
    const [searchQuery, setSearchQuery] = React.useState('');
    const [filterStatus, setFilterStatus] = React.useState<'all' | 'published' | 'draft'>('all');

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase());
        // For now, treat all courses as published (can be enhanced with actual status field)
        return matchesSearch;
    });

    return (
        <div className="animate-slide-in-up">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <BookOpen className="text-blue-600" size={28} />
                        Course Management
                    </h1>
                    <p className="text-slate-600 mt-1">{courses.length} total courses</p>
                </div>
                <button
                    onClick={onAddNew}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                >
                    + Add New Course
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border-2 border-slate-200 p-4 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter size={20} className="text-slate-400" />
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value as any)}
                            className="px-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
                        >
                            <option value="all">All Courses</option>
                            <option value="published">Published</option>
                            <option value="draft">Draft</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Course Table */}
            <CourseTable
                courses={filteredCourses}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        </div>
    );
};
