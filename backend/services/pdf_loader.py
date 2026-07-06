from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter


def load_pdf(pdf_path):
    loader = PyPDFLoader(pdf_path)
    docs = loader.load()

    full_text = ""

    for doc in docs:
        full_text += doc.page_content + "\n\n"

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1500,
        chunk_overlap=300,
        separators=["\n\n", "\n", ".", " ", ""]
    )

    chunks = splitter.create_documents([full_text])

    print(f"\nCreated {len(chunks)} chunks.\n")

    return chunks