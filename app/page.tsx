'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Link2, Sparkles, TrendingUp, Zap, Check, Palette, BarChart3, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Home() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(true)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
        if (error) throw error
        toast.success('Welcome! Check your email to verify your account.')
        setEmail('')
        setPassword('')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        toast.success('Welcome back!')
        router.push('/dashboard')
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <Link2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Silovra</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Value Proposition */}
          <div className="animate-fade-in">
            <div className="inline-flex items-center space-x-2 bg-teal-500/20 border border-teal-500/30 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-teal-300" />
              <span className="text-sm text-teal-200">Trusted by 10,000+ creators</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              One Link.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                Infinite Possibilities.
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Share everything you create, sell, and promote with a single, beautiful link page. 
              Built for creators who want more than basic.
            </p>

            {/* Key Benefits */}
            <div className="space-y-4 mb-10">
              {[
                { icon: Palette, text: 'Beautiful animated themes that make you stand out' },
                { icon: TrendingUp, text: 'Analytics to track every click and conversion' },
                { icon: Zap, text: 'Unlimited links, organized exactly how you want' },
              ].map((benefit, i) => (
                <div key={i} className="flex items-start space-x-3 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="flex-shrink-0 w-10 h-10 bg-teal-500/20 rounded-lg flex items-center justify-center">
                    <benefit.icon className="w-5 h-5 text-teal-400" />
                  </div>
                  <p className="text-gray-200 pt-2">{benefit.text}</p>
                </div>
              ))}
            </div>

            {/* Social Proof */}
            <div className="flex items-center space-x-8 text-sm text-gray-400">
              <div>
                <div className="text-3xl font-bold text-white">50K+</div>
                <div>Links Created</div>
              </div>
              <div className="h-12 w-px bg-white/10"></div>
              <div>
                <div className="text-3xl font-bold text-white">2M+</div>
                <div>Monthly Clicks</div>
              </div>
            </div>
          </div>

          {/* Right Column - Auth Form */}
          <div className="lg:pl-8 animate-scale-in">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  {isSignUp ? 'Get Started Free' : 'Welcome Back'}
                </h2>
                <p className="text-gray-400">
                  {isSignUp ? 'Create your link page in 60 seconds' : 'Sign in to your account'}
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                    placeholder="••••••••"
                    required
                    disabled={loading}
                    minLength={6}
                  />
                  {isSignUp && (
                    <p className="text-xs text-gray-400 mt-1">Minimum 6 characters</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold py-3.5 rounded-xl hover:from-teal-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : isSignUp ? 'Create Free Account' : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setEmail('')
                    setPassword('')
                  }}
                  disabled={loading}
                  className="text-teal-400 hover:text-teal-300 text-sm transition"
                >
                  {isSignUp
                    ? 'Already have an account? Sign in'
                    : "Don't have an account? Sign up free"}
                </button>
              </div>

              {/* Pricing Preview */}
              <div className="mt-8 pt-8 border-t border-white/10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-xl">
                    <div className="text-2xl font-bold text-white">Free</div>
                    <div className="text-xs text-gray-400 mt-1">Forever</div>
                    <div className="text-xs text-gray-300 mt-3">
                      Unlimited links<br/>
                      6 themes<br/>
                      Basic analytics
                    </div>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-xl border border-teal-500/30 relative">
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-teal-500 text-white text-xs px-3 py-0.5 rounded-full font-semibold">
                      POPULAR
                    </div>
                    <div className="text-2xl font-bold text-white">$5</div>
                    <div className="text-xs text-gray-300 mt-1">per month</div>
                    <div className="text-xs text-gray-300 mt-3">
                      Everything +<br/>
                      Premium themes<br/>
                      Advanced analytics
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-400">
              Professional tools for serious creators
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Palette,
                title: 'Beautiful Themes',
                description: 'Choose from dozens of stunning, animated themes. Make your page uniquely yours with customization options.',
              },
              {
                icon: BarChart3,
                title: 'Powerful Analytics',
                description: 'Track every click, view, and conversion. Know exactly what content resonates with your audience.',
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Optimized for speed and mobile. Your audience gets a smooth experience on any device.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 animate-bounce-in"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 backdrop-blur-sm py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
          <p>© 2026 Silovra. Built for creators who want more.</p>
        </div>
      </footer>
    </div>
  )
}
