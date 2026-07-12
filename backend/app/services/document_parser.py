import io
from typing import List
from pypdf import PdfReader
from docx import Document
import pytesseract
from PIL import Image

def parse_pdf(file_bytes: bytes) -> str:
    """Parse text from a PDF file."""
    text = ""
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n\n"
    except Exception as e:
        print(f"Error parsing PDF: {e}")
    return text

def parse_docx(file_bytes: bytes) -> str:
    """Parse text from a DOCX file."""
    text = ""
    try:
        doc = Document(io.BytesIO(file_bytes))
        for para in doc.paragraphs:
            text += para.text + "\n"
    except Exception as e:
        print(f"Error parsing DOCX: {e}")
    return text

def parse_txt(file_bytes: bytes) -> str:
    """Parse text from a TXT file."""
    try:
        return file_bytes.decode('utf-8')
    except UnicodeDecodeError:
        try:
            return file_bytes.decode('latin-1')
        except:
            return ""

def parse_image_ocr(file_bytes: bytes) -> str:
    """Extract text from an image using OCR (Tesseract)."""
    text = ""
    try:
        image = Image.open(io.BytesIO(file_bytes))
        text = pytesseract.image_to_string(image)
    except Exception as e:
        print(f"Error extracting text from image: {e}")
    return text

def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
    """Chunk text into smaller pieces for vector embeddings."""
    if not text:
        return []
    
    words = text.split()
    chunks = []
    
    i = 0
    while i < len(words):
        chunk = " ".join(words[i:i+chunk_size])
        chunks.append(chunk)
        i += chunk_size - overlap
        
    return chunks

def parse_document(file_bytes: bytes, filename: str) -> List[str]:
    """Parse a document and return a list of text chunks."""
    filename_lower = filename.lower()
    text = ""
    
    if filename_lower.endswith('.pdf'):
        text = parse_pdf(file_bytes)
    elif filename_lower.endswith('.docx'):
        text = parse_docx(file_bytes)
    elif filename_lower.endswith('.txt'):
        text = parse_txt(file_bytes)
    elif filename_lower.endswith(('.png', '.jpg', '.jpeg')):
        text = parse_image_ocr(file_bytes)
    else:
        raise ValueError(f"Unsupported file format: {filename}")
        
    if not text.strip():
        raise ValueError(f"Could not extract any text from {filename}")
        
    return chunk_text(text)
