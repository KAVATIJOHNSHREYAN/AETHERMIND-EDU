'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { 
  Search, Bell, MessageSquare, BookOpen, BarChart2, 
  Settings, Play, LayoutGrid, Zap, Map, FileCode2,
  Briefcase, GraduationCap
} from 'lucide-react';

export default function WorkspacePage() {
  const router = useRouter();
  const { logout } = useAuth();
  
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

  const tools = [
    {
      title: 'Career Roadmap Builder',
      description: 'Generate step-by-step career progression paths powered by AI.',
      icon: Map,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
    },
    {
      title: 'Mock Interview Simulator',
      description: 'Practice real-time technical and behavioral interviews.',
      icon: Briefcase,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      title: 'Code Review Agent',
      description: 'Submit your code snippets for architectural and security analysis.',
      icon: FileCode2,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-100',
    },
    {
      title: 'Study Plan Generator',
      description: 'Create customized syllabi based on your uploaded knowledge base.',
      icon: GraduationCap,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
  ];

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
                  ${item.path === '/workspace' 
                    ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <item.icon className={`w-5 h-5 ${item.path === '/workspace' ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 flex flex-col h-screen overflow-y-auto z-10 pb-10">
          
          {/* Header */}
          <header className="px-10 py-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">AI Workspace</h1>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <button onClick={handleLogout} className="ml-2 w-10 h-10 rounded-full bg-slate-200 overflow-hidden hover:ring-2 hover:ring-blue-900/50 transition">
                  <img src="/samrat_logo.png" alt="Profile" className="w-full h-full object-cover scale-[1.05]" />
                </button>
              </div>
            </div>
          </header>

          <div className="px-10 mt-2 max-w-5xl flex-1 flex flex-col">
            <p className="text-slate-500 mb-8 max-w-2xl">
              Access advanced AI-powered tools designed to accelerate your career and streamline your learning journey. Choose a tool below to launch an interactive session.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tools.map((tool, idx) => (
                <div 
                  key={idx}
                  className={`bg-white p-6 rounded-3xl border ${tool.border} shadow-sm hover:shadow-md transition cursor-pointer group`}
                >
                  <div className={`w-14 h-14 ${tool.bg} ${tool.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <tool.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 mb-2">{tool.title}</h3>
                  <p className="text-sm text-slate-500 mb-6">{tool.description}</p>
                  
                  <button className={`w-full py-2.5 rounded-xl text-sm font-bold transition-colors border border-slate-200 text-slate-600 group-hover:bg-blue-900 group-hover:text-white group-hover:border-blue-900`}>
                    Launch Tool &rarr;
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-12 bg-slate-50 p-8 rounded-3xl border border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-lg mb-1">Need a custom AI tool?</h3>
                <p className="text-slate-500 text-sm">Create personalized workflows using our prompt engineering studio.</p>
              </div>
              <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:shadow-sm transition">
                Open Studio
              </button>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
