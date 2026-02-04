'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { LogOut, Plus, Trash2, Eye, BarChart3, Settings, Crown, ExternalLink, Copy, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { themes, ThemeKey } from '@/lib/themes'
import type { User } from '@supabase/auth-js'

interface Link {
  id: string
  title: string
  url: string
  order: number
}

interface Profile {
  username: string
  bio: string
  avatar_url: string
  theme: ThemeKey
  is_pro: boolean
}

export default function Dashboard() {
type AppUser = {
  id: string
  email?: string }
  const [user, setUser] = useState<AppUser | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'links' | 'design' | 'analytics' | 'settings'>('links')
  
  // Form states
  const [newLinkTitle, setNewLinkTitle] = useState('')
  const [newLinkUrl, setNewLinkUrl] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>('minimal')
  
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
useEffect(() => {
  const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
    if (!session?.user) router.push('/')
    else setUser({
      id: session.user.id,
      email: session.user.email ?? undefined
    })
  })

  return () => listener.subscription.unsubscribe()
}, [])
  
  if (!user) {
    router.push('/')
    return
  }

  // حول Supabase User → AppUser
  setUser({
    id: user.id,
    email: user.email ?? undefined
  })

  await loadProfile(user.id)
  await loadLinks(user.id)
  setLoading(false)
}


  const loadProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (data) {
      setProfile(data)
      setUsername(data.username || '')
      setBio(data.bio || '')
      setSelectedTheme(data.theme || 'minimal')
    }
  }

  const loadLinks = async (userId: string) => {
    const { data, error } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', userId)
      .order('order', { ascending: true })

    if (data) {
      setLinks(data)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const handleAddLink = async () => {
    if (!newLinkTitle || !newLinkUrl || !user) return

    // Validate URL
    let url = newLinkUrl
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    const { data, error } = await supabase
      .from('links')
      .insert([
        {
          user_id: user.id,
          title: newLinkTitle,
          url: url,
          order: links.length,
        },
      ])
      .select()

    if (error) {
      toast.error('Failed to add link')
    } else {
      toast.success('Link added!')
      setNewLinkTitle('')
      setNewLinkUrl('')
      if (data) setLinks([...links, data[0]])
    }
  }

  const handleDeleteLink = async (linkId: string) => {
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', linkId)

    if (error) {
      toast.error('Failed to delete link')
    } else {
      toast.success('Link deleted')
      setLinks(links.filter(l => l.id !== linkId))
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username,
        bio,
        theme: selectedTheme,
        updated_at: new Date().toISOString(),
      })

    if (error) {
      toast.error('Failed to save profile')
    } else {
      toast.success('Profile saved!')
      await loadProfile(user.id)
    }
  }

  const handleUpgradeToPro = () => {
    // Open Gumroad overlay
    window.open(
      `https://gumroad.com/l/${process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_PERMALINK}?wanted=true&email=${user?.email}`,
      'gumroad',
      'width=500,height=600'
    )
  }

  const copyProfileLink = () => {
    const link = `${window.location.origin}/${username}`
    navigator.clipboard.writeText(link)
    toast.success('Link copied to clipboard!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
          {/* Header */}
          <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-8 h-8 text-purple-400" />
                  <span className="text-2xl font-bold text-white">Silovra</span>
                </div>
                <div className="flex items-center space-x-4">
                  {username && (
                    <button
                      onClick={copyProfileLink}
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span className="hidden sm:inline">Copy Link</span>
                </button>
              )}
              {username && (
                <a
                  href={`/${username}`}
                  target="_blank"
                  className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Preview</span>
                </a>
              )}
              {!profile?.is_pro && (
                <button
                  onClick={handleUpgradeToPro}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg text-white transition-colors"
                >
                  <Crown className="w-4 h-4" />
                  <span>Upgrade $5/mo</span>
                </button>
              )}
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex space-x-4 mb-8 overflow-x-auto">
          {[
            { id: 'links', label: 'Links', icon: Plus },
            { id: 'design', label: 'Design', icon: Sparkles },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Editor */}
          <div>
            {activeTab === 'links' && (
              <div className="space-y-6">
                {/* Add Link Form */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Add New Link</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={newLinkTitle}
                        onChange={(e) => setNewLinkTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="My Instagram"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        URL
                      </label>
                      <input
                        type="text"
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="instagram.com/username"
                      />
                    </div>

                    <button
                      onClick={handleAddLink}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add Link</span>
                    </button>
                  </div>
                </div>

                {/* Links List */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold text-white mb-6">Your Links</h2>
                  
                  {links.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      No links yet. Add your first link above!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {links.map((link) => (
                        <div
                          key={link.id}
                          className="flex items-center justify-between p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-white">{link.title}</div>
                            <div className="text-sm text-gray-400 truncate">{link.url}</div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <button
                              onClick={() => handleDeleteLink(link.id)}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'design' && (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Choose Your Theme</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {Object.entries(themes).map(([key, theme]) => (
                    <button
                      key={key}
                      onClick={() => {
                        if (theme.free || profile?.is_pro) {
                          setSelectedTheme(key as ThemeKey)
                        } else {
                          toast.error('Upgrade to Pro to use this theme')
                        }
                      }}
                      className={`relative p-6 rounded-xl border-2 transition-all ${
                        selectedTheme === key
                          ? 'border-purple-500 bg-purple-500/20'
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      } ${!theme.free && !profile?.is_pro ? 'opacity-50' : ''}`}
                    >
                      <div className="text-4xl mb-2">{theme.preview}</div>
                      <div className="text-white font-medium">{theme.name}</div>
                      {!theme.free && !profile?.is_pro && (
                        <div className="absolute top-2 right-2">
                          <Crown className="w-4 h-4 text-yellow-400" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                >
                  Save Theme
                </button>

                {!profile?.is_pro && (
                  <div className="mt-6 p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg">
                    <p className="text-sm text-purple-200">
                      💎 Upgrade to Pro to unlock all premium themes!
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Analytics</h2>
                
                <div className="space-y-4">
                  <div className="p-6 bg-white/10 rounded-lg">
                    <div className="text-3xl font-bold text-white mb-2">0</div>
                    <div className="text-gray-400">Total Views</div>
                  </div>

                  <div className="p-6 bg-white/10 rounded-lg">
                    <div className="text-3xl font-bold text-white mb-2">0</div>
                    <div className="text-gray-400">Total Clicks</div>
                  </div>

                  <div className="p-4 bg-purple-500/20 border border-purple-500/30 rounded-lg text-center">
                    <p className="text-sm text-purple-200">
                      📊 Analytics coming soon! Track your views and clicks.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="yourname"
                    /> 

                    {typeof window !== 'undefined' && (
                      <p className="text-sm text-gray-400 mt-2">
                        Your page: {window.location.origin}/{username || 'yourname'}
                      </p>
                    )}

                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Tell people about yourself..."
                      rows={3}
                    />
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Live Preview */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Live Preview</h2>
              
              <div className="aspect-[9/16] max-w-[300px] mx-auto bg-white/10 rounded-3xl overflow-hidden shadow-2xl">
                <div 
                  className="h-full p-8 flex flex-col items-center justify-center"
                  style={{ background: themes[selectedTheme].styles.background }}
                >
                  {/* Profile Section */}
                  <div className="mb-8 text-center">
                    <div 
                      className="w-20 h-20 rounded-full mx-auto mb-4"
                      style={{ background: themes[selectedTheme].styles.profileBg }}
                    />
                    <h3 className="text-white font-bold text-lg mb-2">
                      {username || 'yourname'}
                    </h3>
                    {bio && (
                      <p className="text-white/80 text-sm">{bio}</p>
                    )}
                  </div>

                  {/* Links */}
                  <div className="space-y-3 w-full">
                    {links.length === 0 ? (
                      <div className="text-center text-white/60 text-sm py-4">
                        Your links will appear here
                      </div>
                    ) : (
                      links.slice(0, 4).map((link, index) => (
                        <div
                          key={link.id}
                          className={`w-full px-4 py-3 rounded-lg text-white text-center font-medium transition-all animate-${themes[selectedTheme].styles.animation}`}
                          style={{
                            background: themes[selectedTheme].styles.buttonBg,
                            border: themes[selectedTheme].styles.buttonBorder,
                            boxShadow: themes[selectedTheme].styles.boxShadow,
                            animationDelay: `${index * 0.1}s`,
                          }}
                        >
                          {link.title}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Badge */}
                  {!profile?.is_pro && (
                    <div className="mt-8 text-white/40 text-xs">
                      Made with Silovra
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
