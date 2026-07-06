import chromadb
import uuid

from sentence_transformers import SentenceTransformer

client = chromadb.Client()

collection = client.get_or_create_collection(
    name="study_notes"
)

model = SentenceTransformer(
    "BAAI/bge-small-en-v1.5"
)


def store_chunks(chunks):

    # Remove old chunks so only the latest uploaded PDF is used
    try:
        collection.delete(where={})
    except:
        pass

    for chunk in chunks:

        embedding = model.encode(
            chunk.page_content,
            normalize_embeddings=True
        ).tolist()

        collection.add(
            ids=[str(uuid.uuid4())],
            embeddings=[embedding],
            documents=[chunk.page_content]
        )

    print(f"\nStored {collection.count()} chunks.\n")


def retrieve_context(question):

    question_embedding = model.encode(
        question,
        normalize_embeddings=True
    ).tolist()

    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=10
    )

    print("\n============= RETRIEVED CHUNKS =============\n")

    for i, doc in enumerate(results["documents"][0], 1):
        print(f"\nChunk {i}\n")
        print(doc)
        print("-" * 80)

    print("\n============================================\n")

    return {
        "documents": results["documents"][0],
        "sources": []
    }