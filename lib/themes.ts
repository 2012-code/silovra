export const themes = {
  minimal: {
    name: 'Minimal',
    preview: '🎨',
    free: true,
    styles: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      buttonBg: 'rgba(255, 255, 255, 0.2)',
      buttonBorder: '2px solid rgba(255, 255, 255, 0.3)',
      buttonText: '#ffffff',
      buttonHover: 'rgba(255, 255, 255, 0.3)',
      profileBg: 'rgba(255, 255, 255, 0.1)',
      animation: 'fade-in',
    }
  },
  gradient: {
    name: 'Gradient',
    preview: '🌈',
    free: true,
    styles: {
      background: 'linear-gradient(to right, #fa709a 0%, #fee140 100%)',
      buttonBg: 'rgba(255, 255, 255, 0.25)',
      buttonBorder: '2px solid rgba(255, 255, 255, 0.4)',
      buttonText: '#ffffff',
      buttonHover: 'rgba(255, 255, 255, 0.35)',
      profileBg: 'rgba(255, 255, 255, 0.15)',
      animation: 'slide-up',
    }
  },
  neon: {
    name: 'Neon',
    preview: '⚡',
    free: true,
    styles: {
      background: 'linear-gradient(135deg, #000000 0%, #434343 100%)',
      buttonBg: 'rgba(139, 92, 246, 0.3)',
      buttonBorder: '2px solid #8b5cf6',
      buttonText: '#ffffff',
      buttonHover: 'rgba(139, 92, 246, 0.5)',
      profileBg: 'rgba(139, 92, 246, 0.2)',
      animation: 'bounce-in',
      boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
    }
  },
  ocean: {
    name: 'Ocean',
    preview: '🌊',
    free: true,
    styles: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      buttonBg: 'rgba(255, 255, 255, 0.2)',
      buttonBorder: '2px solid rgba(255, 255, 255, 0.3)',
      buttonText: '#ffffff',
      buttonHover: 'rgba(255, 255, 255, 0.3)',
      profileBg: 'rgba(255, 255, 255, 0.1)',
      animation: 'fade-in',
    }
  },
  sunset: {
    name: 'Sunset',
    preview: '🌅',
    free: true,
    styles: {
      background: 'linear-gradient(to top, #ff9a56 0%, #ff6a88 55%, #ff99ac 100%)',
      buttonBg: 'rgba(255, 255, 255, 0.25)',
      buttonBorder: '2px solid rgba(255, 255, 255, 0.4)',
      buttonText: '#ffffff',
      buttonHover: 'rgba(255, 255, 255, 0.35)',
      profileBg: 'rgba(255, 255, 255, 0.15)',
      animation: 'slide-up',
    }
  },
  forest: {
    name: 'Forest',
    preview: '🌲',
    free: true,
    styles: {
      background: 'linear-gradient(120deg, #134e5e 0%, #71b280 100%)',
      buttonBg: 'rgba(255, 255, 255, 0.2)',
      buttonBorder: '2px solid rgba(255, 255, 255, 0.3)',
      buttonText: '#ffffff',
      buttonHover: 'rgba(255, 255, 255, 0.3)',
      profileBg: 'rgba(255, 255, 255, 0.1)',
      animation: 'fade-in',
    }
  },
  rose: {
    name: 'Rose Gold',
    preview: '🌹',
    free: false,
    styles: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      buttonBg: 'rgba(255, 255, 255, 0.25)',
      buttonBorder: '2px solid rgba(255, 255, 255, 0.4)',
      buttonText: '#ffffff',
      buttonHover: 'rgba(255, 255, 255, 0.35)',
      profileBg: 'rgba(255, 255, 255, 0.15)',
      animation: 'bounce-in',
      boxShadow: '0 5px 15px rgba(245, 87, 108, 0.3)',
    }
  },
  midnight: {
    name: 'Midnight',
    preview: '🌙',
    free: false,
    styles: {
      background: 'linear-gradient(to top, #09203f 0%, #537895 100%)',
      buttonBg: 'rgba(255, 255, 255, 0.15)',
      buttonBorder: '2px solid rgba(255, 255, 255, 0.25)',
      buttonText: '#ffffff',
      buttonHover: 'rgba(255, 255, 255, 0.25)',
      profileBg: 'rgba(255, 255, 255, 0.1)',
      animation: 'float',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    }
  },
  candy: {
    name: 'Candy',
    preview: '🍭',
    free: false,
    styles: {
      background: 'linear-gradient(to right, #ff9a9e 0%, #fecfef 50%, #fda085 100%)',
      buttonBg: 'rgba(255, 255, 255, 0.3)',
      buttonBorder: '2px solid rgba(255, 255, 255, 0.5)',
      buttonText: '#ffffff',
      buttonHover: 'rgba(255, 255, 255, 0.4)',
      profileBg: 'rgba(255, 255, 255, 0.2)',
      animation: 'bounce-in',
      boxShadow: '0 5px 15px rgba(255, 154, 158, 0.3)',
    }
  },
  cosmic: {
    name: 'Cosmic',
    preview: '✨',
    free: false,
    styles: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      buttonBg: 'rgba(255, 255, 255, 0.2)',
      buttonBorder: '2px solid rgba(255, 255, 255, 0.35)',
      buttonText: '#ffffff',
      buttonHover: 'rgba(255, 255, 255, 0.3)',
      profileBg: 'rgba(255, 255, 255, 0.15)',
      animation: 'float',
      boxShadow: '0 0 30px rgba(102, 126, 234, 0.4)',
    }
  },
}

export type ThemeKey = keyof typeof themes
