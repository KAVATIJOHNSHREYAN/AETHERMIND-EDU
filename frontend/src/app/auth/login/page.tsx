'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, AlertCircle, Eye, EyeOff, Check, Zap, Sparkles, BookOpen, Code, GraduationCap } from 'lucide-react';
import { apiService } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  React.useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.push('/profile');
    }
  }, [isAuthenticated, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const response = await apiService.login(email, password, abortControllerRef.current.signal);
      if (response.access_token) {
        login(response.access_token, response.user_id, email, rememberMe);
        router.push('/profile');
      } else {
        setError('Login failed: Invalid response from server');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setError('');
    setIsLoading(true);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const response = await apiService.loginWithMockGoogle(abortControllerRef.current.signal);
      if (response.access_token) {
        login(response.access_token, response.user_id, `mock_${provider.toLowerCase()}_user@example.com`, rememberMe);
        router.push('/profile');
      } else {
        setError(`${provider} Login failed: Invalid response from server`);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      setError(err instanceof Error ? err.message : `${provider} Login failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-[1200px] bg-white rounded-[2.5rem] shadow-2xl flex overflow-hidden min-h-[720px] border border-slate-100">
        
        {/* --- LEFT COLUMN: Form --- */}
        <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center relative bg-white">
          
          {/* Brand Logo in top-left */}
          <div className="absolute top-8 left-8 lg:top-12 lg:left-12 flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/25 overflow-hidden">
              <img src="/samrat_logo.png" alt="SAMRAT AI" className="w-full h-full object-cover scale-[1.02]" />
            </div>
            <span className="font-bold text-lg tracking-tight text-slate-800 uppercase">SAMRAT AI</span>
          </div>

          <div className="max-w-[400px] w-full mx-auto mt-12 lg:mt-0 flex flex-col items-center">
            
            {/* Centered Login Icon Box with faint grid */}
            <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
              {/* Faint Grid Background effect */}
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-[0.12] pointer-events-none">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="border-[0.5px] border-slate-900" />
                ))}
              </div>
              <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30 text-white z-10">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 01-3-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-slate-900 mb-1 text-center">Login to your account!</h2>
            <p className="text-slate-400 mb-8 text-[11px] text-center font-medium">Enter your registered email address and password to login!</p>

            <form onSubmit={handleSubmit} className="w-full space-y-4">
              
              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="eg. pixelcot@gmail.com"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition font-medium"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-450 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition font-medium"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-650 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {/* Options Row */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isLoading}
                      className="peer sr-only"
                    />
                    <div className="w-4 h-4 border border-slate-300 rounded-[6px] peer-checked:bg-blue-650 peer-checked:border-blue-650 flex items-center justify-center transition-colors group-hover:border-blue-600">
                      <Check className={`w-3 h-3 text-white transition-opacity ${rememberMe ? 'opacity-100' : 'opacity-0'}`} />
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 font-bold select-none">Remember me</span>
                </label>
                
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-blue-600 hover:text-blue-700 font-bold transition-colors"
                >
                  Forgot Password ?
                </Link>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 text-red-650 text-xs rounded-xl border border-red-100 font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-2xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            {/* Social Logins */}
            <div className="w-full mt-6 space-y-4">
              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-slate-100"></div>
                <span className="absolute px-3 bg-white text-slate-400 text-[10px] font-bold uppercase tracking-wider">Or login with</span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Google */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Google')}
                  disabled={isLoading}
                  className="flex items-center justify-center py-2.5 border border-slate-200 hover:bg-slate-50 transition rounded-xl cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                </button>
                {/* Apple */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Apple')}
                  disabled={isLoading}
                  className="flex items-center justify-center py-2.5 border border-slate-200 hover:bg-slate-50 transition rounded-xl cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4 text-slate-800" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.58 2.95-1.39z" />
                  </svg>
                </button>
                {/* Microsoft */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin('Microsoft')}
                  disabled={isLoading}
                  className="flex items-center justify-center py-2.5 border border-slate-200 hover:bg-slate-50 transition rounded-xl cursor-pointer disabled:opacity-50"
                >
                  <svg className="w-4 h-4" viewBox="0 0 23 23">
                    <path fill="#f35325" d="M0 0h11v11H0z" />
                    <path fill="#81bc06" d="M12 0h11v11H12z" />
                    <path fill="#05a6f0" d="M0 12h11v11H0z" />
                    <path fill="#ffba08" d="M12 12h11v11H12z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Switch to Register */}
            <p className="text-center text-slate-500 text-xs mt-8 font-medium">
              Don't have an account?{' '}
              <Link
                href="/auth/register"
                className="text-blue-600 hover:text-blue-700 font-bold transition"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Orbiting Illustration --- */}
        <div className="hidden lg:flex w-1/2 bg-gradient-to-b from-[#E3F2FD] via-[#F1F8E9] to-[#E3F2FD] p-12 flex-col items-center justify-between relative border-l border-slate-100">
          
          {/* Faint circles background design */}
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/40 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-blue-300/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="w-full text-center z-10">
            <h2 className="text-2xl font-black text-slate-800 leading-tight">
              Learn & Grow <span className="text-blue-650">Everywhere</span>
            </h2>
          </div>

          {/* Interactive circular orbits graph */}
          <div className="flex-1 flex items-center justify-center w-full z-10 relative">
            
            {/* Orbits lines */}
            <div className="absolute w-[280px] h-[280px] border border-slate-300/30 rounded-full animate-[spin_40s_linear_infinite]" />
            <div className="absolute w-[200px] h-[200px] border border-slate-350/40 rounded-full animate-[spin_25s_linear_infinite_reverse]" />
            <div className="absolute w-[120px] h-[120px] border border-slate-400/50 rounded-full animate-[spin_12s_linear_infinite]" />

            {/* Central Brand Button */}
            <div className="relative w-18 h-18 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center shadow-xl z-20 hover:scale-105 transition-all">
              <span className="text-blue-600 font-black text-sm uppercase">EDU</span>
            </div>

            {/* Orbiting Icons - Outer ring */}
            <div className="absolute w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center z-20 translate-x-[140px] hover:scale-110 transition-transform">
              <Code className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="absolute w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center z-20 -translate-x-[140px] hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4 text-blue-500" />
            </div>

            {/* Orbiting Icons - Middle ring */}
            <div className="absolute w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center z-20 translate-y-[100px] hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div className="absolute w-8 h-8 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center z-20 -translate-y-[100px] hover:scale-110 transition-transform">
              <GraduationCap className="w-4 h-4 text-indigo-500" />
            </div>

            {/* Orbiting Icons - Inner ring */}
            <div className="absolute w-7 h-7 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center z-20 translate-x-[42px] translate-y-[42px] hover:scale-110 transition-transform">
              <span className="text-[10px] font-black text-red-500 font-mono">AI</span>
            </div>
            <div className="absolute w-7 h-7 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center z-20 -translate-x-[42px] -translate-y-[42px] hover:scale-110 transition-transform">
              <span className="text-[10px] font-black text-cyan-500">RAG</span>
            </div>

          </div>
          
          {/* Testimonial / Features detail description */}
          <div className="w-full max-w-[420px] z-10 text-center space-y-4">
            <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
              Compatible with <span className="italic font-bold text-slate-800">custom PDFs, DOCX files, images,</span> and other learning materials for a personalized RAG tutoring experience.
            </p>
            
            {/* Slider carousel dots indicator */}
            <div className="flex justify-center gap-1.5 pt-2">
              <div className="w-4 h-1.5 rounded-full bg-blue-600" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            </div>
          </div>

        </div>
        
      </div>
    </div>
  );
}
