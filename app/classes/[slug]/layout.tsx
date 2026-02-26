export default async function ClassLayout({ children }: { children: React.ReactNode; }) {
    return (
        <div className='max-w-5xl mx-auto px-1 py-8'>
            {children}
        </div>
    );
}
