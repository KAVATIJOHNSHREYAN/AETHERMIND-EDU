'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { 
  Search, Bell, MessageSquare, BookOpen, BarChart2, 
  Settings, Play, LayoutGrid, Zap, Clock, ChevronRight
} from 'lucide-react';
import { apiService } from '@/services/api';
import { useChatStore } from '@/store/chatStore';

export default function HistoryPage() {
  const router = useRouter();
  const { token, logout } = useAuth();
  const { setChats, setActiveChatId } = useChatStore();
  
  const [localChats, setLocalChats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  useEffect(() => {
    const fetchChats = async () => {
      if (!token) return;
      try {
        setIsLoading(true);
        const fetchedChats = await apiService.getChats(token);
        setLocalChats(fetchedChats);
        setChats(fetchedChats); // Sync with global store
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChats();
  }, [token, setChats]);

  const handleResumeChat = (chatId: string) => {
    setActiveChatId(chatId);
    router.push('/');
  };

  const filteredChats = localChats.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.mode.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  ${item.path === '/history' 
                    ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <item.icon className={`w-5 h-5 ${item.path === '/history' ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 flex flex-col h-screen overflow-y-auto z-10 pb-10">
          
          {/* Header */}
          <header className="px-10 py-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Chat History</h1>
            
            <div className="flex items-center gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search sessions..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 w-64 shadow-sm"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <button onClick={handleLogout} className="ml-2 w-10 h-10 rounded-full bg-slate-200 overflow-hidden hover:ring-2 hover:ring-blue-900/50 transition">
                  <img src="/samrat_logo.png" alt="Profile" className="w-full h-full object-cover scale-[1.05]" />
                </button>
              </div>
            </div>
          </header>

          <div className="px-10 mt-2 max-w-4xl flex-1 flex flex-col">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Recent Sessions
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center p-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="text-center p-10 bg-white rounded-2xl border border-slate-100">
                <p className="text-slate-500">No chat sessions found.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredChats.map((chat) => (
                  <div 
                    key={chat.id} 
                    onClick={() => handleResumeChat(chat.id)}
                    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md hover:border-blue-200 transition group"
                  >
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-blue-700 transition">{chat.title}</h3>
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded capitalize font-medium">
                          {chat.mode} Mode
                        </span>
                        <span className="text-slate-400">
                          {new Date(chat.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition">
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
