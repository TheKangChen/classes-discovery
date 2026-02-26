import { createClient } from "@supabase/supabase-js";
import { InferenceClient } from "@huggingface/inference";
import { Pinecone } from '@pinecone-database/pinecone';

export const hf = new InferenceClient(process.env.HF_TOKEN!);
export const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
export const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);
