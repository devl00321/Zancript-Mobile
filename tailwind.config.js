/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        void: 'var(--void)',
        surf: 'var(--surf)',
        raised: 'var(--raised)',
        overlay: 'var(--overlay)',
        bdr: 'var(--bdr)',
        'bdr-a': 'var(--bdr-a)',
        tx1: 'var(--tx1)',
        tx2: 'var(--tx2)',
        tx3: 'var(--tx3)',
        acc: 'var(--acc)',
        'acc-d': 'var(--acc-d)',
        'acc-b': 'var(--acc-b)',
        danger: 'var(--danger)',
        warn: 'var(--warn)',
        info: 'var(--info)',
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        disp: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
