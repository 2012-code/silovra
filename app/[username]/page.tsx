'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { themes, ThemeKey } from '@/lib/themes'
import { ExternalLink } from 'lucide-react'

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

interface Props {
  params: {
    username: string
  }
}

export default function UsernamePage({ params }: Props) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [theme, setTheme] = useState(themes['minimal'])

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data: profileData, error: profileErr } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', params.username)
          .single()
        
        if (!profileData || profileErr) {
          setLoading(false)
          return
        }

        setProfile(profileData)
        setTheme(themes[profileData.theme as ThemeKey] || themes['minimal'])

        const { data: linksData } = await supabase
          .from('links')
          .select('*')
          .eq('user_id', profileData.id)
          .order('order', { ascending: true })

        setLinks(linksData || [])

        // Track page view (fire and forget)
        supabase.from('analytics').insert({
          username: params.username,
          type: 'view',
          timestamp: new Date().toISOString(),
        })
      } catch (err) {
        console.error('Error loading profile page:', err)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.username])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Profile not found
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: theme.styles.background || '#000' }}
    >
      <div className="w-full max-w-2xl">
        {/* Profile Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div 
            className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl font-bold"
            style={{ 
              background: theme.styles.profileBg || '#555',
              color: theme.styles.buttonText || '#fff',
            }}
          >
            {profile.username.charAt(0).toUpperCase() || '?'}
          </div>
          
          <h1 
            className="text-4xl font-bold mb-4"
            style={{ color: theme.styles.buttonText || '#fff' }}
          >
            @{profile.username}
          </h1>
          
          {profile.bio && (
            <p 
              className="text-lg max-w-md mx-auto opacity-90"
              style={{ color: theme.styles.buttonText || '#fff' }}
            >
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links Section */}
        <div className="space-y-4 mb-12">
          {links.length === 0 ? (
            <div className="text-center text-white/60 text-sm py-4">
              No links yet.
            </div>
          ) : (
            links.map((link: Link, index: number) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full px-8 py-5 rounded-2xl font-semibold text-center transition-transform transform hover:scale-105 hover:shadow-2xl animate-${theme.styles.animation || 'fade-in'}`}
                style={{
                  background: theme.styles.buttonBg || '#333',
                  border: theme.styles.buttonBorder || '1px solid #444',
                  color: theme.styles.buttonText || '#fff',
                  boxShadow: theme.styles.boxShadow || 'none',
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>{link.title}</span>
                  <ExternalLink className="w-4 h-4 opacity-70" />
                </span>
                {/* Hover overlay */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ background: theme.styles.buttonHover || 'rgba(255,255,255,0.1)' }}
                />
              </a>
            ))
          )}
        </div>

        {/* Footer */}
        {!profile.is_pro && (
          <div className="text-center">
            <a
              href="https://silovra.online"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full"
              style={{
                background: theme.styles.profileBg || '#555',
                color: theme.styles.buttonText || '#fff',
                opacity: 0.7,
              }}
            >
              <span className="text-sm">Made with Silovra</span>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
