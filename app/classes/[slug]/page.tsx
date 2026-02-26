import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabase } from '@/app/lib/db';
import { getRecommendations } from '@/app/lib/data';

export default async function ClassPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const decodedTitle = decodeURIComponent(slug).replaceAll('-', ' ');

    const { data: classData, error } = await supabase
        .from('classes')
        .select('*')
        .ilike('class_title', decodedTitle)
        .single();

    const recommdations = await getRecommendations(classData.id);

    if (error || !classData) notFound();

    return (
        <>
            <nav className='md:flex gap-20 items-center justify-between mb-8 border-b border-gray-300'>
                <Link href='/' className='flex items-center text-sm text-blue-500 font-semibold '>
                    <span className='mr-0.5'>←</span>
                    <span className='hover:underline'>Go back to search</span>
                </Link>
                <div className='flex items-center gap-2 text-xs text-gray-400 font-bold uppercase'>
                    <Link
                        href='/classes'
                        className='hover:text-blue-500'
                    >
                        {classData.format}
                    </Link>
                    <span className='cursor-default'>/</span>
                    <span className='text-gray-700 truncate cursor-default'>{classData.class_title}</span>
                </div>
                <Link
                    href={`https://www.nypl.org/techconnect?keyword=${decodedTitle}`}
                    target='_blank'
                    className='flex items-center text-sm text-blue-500 font-semibold'
                >
                    <span className='hover:underline'>Upcoming sessions</span>
                    <span className='ml-0.5'>→</span>
                </Link>
            </nav>

            <main className='flex flex-col'>
                <h1 className='text-4xl tracking-wider font-bold uppercase mb-8'>{classData.class_title}</h1>
                <div className='flex gap-4 mb-8 text-sm text-gray-500 uppercase tracking-widest font-bold'>
                    <span>{classData.level}</span>
                    <span>|</span>
                    <span>{classData.format}</span>
                </div>
                <section className='max-w-none mb-6'>
                    <h2 className='text-lg font-semibold text-gray-800 tracking-wider uppercase mb-2'>Description</h2>
                    <p className='text-gray-700 leading-relaxed mb-6'>{classData.description}</p>
                    {classData.prerequisite && (
                        <>
                            <h2 className='text-lg font-semibold text-gray-800 tracking-wider uppercase mb-2'>Prerequisite</h2>
                            <Link href={`/classes/${encodeURIComponent(classData.prerequisite)}`} className='text-gray-500 hover:text-gray-900 underline italic'>{classData.prerequisite}</Link>
                        </>
                    )}
                </section>
            </main>

            <footer className='mt-16 pt-8 border-t border-gray-300'>
                <h3 className='text-lg font-bold mb-4'>You might also like</h3>
                {recommdations.map(rec => (
                    <Link
                        key={rec.id}
                        href={`/classes/${encodeURIComponent(rec.class_title)}`}
                        className='text-sm text-gray-700 underline hover:text-blue-500'
                    >
                        <h3 className='my-1'>{rec.class_title}</h3>
                    </Link>
                ))}
            </footer>
        </>
    );
}
