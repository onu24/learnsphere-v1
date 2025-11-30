"use client"

import * as React from "react"
import { Star } from "lucide-react"
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
                    "relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg dark:border-slate-800 dark:bg-slate-950 md:p-8",
                    className
                )}
                {...props}
            >
                <div className="absolute right-6 top-6 text-6xl font-serif text-slate-200 dark:text-slate-800">
                    "
                </div>

                <div className="flex flex-col gap-4 justify-between h-full">
                    {rating > 0 && (
                        <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Star
                                    key={index}
                                    size={16}
                                    className={cn(
                                        index < rating
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "fill-slate-200 text-slate-200"
                                    )}
                                />
                            ))}
                        </div>
                    )}

                    <p className="text-pretty text-base text-slate-600 dark:text-slate-300 relative z-10">
                        {testimonial}
                    </p>

                    <div className="flex items-center gap-4 justify-start mt-auto">
                        <div className="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage src={image} alt={name} />
                                <AvatarFallback>{name[0]}</AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col">
                                <h3 className="font-semibold text-slate-900 dark:text-slate-50">{name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {role}
                                    {company && ` @ ${company}`}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
)
Testimonial.displayName = "Testimonial"

export { Testimonial }
