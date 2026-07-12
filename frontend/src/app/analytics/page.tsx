'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { 
  Search, Bell, MessageSquare, BookOpen, BarChart2, 
  Settings, Play, LayoutGrid, Zap, TrendingUp, Target, Award
} from 'lucide-react';

export default function AnalyticsPage() {
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
                  ${item.path === '/analytics' 
                    ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <item.icon className={`w-5 h-5 ${item.path === '/analytics' ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 flex flex-col h-screen overflow-y-auto z-10 pb-10">
          
          {/* Header */}
          <header className="px-10 py-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Learning Analytics</h1>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <button onClick={handleLogout} className="ml-2 w-10 h-10 rounded-full bg-slate-200 overflow-hidden hover:ring-2 hover:ring-blue-900/50 transition">
                  <img src="/samrat_logo.png" alt="Profile" className="w-full h-full object-cover scale-[1.05]" />
                </button>
              </div>
            </div>
          </header>

          <div className="px-10 mt-2 max-w-5xl flex-1 flex flex-col">
            
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Study Hours</p>
                  <h3 className="text-2xl font-bold text-slate-900">42.5h</h3>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">RAG Queries</p>
                  <h3 className="text-2xl font-bold text-slate-900">128</h3>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Subjects Mastered</p>
                  <h3 className="text-2xl font-bold text-slate-900">4</h3>
                </div>
              </div>
            </div>

            {/* Detailed Progress */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-8">
              <h3 className="font-bold text-slate-900 mb-6">Subject Progress</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700">Computer Science</span>
                    <span className="font-bold text-blue-900">75%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700">Advanced Mathematics</span>
                    <span className="font-bold text-blue-900">45%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700">Physics - Mechanics</span>
                    <span className="font-bold text-blue-900">90%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Chart Placeholder */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex-1 flex flex-col">
              <h3 className="font-bold text-slate-900 mb-6">Weekly Activity</h3>
              <div className="flex-1 border border-dashed border-slate-200 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                [ Interactive Chart Component Rendered Here ]
              </div>
            </div>

          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
