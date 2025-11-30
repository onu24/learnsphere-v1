import React from 'react';
import { Testimonial } from '@/components/ui/testimonial';

const reviews = [
    {
        name: "Sarah Johnson",
        role: "Frontend Developer",
        company: "TechCorp",
        testimonial: "The courses here are absolutely top-notch. I went from knowing nothing about React to building full-stack applications in just a few weeks. The instructors explain complex concepts so clearly.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
    },
    {
        name: "Michael Chen",
        role: "UX Designer",
        company: "Creative Studio",
        testimonial: "I've taken many online courses, but LearnSphere stands out for its practical approach. The projects we built were relevant to real-world scenarios, which helped me land my dream job.",
        rating: 5,
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    {
        name: "Emily Davis",
        role: "Product Manager",
        company: "StartUp Inc",
        testimonial: "As a PM, I wanted to understand the technical side better. These courses were perfect - not too overwhelming but detailed enough to give me a solid foundation. Highly recommended!",
        rating: 4,
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
    }
];

const ReviewsSection: React.FC = () => {
    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="text-brand-600 font-semibold tracking-wider text-sm uppercase mb-2">Testimonials</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 relative pb-4 inline-block">
                        What Our Students Say
                        <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-brand-500 rounded-full"></span>
                    </h2>
                    <p className="text-slate-600 mt-4 max-w-2xl mx-auto">
                        Join thousands of satisfied learners who have transformed their careers with our courses.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                            <Testimonial {...review} className="h-full" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ReviewsSection;
