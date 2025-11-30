import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Meteors } from '@/components/ui/meteors';
import { ArrowLeft, Play, ShoppingCart, CheckCircle, BookOpen, Clock, Users, Award } from 'lucide-react';
import { useCourses, useCart } from './App';
import { useState } from 'react';

const CourseDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { courses } = useCourses();
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);
    const [showTrailer, setShowTrailer] = useState(false);

    const course = courses.find(c => c.id === parseInt(id || '0'));

    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Course not found</h2>
                    <Link to="/" className="text-brand-600 hover:underline">
                        ← Back to courses
                    </Link>
                </div>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(course);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="min-h-screen pt-20 pb-12">
            {/* Hero Section with Meteors */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
                <div className="absolute inset-0 w-full h-full">
                    <Meteors number={30} />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 py-16">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-slate-300 hover:text-white mb-8 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Back to Courses</span>
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Course Info */}
                        <div>
                            <div className="inline-block bg-brand-600/20 border border-brand-500/30 px-4 py-2 rounded-full mb-4">
                                <span className="text-brand-300 font-semibold">Featured Course</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                                {course.name}
                            </h1>

                            <p className="text-xl text-slate-300 mb-6">
                                {course.description}
                            </p>

                            <div className="flex items-center gap-6 mb-8">
                                <div className="flex items-center gap-2">
                                    <Clock size={20} className="text-brand-400" />
                                    <span className="text-slate-300">8-10 weeks</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users size={20} className="text-brand-400" />
                                    <span className="text-slate-300">2,500+ students</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Award size={20} className="text-brand-400" />
                                    <span className="text-slate-300">Certificate</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-4xl font-bold text-brand-400">
                                    ₹{course.price}
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={added}
                                    className={`flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all ${added
                                            ? 'bg-green-500 text-white'
                                            : 'bg-white text-slate-900 hover:bg-brand-500 hover:text-white shadow-lg hover:shadow-xl'
                                        }`}
                                >
                                    {added ? (
                                        <>
                                            <CheckCircle size={20} />
                                            Added to Cart
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart size={20} />
                                            Add to Cart
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Course Image/Video */}
                        <div className="relative">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
                                <img
                                    src={course.image}
                                    alt={course.name}
                                    className="w-full h-auto"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
                                    }}
                                />
                                {course.trailerUrl && (
                                    <button
                                        onClick={() => setShowTrailer(true)}
                                        className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/60 transition-colors group"
                                    >
                                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-brand-600 group-hover:scale-110 transition-transform">
                                            <Play size={32} fill="currentColor" className="ml-1" />
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Content */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* What You'll Learn */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <BookOpen className="text-brand-600" />
                                What You'll Learn
                            </h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    'Master the fundamentals and advanced concepts',
                                    'Build real-world projects from scratch',
                                    'Best practices and industry standards',
                                    'Hands-on exercises and assignments',
                                    'Access to exclusive resources',
                                    'Lifetime access to course materials',
                                ].map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle size={20} className="text-green-500 flex-shrink-0 mt-1" />
                                        <span className="text-slate-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Course Description */}
                        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4">Course Description</h2>
                            <div className="prose prose-slate max-w-none">
                                <p className="text-slate-700 leading-relaxed mb-4">
                                    This comprehensive course is designed to take you from beginner to advanced level.
                                    Whether you're looking to start a new career or enhance your existing skills,
                                    this course provides everything you need to succeed.
                                </p>
                                <p className="text-slate-700 leading-relaxed mb-4">
                                    Through a combination of video lectures, hands-on projects, and real-world examples,
                                    you'll gain practical experience that you can apply immediately in your work.
                                </p>
                                <p className="text-slate-700 leading-relaxed">
                                    Join thousands of students who have already transformed their careers with this course.
                                    Get started today and unlock your potential!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 sticky top-24">
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Course Features</h3>
                            <ul className="space-y-4">
                                {[
                                    { icon: Clock, label: 'Duration', value: '8-10 weeks' },
                                    { icon: Users, label: 'Students', value: '2,500+' },
                                    { icon: Award, label: 'Certificate', value: 'Yes' },
                                    { icon: BookOpen, label: 'Lessons', value: '50+ videos' },
                                ].map((feature, index) => (
                                    <li key={index} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <feature.icon size={20} className="text-brand-600" />
                                            <span className="text-slate-600">{feature.label}</span>
                                        </div>
                                        <span className="font-semibold text-slate-900">{feature.value}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={handleAddToCart}
                                disabled={added}
                                className={`w-full mt-6 py-4 rounded-xl font-bold transition-all ${added
                                        ? 'bg-green-500 text-white'
                                        : 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg'
                                    }`}
                            >
                                {added ? 'Added to Cart ✓' : 'Enroll Now'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Video Modal */}
            {showTrailer && course.trailerUrl && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 animate-fade-in">
                    <div className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl">
                        <button
                            onClick={() => setShowTrailer(false)}
                            className="absolute top-4 right-4 text-white hover:text-red-500 z-10 bg-black/50 p-2 rounded-full transition-colors"
                        >
                            ✕
                        </button>
                        <div className="relative pt-[56.25%]">
                            <iframe
                                src={course.trailerUrl}
                                className="absolute inset-0 w-full h-full"
                                title="Course Trailer"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseDetails;
