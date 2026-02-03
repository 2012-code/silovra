'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Sparkles, Zap, Link2, Check, X, TrendingUp, DollarSign, Palette, BarChart3, Globe, Crown } from 'lucide-react'
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
            emailRedirectTo: `${window.location.origin}/dashboard`,
          },
        })
        if (error) throw error
        toast.success('Check your email to confirm your account!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/dashboard')
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link2 className="w-8 h-8 text-purple-400" />
              <span className="text-2xl font-bold text-white">Silovra</span>
            </div>
            <button
              onClick={() => setIsSignUp(false)}
              className="text-white hover:text-purple-300 transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-6 animate-bounce-in">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-purple-200">Better than Linktree. Half the price.</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in">
            Your Links,
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
              Beautifully Presented
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto animate-slide-up">
            Create stunning link in bio pages with animations, analytics, and unlimited customization. 
            Save $48/year compared to Linktree.
          </p>

          {/* Quick Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12 text-sm text-gray-300">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span>10x Better Features</span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span>44% Cheaper</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>Animated Themes</span>
            </div>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="max-w-5xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Why Switch from Linktree?
          </h2>
          
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">Feature</th>
                    <th className="px-6 py-4 text-center text-gray-400 font-semibold">Linktree</th>
                    <th className="px-6 py-4 text-center text-purple-400 font-semibold">Silovra ✨</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  <tr>
                    <td className="px-6 py-4 text-gray-300">Price</td>
                    <td className="px-6 py-4 text-center text-gray-400">$9/month</td>
                    <td className="px-6 py-4 text-center text-green-400 font-bold">$5/month</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-300">Animated Themes</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-red-400 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-300">Custom Themes</td>
                    <td className="px-6 py-4 text-center text-gray-400">20+</td>
                    <td className="px-6 py-4 text-center text-green-400 font-bold">50+</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-300">Analytics</td>
                    <td className="px-6 py-4 text-center text-gray-400">Basic</td>
                    <td className="px-6 py-4 text-center text-green-400">Advanced</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-300">A/B Testing</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-red-400 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-300">Scheduling</td>
                    <td className="px-6 py-4 text-center"><X className="w-5 h-5 text-red-400 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-300">Custom Domain</td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-gray-400 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-gray-300">Email Capture</td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-gray-400 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><Check className="w-5 h-5 text-green-400 mx-auto" /></td>
                  </tr>
                  <tr className="bg-purple-500/10">
                    <td className="px-6 py-4 text-white font-bold">Annual Savings</td>
                    <td className="px-6 py-4 text-center text-gray-400">-</td>
                    <td className="px-6 py-4 text-center text-green-400 font-bold">$48/year</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Everything You Need, Nothing You Don't
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <Palette className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">50+ Animated Themes</h3>
              <p className="text-gray-300">Gorgeous themes with smooth animations. Make your links stand out.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <BarChart3 className="w-12 h-12 text-pink-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Advanced Analytics</h3>
              <p className="text-gray-300">Track clicks, views, and conversions. Know what works.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <Globe className="w-12 h-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Custom Domains</h3>
              <p className="text-gray-300">Use your own domain. Build your brand.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <Zap className="w-12 h-12 text-yellow-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">A/B Testing</h3>
              <p className="text-gray-300">Test different link orders. Optimize conversions.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <Crown className="w-12 h-12 text-orange-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Priority Support</h3>
              <p className="text-gray-300">Real humans. Fast responses. We actually care.</p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300">
              <Sparkles className="w-12 h-12 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Branding (Free)</h3>
              <p className="text-gray-300">Even free users can remove our badge. Your page, your brand.</p>
            </div>
          </div>
        </div>

        {/* Auth Form */}
        <div className="max-w-md mx-auto">
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-center mb-6">
              <Link2 className="w-12 h-12 text-purple-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-white text-center mb-2">
              {isSignUp ? 'Start Free Today' : 'Welcome Back'}
            </h2>
            <p className="text-gray-400 text-center mb-6">
              {isSignUp ? 'No credit card required. 10 free themes forever.' : 'Sign in to continue'}
            </p>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="you@example.com"
                  required
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
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : isSignUp ? 'Start Free' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-purple-400 hover:text-purple-300 text-sm"
              >
                {isSignUp
                  ? 'Already have an account? Sign in'
                  : "Don't have an account? Sign up free"}
              </button>
            </div>
          </div>

          {/* Pricing Preview */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <div className="text-2xl font-bold text-white mb-1">FREE</div>
              <div className="text-sm text-gray-400 mb-3">Forever</div>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>✓ Unlimited links</li>
                <li>✓ 10 themes</li>
                <li>✓ Basic analytics</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 rounded-xl p-6 text-center relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-500 text-white text-xs px-3 py-1 rounded-full">
                POPULAR
              </div>
              <div className="text-2xl font-bold text-white mb-1">$5</div>
              <div className="text-sm text-gray-300 mb-3">per month</div>
              <ul className="text-xs text-gray-300 space-y-1">
                <li>✓ Everything in Free</li>
                <li>✓ 50+ premium themes</li>
                <li>✓ Advanced analytics</li>
                <li>✓ Custom domain</li>
                <li>✓ A/B testing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 backdrop-blur-sm py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400 text-sm">
          <p>© 2026 Silovra. Made with ❤️ for creators.</p>
        </div>
      </footer>
    </div>
  )
}
