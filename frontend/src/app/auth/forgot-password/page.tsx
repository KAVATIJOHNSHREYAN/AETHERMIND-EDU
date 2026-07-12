'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Loader2, AlertCircle, CheckCircle, ArrowLeft, Zap } from 'lucide-react';
import { apiService } from '@/services/api';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!email) {
      setError('Please enter your email address');
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiService.forgotPassword(email);
      setSuccess(response.message || 'If that email is in our database, we will send you an email to reset your password.');
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-[1200px] bg-white rounded-[2rem] shadow-2xl flex overflow-hidden min-h-[700px]">
        
        {/* --- LEFT COLUMN: Form --- */}
        <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center relative">
          
          {/* Brand / Logo */}
          <div className="absolute top-8 left-8 lg:top-12 lg:left-12 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900">Aethermind</span>
          </div>

          <div className="max-w-md w-full mx-auto mt-16 lg:mt-0">
            <div className="mb-6">
              <Link href="/auth/login" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 transition">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Login
              </Link>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">Forgot Password</h1>
            <p className="text-slate-500 mb-8 text-sm">Enter your email to receive a reset link.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Input */}
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition"
                  disabled={isLoading}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="flex items-start gap-2 p-3 bg-emerald-50 text-emerald-600 text-sm rounded-lg border border-emerald-100">
                  <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>{success}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4 shadow-md shadow-blue-600/20"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending link...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* --- RIGHT COLUMN: Illustration --- */}
        <div className="hidden lg:flex w-1/2 bg-[#1E60D4] p-12 flex-col items-center justify-between relative">
          
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl" />
          
          <div className="flex-1 flex items-center justify-center w-full z-10">
            <div className="relative w-72 h-72 flex items-center justify-center drop-shadow-2xl rounded-full overflow-hidden border-4 border-blue-400/30">
               <img src="/samrat_logo.png" alt="Aethermind Illustration" className="w-full h-full object-cover scale-[1.02]" />
            </div>
          </div>
          
          <div className="w-full max-w-md z-10 space-y-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl shadow-xl">
              <p className="text-sm leading-relaxed mb-6 text-blue-50 font-medium">
                "I was skeptical about using AI in class, until I used Aethermind. I'm so happy with Aethermind that I've even used the questions it created for my midterms and final exams."
              </p>
              <div className="flex justify-between items-center text-xs text-blue-200/80">
                <span>Professor | UC San Diego</span>
                <span className="font-bold text-white">Michael McKay</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl flex items-center gap-4 shadow-xl">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Get Started on Aethermind</h4>
                <p className="text-[10px] text-slate-500">Access advanced AI tools for education, seamlessly integrated into your workflow.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
