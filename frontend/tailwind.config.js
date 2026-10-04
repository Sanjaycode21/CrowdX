/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ops: {
          bg: '#f8fafc',       // Very light slate background
          surface: '#ffffff',  // White card surface
          subtle: '#f1f5f9',   // Card hover / table row
          border: '#e2e8f0',   // Thin clean border
          text: '#0f172a',     // Dark charcoal typography
          muted: '#64748b',    // Muted label text
          accent: '#2563eb'    // Restrained primary blue
        },
        risk: {
          low: '#16a34a',      // Calm green
          medium: '#d97706',   // Amber
          high: '#ea580c',     // Orange/Red
          critical: '#dc2626'  // Red
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
}
