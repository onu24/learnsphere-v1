"use client"

import * as React from "react"
import { Star, Quote } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface TestimonialProps extends React.HTMLAttributes<HTMLDivElement> {
    name: string
    role: string
    company?: string
    testimonial: string
    rating?: number
    image?: string
}

const Testimonial = React.forwardRef<HTMLDivElement, TestimonialProps>(
    ({ name, role, company, testimonial, rating = 5, image, className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    "group relative overflow-hidden rounded-2xl border-2 border-slate-200 bg-white p-8 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-blue-500 hover:shadow-2xl hover:-translate-y-3 animate-float",
                    "hover:shadow-blue-500/20",
                    className
                )}
                {...props}
            >
                {/* Decorative Quote Icon */}
                <div className="absolute right-6 top-6 text-slate-100 transition-colors duration-300 group-hover:text-blue-100">
                    <Quote size={48} strokeWidth={1.5} />
                </div>

                <div className="flex flex-col gap-6 justify-between h-full relative z-10">
                    {/* Star Rating with Shimmer */}
                    {rating > 0 && (
                        <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Star
                                    key={index}
                                    size={18}
                                    className={cn(
                                        "transition-all duration-200",
                                        index < rating
                                            ? "fill-yellow-400 text-yellow-400 animate-shimmer"
                                            : "fill-slate-200 text-slate-200"
                                    )}
                                    style={{
                                        animationDelay: `${index * 100}ms`
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Testimonial Text */}
                    <p className="text-base leading-relaxed text-slate-600 font-medium">
                        "{testimonial}"
                    </p>

                    {/* User Info */}
                    <div className="flex items-center gap-4 mt-auto">
                        <Avatar className="w-12 h-12 border-2 border-slate-100 transition-all duration-300 group-hover:border-blue-200">
                            <AvatarImage src={image} alt={name} />
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                {name[0]}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex flex-col">
                            <h3 className="font-bold text-slate-900 text-base">{name}</h3>
                            <p className="text-sm text-slate-500 font-medium">
                                {role}
                                {company && ` • ${company}`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Subtle Gradient Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/30 group-hover:to-transparent transition-all duration-300 pointer-events-none" />
            </div>
        )
    }
)
Testimonial.displayName = "Testimonial"

export { Testimonial }
