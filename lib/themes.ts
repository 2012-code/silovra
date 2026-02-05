export interface ThemeStyles {
  background: string
  buttonBg: string
  buttonBorder: string
  buttonText: string
  buttonHover: string
  profileBg: string
  animation: string
  boxShadow: string
}

export interface Theme {
  name: string
  preview: string
  free: boolean
  styles: ThemeStyles
}

export const themes: Record<string, Theme> = {
  emerald: {
    name: 'Emerald',
    preview: '💎',
    free: true,
    styles: {
      background: 'linear-gradient(135deg, #134e4a 0%, #14b8a6 100%)',
      buttonBg: 'rgba(255, 255, 255, 0.15)',
      buttonBorder: '2px solid rgba(255, 255, 255, 0.3)',
      buttonText: '#ffffff',
      buttonHover: 'rgba(255, 255, 255, 0.25)',
      profileBg: 'rgba(255, 255, 255, 0.1)',
      animation: 'fade-in',
      boxShadow: 'none',
    }
  },
  coral: {
    name: 'Coral',
    preview: '🧡',
    free: true,
    styles: {
      background: 'linear-gradient(135deg, #fb923c 0%, #f97316 100%)',
      buttonBg: 'rgba(255, 255, 255, 0.2)',
      buttonBorder: '2px solid rgba(255, 255, 255, 0.35)',
      buttonText: '#ffffff',
      buttonHover: 'rgba(255, 255, 255, 0.3)',
      profileBg: 'rgba(255, 255, 255, 0.15)',
      animation: 'slide-up',
      boxShadow: 'none',
    }
  },
  ocean: {
    name: 'Ocean',
    preview: '🌊',
    free: true,
    styles: {
      background: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 100%)',
      buttonBg: 'rgba(255, 255, 255, 0.15)',
      buttonBorder: '2px solid rgba(255, 255, 255, 0.3)',
      buttonText: '#ffffff',
      buttonHover: 'rgba(255, 255, 255, 0.25)',
      profileBg: 'rgba(255, 255, 255, 0.1)',
      animation: 'bounce-in',
      boxShadow: 'none',
    }
  },
  sunset: {
    name: 'Sunset',
    preview: '🌅',
    free: true,
    styles: {
      background: 'linear-gradient(to top, #f97316 0%, #fb923c 50%, #fbbf24 100%)',
      buttonBg: 'rgba(255, 255, 255, 0.2)',
      buttonBorder: '2px solid rgba(255, 255, 255, 0.35)',
      buttonText: '#ffffff',
      buttonHover: 'rgba(255, 255, 255, 0.3)',
      profileBg: 'rgba(255, 255, 255, 0.15)',
      animation: 'scale-in',
      boxShadow: 'none',
    }
  },
  midnight: {
    name: 'Midnight',
    preview: '🌙',
    free: true,
    styles: {
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      buttonBg: 'rgba(20, 184, 166, 0.2)',
      buttonBorder: '2px solid rgba(20, 184, 166, 0.4)',
      buttonText: '#ffffff',
      buttonHover: 'rgba(20, 184, 166, 0.3)',
      profileBg: 'rgba(20, 184, 166, 0.1)',
      animation: 'fade-in',
      boxShadow: 'none',
    }
  },
  forest: {
    name: 'Forest',
    preview: '🌲',
    free: true,
    styles: {
      background: 'linear-gradient(120deg, #065f46 0%, #10b981 100%)',
      buttonBg: 'rgba(255, 255, 255, 0.15)',
      buttonBorder: '2px solid rgba(255, 255, 255, 0.3)',
      buttonText: '#ffffff',
      buttonHover: 'rgba(255, 255, 255, 0.25)',
      profileBg: 'rgba(255, 255, 255, 0.1)',
      animation: 'slide-up',
      boxShadow: 'none',
    }
  },
  // PRO THEMES
  ruby: {
    name: 'Ruby',
    preview: '💎',
    free: false,
    styles: {
      background: 'linear-gradient(135deg, #be123c 0%, #f43f5e 100%)',
      buttonBg: 'rgba(255, 255, 255, 0.2)',
      buttonBorder: '2px solid rgba(255, 255, 255, 0.35)',
      buttonText: '#ffffff',
      buttonHover: 'rgba(255, 255, 255, 0.3)',
      profileBg: 'rgba(255, 255, 255, 0.15)',
      animation: 'bounce-in',
      boxShadow: '0 5px 20px rgba(244, 63, 94, 0.3)',
    }
  },
  sapphire: {
    name: 'Sapphire',
    preview: '💠',
    free: false,
    styles: {
      background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
      buttonBg: 'rgba(255, 255, 255, 0.2)',
      buttonBorder: '2px solid rgba(255, 255, 255, 0.35)',
      buttonText: '#ffffff',
      buttonHover: 'rgba(255, 255, 255, 0.3)',
      profileBg: 'rgba(255, 255, 255, 0.15)',
      animation: 'scale-in',
      boxShadow: '0 5px 20px rgba(59, 130, 246, 0.3)',
    }
  },
  amethyst: {
    name: 'Amethyst',
    preview: '🔮',
    free: false,
    styles: {
      background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      buttonBg: 'rgba(255, 255, 255, 0.2)',
      buttonBorder: '2px solid rgba(255, 255, 255, 0.35)',
      buttonText: '#ffffff',
      buttonHover: 'rgba(255, 255, 255, 0.3)',
      profileBg: 'rgba(255, 255, 255, 0.15)',
      animation: 'bounce-in',
      boxShadow: '0 5px 20px rgba(168, 85, 247, 0.3)',
    }
  },
  gold: {
    name: 'Gold',
    preview: '✨',
    free: false,
    styles: {
      background: 'linear-gradient(135deg, #a16207 0%, #eab308 100%)',
      buttonBg: 'rgba(255, 255, 255, 0.2)',
      buttonBorder: '2px solid rgba(255, 255, 255, 0.35)',
      buttonText: '#ffffff',
      buttonHover: 'rgba(255, 255, 255, 0.3)',
      profileBg: 'rgba(255, 255, 255, 0.15)',
      animation: 'scale-in',
      boxShadow: '0 5px 20px rgba(234, 179, 8, 0.3)',
    }
  },
}

export type ThemeKey = keyof typeof themes
