import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Play, Clock } from 'lucide-react';
import { useAuth } from '../App';
import { EnrolledCourse } from '../types';
import * as DB from '../services/firebase';

export const MyCourses: React.FC = () => {
    const { user } = useAuth();
    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            loadEnrolledCourses();
        }
    }, [user]);

    const loadEnrolledCourses = async () => {
        if (!user) return;
        try {
            const courses = await DB.getEnrolledCourses(user._id);
            setEnrolledCourses(courses);
        } catch (error) {
            console.error('Failed to load enrolled courses:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center pt-20 px-4">
                <BookOpen size={48} className="text-slate-300 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Login Required</h2>
                <p className="text-slate-500 mb-8">Please login to view your courses</p>
                <Link to="/login" className="bg-brand-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-700 transition-colors">
                    Login
                </Link>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
            </div>
        );
    }

    if (enrolledCourses.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center pt-20 px-4">
                <BookOpen size={48} className="text-slate-300 mb-4" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">No Courses Yet</h2>
                <p className="text-slate-500 mb-8">Start learning by enrolling in a course!</p>
                <Link to="/" className="bg-brand-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-brand-700 transition-colors">
                    Browse Courses
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-24 min-h-screen">
            <div className="flex items-center gap-3 mb-8">
                <BookOpen className="text-brand-600" size={32} />
                <h1 className="text-3xl font-bold text-slate-900">My Courses</h1>
                <span className="text-slate-500">({enrolledCourses.length} enrolled)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course, index) => (
                    <div
                        key={course.courseId}
                        className="group bg-white rounded-xl overflow-hidden shadow-sm border-2 border-slate-200 hover:border-blue-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] animate-slide-in-up"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="relative overflow-hidden">
                            <img
                                src={course.courseImage}
                                alt={course.courseName}
                                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
                                }}
                            />
                            {/* Completion Badge */}
                            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                                <span className={course.progress === 100 ? "text-green-600" : "text-blue-600"}>
                                    {course.progress === 100 ? '✓ Completed' : `${course.progress}% Complete`}
                                </span>
                            </div>
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        <div className="p-6">
                            <h3 className="font-bold text-slate-900 mb-4 text-lg">{course.courseName}</h3>

                            {/* Progress Bar with Animation */}
                            <div className="mb-4">
                                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
                                    <span>Progress</span>
                                    <span>{course.progress}%</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                                        style={{
                                            width: `${course.progress}%`,
                                            animation: 'progressFill 1s ease-out'
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Last Accessed */}
                            {course.lastAccessed && (
                                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 font-medium">
                                    <Clock size={14} />
                                    <span>Last accessed {new Date(course.lastAccessed).toLocaleDateString()}</span>
                                </div>
                            )}

                            {/* Resume Button with Glow */}
                            <Link
                                to={`/course/${course.courseId}`}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-bold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/50 hover:shadow-xl group/button"
                            >
                                <Play size={18} className="transition-transform group-hover/button:scale-110" />
                                {course.progress === 0 ? 'Start Course' : course.progress === 100 ? 'Review Course' : 'Continue Learning'}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
