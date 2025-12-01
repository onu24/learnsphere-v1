import React, { useState } from 'react';
import { Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { Course } from '../../types';

interface CourseTableProps {
    courses: Course[];
    onEdit: (course: Course) => void;
    onDelete: (id: number) => void;
    onTogglePublish?: (id: number, published: boolean) => void;
}

export const CourseTable: React.FC<CourseTableProps> = ({ courses, onEdit, onDelete, onTogglePublish }) => {
    const [publishedStates, setPublishedStates] = useState<Record<number, boolean>>(
        courses.reduce((acc, course) => ({ ...acc, [course.id]: true }), {})
    );

    const handleToggle = (id: number) => {
        const newState = !publishedStates[id];
        setPublishedStates(prev => ({ ...prev, [id]: newState }));
        onTogglePublish?.(id, newState);
    };

    return (
        <div className="bg-white rounded-xl border-2 border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Course
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {courses.map((course) => (
                            <tr
                                key={course.id}
                                className="hover:bg-slate-50 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={course.image}
                                            alt={course.name}
                                            className="w-16 h-16 rounded-lg object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=200&q=80';
                                            }}
                                        />
                                        <div>
                                            <h3 className="font-semibold text-slate-900">{course.name}</h3>
                                            <p className="text-sm text-slate-500 line-clamp-1">{course.description}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="font-semibold text-slate-900">₹{course.price}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleToggle(course.id)}
                                        className={`
                                            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                                            ${publishedStates[course.id] ? 'bg-blue-600' : 'bg-slate-300'}
                                        `}
                                    >
                                        <span
                                            className={`
                                                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                                ${publishedStates[course.id] ? 'translate-x-6' : 'translate-x-1'}
                                            `}
                                        />
                                    </button>
                                    <span className={`ml-2 text-sm font-medium ${publishedStates[course.id] ? 'text-green-600' : 'text-slate-500'}`}>
                                        {publishedStates[course.id] ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => onEdit(course)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => onDelete(course.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
