'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { LogOut, Plus, Trash2, Eye, Settings, Sparkles, Crown, Copy, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import { themes, ThemeKey } from '@/lib/themes'

interface User {
  id: string
  email?: string
}

interface Link {
  id: string
  title: string
  url: string
  order: number
}

interface Profile {
  username: string
  bio: string
  theme: ThemeKey
  is_pro: boolean
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'links' | 'design' | 'settings'>('links')
  
  // Form states
  const [newLinkTitle, setNewLinkTitle] = useState('')
  const [newLinkUrl, setNewLinkUrl] = useState('')
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>('emerald')
  
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/')
        return
      }

      setUser(user)
      await loadProfile(user.id)
      await loadLinks(user.id)
    } catch (error) {
      console.error('Error checking user:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (data) {
        setProfile(data)
        setUsername(data.username || '')
        setBio(data.bio || '')
        setSelectedTheme((data.theme as ThemeKey) || 'emerald')
      } else if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create one
        const defaultUsername = user?.email?.split('@')[0] || 'user'
        await supabase.from('profiles').insert({
          id: userId,
          username: defaultUsername,
          theme: 'emerald',
          is_pro: false
        })
        setUsername(defaultUsername)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const loadLinks = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', userId)
        .order('order', { ascending: true })

      if (data) {
        setLinks(data)
      }
    } catch (error) {
      console.error('Error loading links:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      toast.error('Error signing out')
    }
  }

  const handleAddLink = async () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim() || !user) {
      toast.error('Please fill in both title and URL')
      return
    }

    try {
      let url = newLinkUrl.trim()
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url
      }

      const { data, error } = await supabase
        .from('links')
        .insert([
          {
            user_id: user.id,
            title: newLinkTitle.trim(),
            url: url,
            order: links.length,
          },
        ])
        .select()

      if (error) throw error

      if (data && data[0]) {
        setLinks([...links, data[0]])
        setNewLinkTitle('')
        setNewLinkUrl('')
        toast.success('Link added!')
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to add link')
    }
  }

  const handleDeleteLink = async (linkId: string) => {
    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', linkId)

      if (error) throw error

      setLinks(links.filter(l => l.id !== linkId))
      toast.success('Link deleted')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete link')
    }
  }

  const handleSaveProfile = async () => {
    if (!user) return

    if (!username.trim()) {
      toast.error('Username is required')
      return
    }

    try {
      const { error} = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          username: username.trim().toLowerCase().replace(/[^a-z0-9_]/g, ''),
          bio: bio.trim(),
          theme: selectedTheme,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error

      toast.success('Profile saved!')
      await loadProfile(user.id)
    } catch (error: any) {
      toast.error(error.message || 'Failed to save profile')
    }
  }

  const handleUpgradeToPro = () => {
    window.open(
      `https://gumroad.com/l/silovra-pro?wanted=true&email=${user?.email}`,
      'gumroad',
      'width=600,height=700'
    )
    toast.success('Opening payment window...')
  }

  const copyProfileLink = () => {
    if (!username) {
      toast.error('Please set a username first')
      return
    }
    const link = `${window.location.origin}/${username}`
    navigator.clipboard.writeText(link)
    toast.success('Link copied!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-xl">Loading your dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm sticky top-0 z-50 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Silovra</span>
            </div>
            <div className="flex items-center space-x-3">
              {username && (
                <>
                  <button
                    onClick={copyProfileLink}
                    className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </button>
                  <a
                    href={`/${username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Preview</span>
                  </a>
                </>
              )}
              {!profile?.is_pro && (
                <button
                  onClick={handleUpgradeToPro}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 rounded-lg text-white transition-colors font-medium"
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}! 👋
          </h1>
          <p className="text-gray-400">
            {profile?.is_pro ? (
              <span className="text-teal-400 font-medium">✓ Pro Active</span>
            ) : (
              'Manage your links and customize your page'
            )}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'links' as const, label: 'My Links', icon: Plus },
            { id: 'design' as const, label: 'Design', icon: Sparkles },
            { id: 'settings' as const, label: 'Settings', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left Column - Main Content (3/5 width) */}
          <div className="lg:col-span-3 space-y-6">
            {activeTab === 'links' && (
              <>
                {/* Add Link Form */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Link
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={newLinkTitle}
                        onChange={(e) => setNewLinkTitle(e.target.value)}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="My Instagram"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddLink()}
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
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="instagram.com/username"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddLink()}
                      />
                    </div>

                    <button
                      onClick={handleAddLink}
                      className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold py-3 rounded-xl hover:from-teal-600 hover:to-emerald-600 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add Link</span>
                    </button>
                  </div>
                </div>

                {/* Links List */}
                <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Your Links ({links.length})</h2>
                  
                  {links.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-400 mb-2">No links yet</p>
                      <p className="text-sm text-gray-500">Add your first link above to get started!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {links.map((link) => (
                        <div
                          key={link.id}
                          className="flex items-center justify-between p-4 bg-white/10 rounded-xl hover:bg-white/15 transition-colors group"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-white truncate">{link.title}</div>
                            <div className="text-sm text-gray-400 truncate">{link.url}</div>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                              title="Open link"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => handleDeleteLink(link.id)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Delete link"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'design' && (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Choose Your Theme</h2>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {Object.entries(themes).map(([key, theme]) => (
                    <button
                      key={key}
                      onClick={() => {
                        if (theme.free || profile?.is_pro) {
                          setSelectedTheme(key as ThemeKey)
                        } else {
                          toast.error('Upgrade to Pro to use premium themes')
                        }
                      }}
                      className={`relative p-6 rounded-xl border-2 transition-all ${
                        selectedTheme === key
                          ? 'border-teal-500 bg-teal-500/20 shadow-lg'
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      } ${!theme.free && !profile?.is_pro ? 'opacity-60' : ''}`}
                    >
                      <div className="text-4xl mb-2">{theme.preview}</div>
                      <div className="text-white font-medium">{theme.name}</div>
                      {!theme.free && !profile?.is_pro && (
                        <div className="absolute top-2 right-2">
                          <Crown className="w-5 h-5 text-yellow-400" />
                        </div>
                      )}
                      {theme.free && (
                        <div className="absolute top-2 right-2 text-xs text-teal-400 font-medium">
                          FREE
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold py-3 rounded-xl hover:from-teal-600 hover:to-emerald-600 transition-all duration-200"
                >
                  Save Theme
                </button>

                {!profile?.is_pro && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-500/30 rounded-xl">
                    <p className="text-sm text-teal-200 flex items-center">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Pro to unlock all premium themes!
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-6">Profile Settings</h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="yourname"
                    />
                    <p className="text-sm text-gray-400 mt-2">
                      silovra.online/<span className="text-teal-400">{username || 'yourname'}</span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="Tell people about yourself..."
                      rows={3}
                      maxLength={150}
                    />
                    <p className="text-xs text-gray-400 mt-1">{bio.length}/150 characters</p>
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold py-3 rounded-xl hover:from-teal-600 hover:to-emerald-600 transition-all duration-200"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Live Preview (2/5 width) */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Live Preview
                </h2>
                
                <div className="aspect-[9/16] max-w-[280px] mx-auto bg-white/10 rounded-3xl overflow-hidden shadow-2xl">
                  <div 
                    className="h-full p-8 flex flex-col items-center justify-center"
                    style={{ background: themes[selectedTheme].styles.background }}
                  >
                    {/* Profile Section */}
                    <div className="mb-8 text-center">
                      <div 
                        className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold"
                        style={{ 
                          background: themes[selectedTheme].styles.profileBg,
                          color: themes[selectedTheme].styles.buttonText,
                        }}
                      >
                        {username ? username.charAt(0).toUpperCase() : '?'}
                      </div>
                      <h3 className="text-white font-bold text-lg mb-2">
                        @{username || 'yourname'}
                      </h3>
                      {bio && (
                        <p className="text-white/80 text-sm px-2">{bio}</p>
                      )}
                    </div>

                    {/* Links */}
                    <div className="space-y-3 w-full">
                      {links.length === 0 ? (
                        <div className="text-center text-white/60 text-sm py-8">
                          Your links will appear here
                        </div>
                      ) : (
                        links.slice(0, 4).map((link, index) => (
                          <div
                            key={link.id}
                            className={`w-full px-4 py-3 rounded-xl text-white text-center font-medium transition-all animate-${themes[selectedTheme].styles.animation}`}
                            style={{
                              background: themes[selectedTheme].styles.buttonBg,
                              border: themes[selectedTheme].styles.buttonBorder,
                              boxShadow: themes[selectedTheme].styles.boxShadow,
                              animationDelay: `${index * 0.1}s`,
                            }}
                          >
                            <div className="truncate">{link.title}</div>
                          </div>
                        ))
                      )}
                      {links.length > 4 && (
                        <div className="text-center text-white/40 text-xs">
                          +{links.length - 4} more
                        </div>
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
    </div>
  )
}
