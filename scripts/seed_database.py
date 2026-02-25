import os
import pathlib
from argparse import ArgumentParser
from typing import Any

import pandas as pd
from pinecone import Pinecone
from sentence_transformers import SentenceTransformer
from supabase import Client, create_client

sp_url: str = os.environ.get("SUPABASE_URL")
sp_key: str = os.environ.get("SUPABASE_KEY")
sp_table: str = os.environ.get("SUPABASE_TABLE")
hf_token: str = os.environ.get("HF_TOKEN")
pinecone_key: str = os.environ.get("PINECONE_API_KEY")
pinecone_index: str = os.environ.get("PINECONE_INDEX")

supabase: Client = create_client(sp_url, sp_key)
pc = Pinecone(api_key=pinecone_key)
index = pc.Index(pinecone_index)

model = SentenceTransformer("BAAI/bge-small-en-v1.5", token=hf_token)


def process_row(row: pd.Series) -> dict[str, dict[str, str | list] | list]:
    prereq = str(row["prerequisite"]) if pd.notna(row["prerequisite"]) else ""
    series_raw = str(row["series"]) if pd.notna(row["series"]) else ""
    series_list = [s.strip() for s in series_raw.split(",")] if series_raw else []
    format = str(row["format"]) if pd.notna(row["format"]) else ""

    text_to_embed = f"{row['class_title']}: {row['description']}"
    embedding = model.encode(text_to_embed).tolist()

    return {
        "metadata": {
            "class_title": row["class_title"],
            "description": row["description"],
            "prerequisite": prereq,
            "level": row["level"] if pd.notna(row["level"]) else "None",
            "series": series_list,
            "format": format,
        },
        "embedding": embedding,
    }


def main() -> None:
    parser = ArgumentParser(
        prog="Seed Supabase",
        description="Transform active classes csv file and write to Supabase",
    )
    parser.add_argument("filename", type=pathlib.Path)
    args = parser.parse_args()

    df = pd.read_csv(args.filename)
    cols_to_drop = [
        "handout",
        "handout_chinese",
        "handout_spanish",
        "handout_bengali",
        "handout_french",
        "handout_russian",
        "additional_materials",
    ]
    df = df.drop(columns=cols_to_drop)
    for i, row in df.iterrows():
        data = process_row(row)

        sb_response = supabase.table(sp_table).insert(data["metadata"]).execute()
        record_id = sb_response.data[0]["id"]

        index.upsert(
            vectors=[
                (
                    str(record_id),
                    data["embedding"],
                    {"title": data["metadata"]["class_title"]},
                )
            ]
        )

        if i % 10 == 0:
            print(f"Synced {i}/{len(df)}...")


if __name__ == "__main__":
    main()
