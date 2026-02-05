import { supabaseAdmin } from '@/lib/supabase'
import { themes, ThemeKey } from '@/lib/themes'
import { notFound } from 'next/navigation'
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
  theme: ThemeKey
  is_pro: boolean
}

async function getProfile(username: string) {
  try {
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()

    if (!profile) return null

    const { data: links } = await supabaseAdmin
      .from('links')
      .select('*')
      .eq('user_id', profile.id)
      .order('order', { ascending: true })

    return { profile, links: links || [] }
  } catch (error) {
    return null
  }
}

async function trackView(username: string) {
  try {
    await supabaseAdmin
      .from('analytics')
      .insert({
        username,
        type: 'view',
        timestamp: new Date().toISOString(),
      })
  } catch (error) {
    // Silently fail
  }
}

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const data = await getProfile(params.username)

  if (!data) {
    notFound()
  }

  const { profile, links } = data
  const theme = themes[profile.theme || 'emerald']

  // Track view
  trackView(params.username).catch(() => {})

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: theme.styles.background }}
    >
      <div className="w-full max-w-2xl">
        {/* Profile Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div 
            className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl font-bold shadow-2xl"
            style={{ 
              background: theme.styles.profileBg,
              color: theme.styles.buttonText,
            }}
          >
            {profile.username.charAt(0).toUpperCase()}
          </div>
          
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: theme.styles.buttonText }}
          >
            @{profile.username}
          </h1>
          
          {profile.bio && (
            <p 
              className="text-lg md:text-xl max-w-md mx-auto opacity-90 leading-relaxed"
              style={{ color: theme.styles.buttonText }}
            >
              {profile.bio}
            </p>
          )}
        </div>

        {/* Links Section */}
        <div className="space-y-4 mb-12">
          {links.map((link: Link, index: number) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`block w-full px-8 py-5 rounded-2xl font-semibold text-center transition-all transform hover:scale-105 hover:shadow-2xl animate-${theme.styles.animation} group relative overflow-hidden`}
              style={{
                background: theme.styles.buttonBg,
                border: theme.styles.buttonBorder,
                color: theme.styles.buttonText,
                boxShadow: theme.styles.boxShadow,
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <span className="flex items-center justify-center space-x-3 relative z-10">
                <span className="text-lg">{link.title}</span>
                <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </span>
              
              {/* Hover effect overlay */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: theme.styles.buttonHover }}
              />
            </a>
          ))}

          {links.length === 0 && (
            <div 
              className="text-center py-12 opacity-60"
              style={{ color: theme.styles.buttonText }}
            >
              <p className="text-lg">No links yet</p>
            </div>
          )}
        </div>

        {/* Footer Badge */}
        {!profile.is_pro && (
          <div className="text-center animate-fade-in">
            <a
              href="https://silovra.online"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-full transition-all hover:scale-105 shadow-lg"
              style={{
                background: theme.styles.profileBg,
                color: theme.styles.buttonText,
                opacity: 0.8,
              }}
            >
              <span className="text-sm font-medium">Made with Silovra</span>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata({ params }: { params: { username: string } }) {
  const data = await getProfile(params.username)

  if (!data) {
    return {
      title: 'Profile Not Found - Silovra',
    }
  }

  return {
    title: `@${data.profile.username} - Silovra`,
    description: data.profile.bio || `Check out @${data.profile.username}'s links on Silovra`,
  }
}
