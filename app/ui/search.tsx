'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { LEVELS, FORMATS, SERIES } from '@/app/lib/definitions';

export default function Search({ placeholder }: { placeholder: string }) {
    const [searchCtrlToggle, toggleCtrl] = useState(false)
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        const term = formData.get('query') as string;
        const levels = formData.getAll('level');
        const formats = formData.getAll('format');
        const series = formData.getAll('series');

        const params = new URLSearchParams(searchParams);

        if (term) params.set('query', term); else params.delete('query');
        if (levels.length) params.set('level', levels.join(',')); else params.delete('level');
        if (formats.length) params.set('format', formats.join(',')); else params.delete('format');
        if (series.length) params.set('series', series.join(',')); else params.delete('series');

        replace(`${pathname}?${params.toString()}`);
    }
    // TODO: Add clear all button

    return (
        <div className="my-4">
            <form onSubmit={handleSubmit} className=''>

                <div className='flex gap-2'>
                    <label htmlFor="search" className="sr-only">Search</label>
                    <input
                        name='query'
                        className="flex-1 rounded-sm border border-gray-300 focus:outline-2 px-3 py-2 text-base placeholder:text-gray-500 focus:text-gray-900"
                        placeholder={placeholder}
                        defaultValue={searchParams.get('query')?.toString()}
                    />
                    <button type='submit' className='rounded-sm px-6 py-2 bg-blue-500 text-white hover:bg-blue-300 transition-transform duration-150 ease-in-out cursor-pointer'>
                        Search
                    </button>
                </div>

                <div className="mt-2">
                    <button
                        type="button"
                        onClick={() => toggleCtrl(!searchCtrlToggle)}
                        className="text-xs text-blue-600 font-medium hover:underline cursor-pointer flex items-center gap-1"
                    >
                        {searchCtrlToggle ? 'Hide search options ▲' : 'Show more search options ▼'}
                    </button>
                </div>

                {/* Expanded Filters */}
                {searchCtrlToggle && (
                    <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-5 animate-in fade-in duration-200">

                        {/* Level Filter */}
                        <div className="space-y-2">
                            <h4 className="font-bold text-sm text-gray-900 uppercase border-b border-gray-200 pb-1">Level</h4>
                            <div className="flex flex-col gap-1.5">
                                {LEVELS.map(level => (
                                    <label key={level} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer capitalize">
                                        <input
                                            type="checkbox"
                                            name="level"
                                            value={level.toLowerCase()}
                                            defaultChecked={(searchParams.get('level')?.split(',') || []).includes(level.toLowerCase())}
                                            className="rounded text-blue-600"
                                        />
                                        {level}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Format Filter */}
                        <div className="space-y-2">
                            <h4 className="font-bold text-sm text-gray-900 uppercase border-b border-gray-200 pb-1">Format</h4>
                            <div className="flex flex-col gap-1.5">
                                {FORMATS.map(format => (
                                    <label key={format} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer capitalize">
                                        <input
                                            type="checkbox"
                                            name="format"
                                            value={format.toLowerCase()}
                                            defaultChecked={(searchParams.get('format')?.split(',') || []).includes(format.toLowerCase())}
                                            className="rounded text-blue-600"
                                        />
                                        {format}
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Series Filter */}
                        <div className="space-y-2 md:col-span-3">
                            <h4 className="font-bold text-sm text-gray-900 uppercase border-b border-gray-200 pb-1">Series</h4>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 max-h-60 overflow-y-auto pr-2">
                                {SERIES.map(item => (
                                    <label key={item} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer hover:text-blue-600 transition-colors">
                                        <input
                                            type="checkbox"
                                            name="series"
                                            value={item.toLowerCase()}
                                            defaultChecked={(searchParams.get('series')?.split(',') || []).includes(item.toLowerCase())}
                                            className="rounded text-blue-600"
                                        />
                                        <span className="capitalize">{item}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}

