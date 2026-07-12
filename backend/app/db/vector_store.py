import os
import json
import logging
from typing import List, Optional, Dict, Any
from datetime import datetime
import numpy as np

# Lazy load heavy ML modules
try:
    import faiss
    from sentence_transformers import SentenceTransformer
    HAS_FAISS = True
except ImportError:
    HAS_FAISS = False
    print("Warning: faiss or sentence_transformers not installed. Vector search will fail.")

logger = logging.getLogger(__name__)

# Fallback storage for when no vector DB is available (storing metadata)
if os.getenv("VERCEL"):
    METADATA_STORE_FILE = "/tmp/documents_store.json"
    FAISS_INDEX_FILE = "/tmp/faiss_index.bin"
else:
    METADATA_STORE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "documents_store.json")
    FAISS_INDEX_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "faiss_index.bin")

class Document:
    """Represents a document with content and metadata."""
    def __init__(self, page_content: str, metadata: dict = None):
        self.page_content = page_content
        self.metadata = metadata or {}

# Global model instance to avoid reloading
_embedder_model = None

def _get_embedder():
    global _embedder_model
    if not HAS_FAISS:
        return None
    if _embedder_model is None:
        logger.info("Loading SentenceTransformer model 'all-MiniLM-L6-v2'...")
        _embedder_model = SentenceTransformer('all-MiniLM-L6-v2')
    return _embedder_model

def get_embedding(text: str) -> Optional[np.ndarray]:
    embedder = _get_embedder()
    if not embedder:
        return None
    try:
        embedding = embedder.encode([text])[0]
        return np.array(embedding, dtype=np.float32)
    except Exception as e:
        logger.error(f"Error generating embeddings: {e}")
        return None

# State variables for FAISS
_index = None
_metadata_store = []

def _init_store():
    global _index, _metadata_store
    if _index is not None:
        return

    # Load metadata
    if os.path.exists(METADATA_STORE_FILE):
        try:
            with open(METADATA_STORE_FILE, "r", encoding="utf-8") as f:
                _metadata_store = json.load(f)
        except Exception as e:
            logger.error(f"Error loading metadata store: {e}")
            _metadata_store = []
    
    # Load or create FAISS index
    if HAS_FAISS:
        if os.path.exists(FAISS_INDEX_FILE) and len(_metadata_store) > 0:
            try:
                _index = faiss.read_index(FAISS_INDEX_FILE)
            except Exception as e:
                logger.error(f"Error loading FAISS index: {e}")
                # Re-create empty
                _index = faiss.IndexFlatL2(384) # 384 is dimension of all-MiniLM-L6-v2
        else:
            _index = faiss.IndexFlatL2(384)

def _save_store():
    try:
        os.makedirs(os.path.dirname(METADATA_STORE_FILE), exist_ok=True)
        with open(METADATA_STORE_FILE, "w", encoding="utf-8") as f:
            json.dump(_metadata_store, f, ensure_ascii=False, indent=2)
            
        if HAS_FAISS and _index is not None:
            faiss.write_index(_index, FAISS_INDEX_FILE)
    except Exception as e:
        logger.error(f"Error saving store: {e}")

def add_documents_to_vector_store(
    texts: List[str], 
    metadatas: List[dict] = None, 
    api_key: str = None, # Kept for signature compatibility
    user_id: Optional[str] = None
):
    """Add documents using local FAISS and Sentence Transformers."""
    if not texts:
        return
        
    _init_store()
    
    vectors_to_add = []
    
    for idx, text in enumerate(texts):
        if not text.strip():
            continue
            
        metadata = metadatas[idx] if metadatas and idx < len(metadatas) else {}
        if user_id:
            metadata["user_id"] = user_id
            
        embedding = get_embedding(text)
        if embedding is not None:
            vectors_to_add.append(embedding)
            
            doc_entry = {
                "id": f"{datetime.now().timestamp()}_{idx}",
                "page_content": text,
                "metadata": metadata
            }
            _metadata_store.append(doc_entry)
            
    if vectors_to_add and HAS_FAISS and _index is not None:
        vectors_np = np.vstack(vectors_to_add)
        _index.add(vectors_np)
        _save_store()
        logger.info(f"Added {len(vectors_to_add)} documents to FAISS index.")

def similarity_search(
    query: str, 
    k: int = 3, 
    api_key: str = None, # Kept for signature compatibility
    user_id: Optional[str] = None
) -> List[Document]:
    
    _init_store()
    
    if not _metadata_store or not HAS_FAISS or _index is None or _index.ntotal == 0:
        logger.debug("Store is empty or FAISS is unavailable")
        return []
        
    query_embedding = get_embedding(query)
    if query_embedding is None:
        return []
        
    # Search FAISS
    # We query more than k because we need to filter by user_id post-search
    search_k = min(_index.ntotal, max(k * 5, 20)) if user_id else k
    
    query_np = np.array([query_embedding], dtype=np.float32)
    distances, indices = _index.search(query_np, search_k)
    
    results = []
    for i, idx in enumerate(indices[0]):
        if idx == -1 or idx >= len(_metadata_store):
            continue
            
        doc_data = _metadata_store[idx]
        
        # Filter by user_id
        if user_id:
            if doc_data.get("metadata", {}).get("user_id") != user_id:
                continue
                
        results.append(Document(doc_data["page_content"], doc_data["metadata"]))
        
        if len(results) >= k:
            break
            
    return results

# Expose a method to list uploaded documents
def get_user_documents(user_id: str) -> List[dict]:
    _init_store()
    docs = []
    seen = set()
    for doc in _metadata_store:
        if doc.get("metadata", {}).get("user_id") == user_id:
            filename = doc.get("metadata", {}).get("filename", "Unknown")
            if filename not in seen:
                docs.append({"filename": filename, "type": doc.get("metadata", {}).get("type", "document")})
                seen.add(filename)
    return docs
