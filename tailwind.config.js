
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(210, 80%, 50%)',
        accent: 'hsl(160, 70%, 45%)',
        bg: 'hsl(0, 0%, 98%)',
        surface: 'hsl(0, 0%, 100%)',
        text: 'hsl(0, 0%, 20%)',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      spacing: {
        sm: '8px',
        md: '16px',
        lg: '24px',
      },
      boxShadow: {
        card: '0 2px 4px hsla(0, 0%, 0%, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.2s ease-in-out',
      },
    },
  },
  plugins: [],
}
