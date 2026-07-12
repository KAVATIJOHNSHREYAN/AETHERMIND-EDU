from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.db.postgres import get_db
from app.db.models import User
from app.api.v1.auth import get_current_user
from app.services.document_parser import parse_document
from app.db.vector_store import add_documents_to_vector_store, get_user_documents

router = APIRouter(prefix="/documents", tags=["documents"])

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    try:
        contents = await file.read()
        
        # 1. Parse into chunks
        chunks = parse_document(contents, file.filename)
        
        # 2. Add to FAISS Vector Store
        metadatas = [{"filename": file.filename, "type": file.content_type} for _ in chunks]
        add_documents_to_vector_store(
            texts=chunks, 
            metadatas=metadatas, 
            user_id=current_user.id
        )
        
        return {"message": "Document processed and stored successfully", "chunks": len(chunks)}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")

@router.get("")
def list_documents(current_user: User = Depends(get_current_user)):
    docs = get_user_documents(current_user.id)
    return docs
