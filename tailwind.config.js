module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--primary))',
        accent: 'hsl(var(--accent))',
        bg: 'hsl(var(--bg))',
        surface: 'hsl(var(--surface))',
        text: 'hsl(var(--text))',
        muted: 'hsl(var(--muted))',
        border: 'hsl(var(--border))',
      },
      spacing: {
        sm: '8px',
        md: '16px',
        lg: '24px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      boxShadow: {
        card: '0 2px 4px hsla(0, 0%, 0%, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-in-out',
        'slide-up': 'slideUp 200ms ease-in-out',
      },
    },
  },
  plugins: [],
}
