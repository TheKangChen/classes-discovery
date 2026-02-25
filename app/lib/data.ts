'use server';

import { createClient } from "@supabase/supabase-js";
import { InferenceClient } from "@huggingface/inference";
import { Pinecone } from '@pinecone-database/pinecone';
import { ClassResult } from "@/app/lib/definitions";


const hf = new InferenceClient(process.env.HF_TOKEN);
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Executes a hybrid discovery search by combining semantic vector retrieval with relational metadata filtering.
 * @param query The natural language search string.
 * @param selectedLevels An array of proficiency levels to filter by (ex. ['Beginner', 'Advanced']).
 * @param selectedSeries An array of curriculum series tags to filter by.
 * @returns A promise resolving to an array of class objects sorted by semantic relevance.
 * @example
 * const results = await getDiscoveryResults("python basics", ["Beginner"], ["Technology"]);
 */
export async function getDiscoveryResult(
    query: string,
    selectedLevels: string[],
    selectedSeries: string[]
): Promise<ClassResult[]> {
    try {
        // Semantic search
        const queryEmbedding = await hf.featureExtraction({
            model: "BAAI/bge-small-en-v1.5:fastest",
            inputs: query || 'technology',
            provider: "auto",
        }) as number[];
        const index = pc.index(process.env.PINECONE_INDEX, process.env.PINECONE_INDEX_HOST);
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
        if (selectedLevels.length > 0) {
            pgQuery.in('level', selectedLevels);
        }
        if (selectedSeries.length > 0) {
            pgQuery.in('series', selectedSeries);
        }
        const { data: filteredItems, error: pgError } = await pgQuery
        if (pgError) throw pgError;

        // Sort on semantic relavance
        const results = filteredItems.sort((a, b) => semanticIds.indexOf(a.id) - semanticIds.indexOf(b.id));

        return results;
    } catch (error) {
        console.log("Search Error:", error);
        return [];
    }
}
