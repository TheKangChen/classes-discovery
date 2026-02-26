import Link from 'next/link';
import { Level } from "@/app/lib/definitions";

const classRouteRoot = '/classes';

export function Card({ title, description, level }: { title: string; description: string; level: Level }) {
    const classSlug = encodeURIComponent(title.toLowerCase().trim().replaceAll(/\s+/g, '-'));
    const href = `${classRouteRoot}/${classSlug}`;

    return (
        <div className="relative group flex flex-col gap-1 px-4 py-6 rounded-sm border-b border-gray-200 hover:bg-slate-50 transition-colors">

            <Link href={href} className="absolute inset-0 z-10" aria-hidden="true">
                <span className="sr-only">View {title}</span>
            </Link>

            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600">{title}</h3>

            <p className="text-xs text-gray-500 italic">Level: {level}</p>

            <p className="text-sm text-gray-700 leading-relaxed line-clamp-2 mt-1 max-w-2xl">{description}</p>


            <div className="mt-1">
                <button tabIndex={-1} className="text-xs text-gray-500 font-bold group-hover:text-blue-600 underline">
                    View Course Details
                </button>
            </div>
        </div>
    );
}
