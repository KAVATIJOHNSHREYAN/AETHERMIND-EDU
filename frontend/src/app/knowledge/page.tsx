'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { 
  Search, Bell, MessageSquare, BookOpen, BarChart2, 
  Settings, Play, LayoutGrid, Zap, UploadCloud, FileText,
  FileImage, File, Loader2, CheckCircle2
} from 'lucide-react';
import { apiService } from '@/services/api';

export default function KnowledgeBasePage() {
  const router = useRouter();
  const { token, logout } = useAuth();
  
  const [documents, setDocuments] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutGrid, path: '/profile' },
    { name: 'AI Chat', icon: MessageSquare, path: '/' },
    { name: 'Knowledge Base', icon: BookOpen, path: '/knowledge' },
    { name: 'History', icon: Play, path: '/history' },
    { name: 'AI Workspace', icon: Zap, path: '/workspace' },
    { name: 'Analytics', icon: BarChart2, path: '/analytics' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  const fetchDocuments = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const docs = await apiService.getKnowledgeDocuments(token);
      setDocuments(docs);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [token]);

  const handleFileUpload = async (file: File) => {
    if (!token) return;
    try {
      setIsUploading(true);
      await apiService.uploadKnowledgeDocument(token, file);
      await fetchDocuments(); // Refresh list after upload
    } catch (err) {
      alert("Failed to upload document");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const getFileIcon = (type: string, filename: string) => {
    if (filename.toLowerCase().endsWith('.pdf')) return <FileText className="w-8 h-8 text-red-500" />;
    if (filename.toLowerCase().endsWith('.docx')) return <FileText className="w-8 h-8 text-blue-500" />;
    if (type.startsWith('image/')) return <FileImage className="w-8 h-8 text-emerald-500" />;
    return <File className="w-8 h-8 text-slate-500" />;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FDFDFD] text-slate-800 font-sans relative overflow-hidden flex">
        
        {/* Watermark Logo */}
        <div 
          className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]"
          style={{
            backgroundImage: 'url(/samrat_logo.png)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: '50%'
          }}
        />

        {/* --- LEFT SIDEBAR --- */}
        <aside className="w-64 bg-white border-r border-slate-100 flex flex-col z-10 sticky top-0 h-screen">
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Aethermind</span>
          </div>

          <div className="px-6 pb-2 text-xs font-semibold text-slate-400 tracking-wider">
            MENU
          </div>
          
          <nav className="flex-1 px-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
                  ${item.path === '/knowledge' 
                    ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <item.icon className={`w-5 h-5 ${item.path === '/knowledge' ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 flex flex-col h-screen overflow-y-auto z-10 pb-10">
          
          {/* Header */}
          <header className="px-10 py-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Knowledge Base</h1>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <button onClick={handleLogout} className="ml-2 w-10 h-10 rounded-full bg-slate-200 overflow-hidden hover:ring-2 hover:ring-blue-900/50 transition">
                  <img src="/samrat_logo.png" alt="Profile" className="w-full h-full object-cover scale-[1.05]" />
                </button>
              </div>
            </div>
          </header>

          <div className="px-10 mt-2 max-w-5xl flex-1 flex flex-col">
            
            <div className="mb-8">
              <h2 className="text-lg font-bold text-slate-900 mb-2">Upload RAG Documents</h2>
              <p className="text-sm text-slate-500 mb-4">Feed the AI Brain with your PDFs, Word Docs, and text notes. They will automatically be chunked and indexed into your private FAISS vector database.</p>
              
              <div 
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all
                  ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/50'}
                `}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  onChange={onFileSelect}
                  accept=".pdf,.docx,.txt,image/*"
                />
                
                {isUploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                    <h3 className="font-bold text-slate-900">Processing Document...</h3>
                    <p className="text-sm text-slate-500 mt-1">Extracting text, chunking, and computing embeddings.</p>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                      <UploadCloud className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">Click or drag & drop files here</h3>
                    <p className="text-sm text-slate-500 mt-2 max-w-sm">Supports PDF, DOCX, TXT, and Images (OCR). Files will be privately stored and securely indexed.</p>
                  </>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Indexed Library
              </h2>
              
              {isLoading ? (
                <div className="flex justify-center p-10">
                  <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
              ) : documents.length === 0 ? (
                <div className="text-center p-10 bg-white rounded-2xl border border-slate-100">
                  <p className="text-slate-500">Your knowledge base is empty. Upload a document to start chatting with your data!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documents.map((doc, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition">
                      <div className="p-3 bg-slate-50 rounded-xl">
                        {getFileIcon(doc.type, doc.filename)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-sm truncate" title={doc.filename}>{doc.filename}</h4>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Vectorized
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
