'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { 
  Search, Bell, MessageSquare, BookOpen, BarChart2, 
  Award, Settings, Play, ChevronLeft, ChevronRight, LogOut, LayoutGrid, Zap
} from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const router = useRouter();
  const { email, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');

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
                  ${item.path === '/profile' 
                    ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <item.icon className={`w-5 h-5 ${item.path === '/profile' ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Premium Banner */}
          <div className="p-4 mt-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-800 to-blue-400" />
              <h4 className="font-bold text-slate-900 mb-1">Get Premium Now!</h4>
              <p className="text-xs text-slate-600 mb-4">Reach our special feature by subscribe our plan.</p>
              <button className="w-full py-2.5 bg-white text-blue-900 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition">
                Upgrade Now &rarr;
              </button>
            </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 flex flex-col h-screen overflow-y-auto z-10 pb-10">
          
          {/* Header */}
          <header className="px-10 py-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            
            <div className="flex items-center gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search here..." 
                  className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-900/20 w-64 shadow-sm"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 border border-slate-200 px-1.5 rounded">
                  ⌘K
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:shadow-sm transition">
                  <MessageSquare className="w-5 h-5" />
                </button>
                <button className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:shadow-sm transition relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                <button onClick={handleLogout} className="ml-2 w-10 h-10 rounded-full bg-slate-200 overflow-hidden hover:ring-2 hover:ring-blue-900/50 transition">
                  <img src="/samrat_logo.png" alt="Profile" className="w-full h-full object-cover scale-[1.05]" />
                </button>
              </div>
            </div>
          </header>

          <div className="px-10 mt-2 max-w-5xl">
            {/* Continue Learning */}
            <h2 className="text-xl font-bold text-slate-900 mb-4">Continue Learning</h2>
            <div className="grid grid-cols-2 gap-6 mb-10">
              
              {/* Card 1 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-900">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Advance UI/UX Design</h3>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-1">DESIGN</p>
                  </div>
                </div>
                
                <div className="w-full h-2 bg-slate-100 rounded-full mb-3 overflow-hidden">
                  <div className="h-full bg-blue-900 rounded-full w-[45%]" />
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-500 mb-6 font-medium">
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> 18/40 Lessons</span>
                  <span className="flex items-center gap-1"><Play className="w-3.5 h-3.5" /> 2 hours left</span>
                </div>
                
                <button className="text-blue-900 text-sm font-bold hover:text-blue-800 transition flex items-center gap-1">
                  Resume Course <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Card 2 */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-900 font-bold text-xl">
                    5
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Basic Web Development</h3>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mt-1">DEVELOPMENT</p>
                  </div>
                </div>
                
                <div className="w-full h-2 bg-slate-100 rounded-full mb-3 overflow-hidden">
                  <div className="h-full bg-blue-900 rounded-full w-[45%]" />
                </div>
                
                <div className="flex items-center justify-between text-xs text-slate-500 mb-6 font-medium">
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> 18/40 Lessons</span>
                  <span className="flex items-center gap-1"><Play className="w-3.5 h-3.5" /> 2 hours left</span>
                </div>
                
                <button className="text-blue-900 text-sm font-bold hover:text-blue-800 transition flex items-center gap-1">
                  Resume Course <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Recommended Courses */}
            <h2 className="text-xl font-bold text-slate-900 mb-4">Recommended Courses For You</h2>
            <div className="grid grid-cols-2 gap-6">
              
              {/* Course 1 */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group cursor-pointer">
                <div className="relative h-48 bg-slate-800 overflow-hidden">
                  <div className="absolute top-3 left-3 bg-blue-900 text-white text-[10px] font-bold px-2 py-1 rounded-md z-10">
                    New
                  </div>
                  <img src="https://images.unsplash.com/photo-1587614382346-4ec70e388b28?auto=format&fit=crop&w=800&q=80" alt="Course" className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Play className="w-3 h-3" /> 3:50
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                    9:32
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 mb-1 leading-snug">Webflow Tutorial: Build Your First Portfolio Website In a Minute</h3>
                  <p className="text-sm text-slate-500 mb-4">Adam Smith</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <span className="text-orange-500">★</span> 4.7 <span className="text-slate-400">(32)</span>
                    </div>
                    <span className="font-bold text-slate-900">$12.99</span>
                  </div>
                </div>
              </div>

              {/* Course 2 */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group cursor-pointer">
                <div className="relative h-48 bg-slate-800 overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80" alt="Course" className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition" />
                  <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <Play className="w-3 h-3" /> 3:50
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                    9:32
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 mb-1 leading-snug">Basic To Advance Design System With UX Strategies</h3>
                  <p className="text-sm text-slate-500 mb-4">Scott Warden</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <span className="text-orange-500">★</span> 4.7 <span className="text-slate-400">(540)</span>
                    </div>
                    <span className="font-bold text-slate-900">$49.99</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>

        {/* --- RIGHT SIDEBAR / PROFILE --- */}
        <aside className="w-80 bg-white border-l border-slate-100 h-screen overflow-y-auto p-6 z-10 flex flex-col">
          <div className="flex items-center gap-2 text-blue-900 text-sm font-bold mb-6">
            <ChevronLeft className="w-4 h-4" /> Close Details
          </div>

          {/* Profile Card */}
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center mb-8 relative overflow-hidden">
            
            <div className="w-20 h-20 bg-slate-200 rounded-full border-4 border-white shadow-sm mb-4 overflow-hidden z-10 relative">
              <img src="/samrat_logo.png" alt="User Profile" className="w-full h-full object-cover scale-[1.05]" />
              <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-900 rounded-full border-2 border-white flex items-center justify-center">
                <Award className="w-3 h-3 text-white" />
              </div>
            </div>
            
            <h3 className="font-bold text-lg text-slate-900 z-10">Aethermind Scholar</h3>
            <p className="text-xs text-slate-500 mb-3 z-10">AI & Developer</p>
            
            <div className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm text-sm font-bold text-slate-700 z-10">
              <Award className="w-4 h-4 text-blue-900" /> 876 Points
            </div>
            
            {/* Stats Row */}
            <div className="flex justify-between w-full mt-6 pt-6 border-t border-slate-200 z-10">
              <div className="text-center">
                <div className="text-lg font-bold text-slate-900 flex items-center justify-center gap-1">
                  🔥 54
                </div>
                <div className="text-[10px] text-slate-400 font-medium uppercase mt-1">Days Streak</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-slate-900 flex items-center justify-center gap-1">
                  🎯 06
                </div>
                <div className="text-[10px] text-slate-400 font-medium uppercase mt-1">Goals In Month</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-slate-900 flex items-center justify-center gap-1">
                  🏆 02
                </div>
                <div className="text-[10px] text-slate-400 font-medium uppercase mt-1">2nd Place</div>
              </div>
            </div>
          </div>

          {/* Weekly Streak */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">Weekly Streak <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 cursor-help">i</span></h4>
              <select className="bg-slate-50 border border-slate-200 text-xs py-1 px-2 rounded-md font-medium text-slate-600 outline-none">
                <option>May 2024</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-3">
              <span>4/4 Weeks</span>
              <div className="flex gap-1">
                <button className="w-5 h-5 flex items-center justify-center border border-slate-200 rounded text-slate-400 hover:text-slate-700"><ChevronLeft className="w-3 h-3" /></button>
                <button className="w-5 h-5 flex items-center justify-center border border-slate-200 rounded text-blue-900 hover:bg-blue-50"><ChevronRight className="w-3 h-3" /></button>
              </div>
            </div>
            
            <div className="flex justify-between mt-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                const isActive = i < 3; // First 3 days active
                const num = 29 + i;
                return (
                  <div key={day} className={`flex flex-col items-center justify-center w-10 h-14 rounded-xl ${isActive ? 'bg-blue-900 text-white shadow-md shadow-blue-900/20' : 'bg-transparent text-slate-400 hover:bg-slate-50'}`}>
                    <span className="text-[10px] font-medium mb-1">{day}</span>
                    <span className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-800'}`}>{num > 31 ? num - 31 : num}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Course Summary Cards */}
          <div className="grid grid-cols-2 gap-4 mt-auto">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3">
                <BookOpen className="w-5 h-5 text-blue-900" />
              </div>
              <h5 className="font-bold text-slate-900">3 Courses</h5>
              <p className="text-[10px] text-slate-500 font-medium">In Progress</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3">
                <Award className="w-5 h-5 text-blue-900" />
              </div>
              <h5 className="font-bold text-slate-900">17 Courses</h5>
              <p className="text-[10px] text-slate-500 font-medium">Completed</p>
            </div>
          </div>
          
        </aside>

      </div>
    </ProtectedRoute>
  );
}
