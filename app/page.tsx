import Search from "@/app/ui/search";
import { Card } from "@/app/ui/cards";
import { getDiscoveryResult } from "./lib/data";

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        level?: string;
        format?: string;
        series?: string;
    }>;
}) {
    const searchParams = await props.searchParams;

    const query = searchParams?.query || '';
    const levels = searchParams?.level ? searchParams.level.split(',') : [];
    const formats = searchParams?.format ? searchParams.format.split(',') : [];
    const series = searchParams?.series ? searchParams.series.split(',') : [];

    const results = await getDiscoveryResult(query, levels, formats, series);
    const totalResults = results.length;

    console.log(results);

    return (
        <main className="max-w-5xl mx-auto px-1 py-8">
            <div className="">
                <div className="border-b border-gray-300">
                    <h1 className="text-3xl font-bold mb-6">Classes Discovery</h1>
                    <Search placeholder="Search classes" />
                </div>
                <div className="mt-8 flex items-baseline justify-between border-b border-gray-200 pb-2">
                    <p className="text-sm text-gray-600">
                        Showing <span className="font-bold">1</span> through <span className="font-bold">{totalResults}</span> of <span className="font-bold">{totalResults}</span>
                        {query && (
                            <span> for the search: <span className="italic text-blue-700">"{query}"</span></span>
                        )}
                    </p>
                </div>
                <div className="flex flex-col">
                    {results.length > 0 ? (
                        results.map(item => (
                            <Card
                                key={item.id}
                                title={item.class_title}
                                description={item.description}
                                level={item.level}
                            />
                        ))
                    ) : (
                        <div className="py-20 text-center">
                            <p className="text-gray-500 italic">No classes found</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
