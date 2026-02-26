'use server';

import { ClassResult } from '@/app/lib/definitions';
import { hf, pc, supabase } from '@/app/lib/db';

/**
 * Executes a hybrid discovery search by combining semantic vector retrieval with relational metadata filtering.
 * @param query The natural language search string.
 * @param selectedLevels An array of proficiency levels to filter by (ex. ['Beginner', 'Advanced']).
 * @param selectedFormats An array of class formats to filter by.
 * @param selectedSeries An array of curriculum series tags to filter by.
 * @returns A promise resolving to an array of class objects sorted by semantic relevance.
 * @example
 * const results = await getDiscoveryResults("python basics", ["Beginner"], ["Workshop"], ["Technology"]);
 */
export async function getDiscoveryResult(
    query: string,
    selectedLevels: string[],
    selectedFormats: string[],
    selectedSeries: string[]
): Promise<ClassResult[]> {
    try {
        // Semantic search
        if (query) {
            const queryEmbedding = await hf.featureExtraction({
                model: "BAAI/bge-small-en-v1.5",
                inputs: query || 'technology',
                provider: "hf-inference",
            }) as number[];
            const index = pc.index(process.env.PINECONE_INDEX!, process.env.PINECONE_INDEX_HOST!);
            const vectorResults = await index.query({
                vector: queryEmbedding,
                topK: 50,
                includeMetadata: false
            });
            const semanticIds = vectorResults.matches.map(m => m.id);

            // Lexical search filtered with semantic search results
            let pgQuery = supabase
                .from('classes')
                .select('id, class_title, description, prerequisite, level, series, format')
                .in('id', semanticIds);

            if (selectedLevels.length > 0) pgQuery.in('level', selectedLevels);
            if (selectedFormats.length > 0) pgQuery.in('format', selectedFormats);
            if (selectedSeries.length > 0) pgQuery.overlaps('series', selectedSeries);
            const { data: filteredItems, error: pgError } = await pgQuery
            if (pgError) throw pgError;

            // Sort on semantic relavance
            const results = filteredItems.sort((a, b) => semanticIds.indexOf(a.id) - semanticIds.indexOf(b.id));

            return results;
        } else {
            let pgQuery = supabase
                .from('classes')
                .select('id, class_title, description, prerequisite, level, series, format')

            if (selectedLevels.length > 0) pgQuery.in('level', selectedLevels);
            if (selectedFormats.length > 0) pgQuery.in('format', selectedFormats);
            if (selectedSeries.length > 0) pgQuery.overlaps('series', selectedSeries);
            const { data: filteredItems, error: pgError } = await pgQuery
            if (pgError) throw pgError;

            return filteredItems;
        }
    } catch (error) {
        console.error("Search Error:", error);
        return [];
    }
}

export async function getRecommendations(classId: string): Promise<{
    id: string;
    class_title: string;
}[]> {
    try {
        const index = pc.index(process.env.PINECONE_INDEX!, process.env.PINECONE_INDEX_HOST!);
        const fetchResult = await index.fetch({ ids: [classId] });
        const currentVector = fetchResult.records[classId]?.values;

        if (!currentVector) return [];

        const queryResults = await index.query({
            vector: currentVector,
            topK: 6,
            includeMetadata: false
        });

        const recommendedIds = queryResults.matches
            .map(m => m.id)
            .filter(id => id !== classId)
            .slice(0, 5)

        const { data, error } = await supabase
            .from('classes')
            .select('id, class_title')
            .in('id', recommendedIds);

        if (error) throw error;

        return data || [];
    } catch (error) {
        console.error()
        return [];
    }
}
