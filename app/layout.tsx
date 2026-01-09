import type { Metadata, Viewport } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SimulaFace - Simulação de Procedimentos Estéticos',
  description: 'Visualize os resultados de procedimentos estéticos antes de realizar. Tecnologia de IA para simulação facial realista.',
  keywords: ['estética', 'simulação facial', 'procedimentos estéticos', 'IA', 'beleza'],
  authors: [{ name: 'SimulaFace' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SimulaFace',
  },
}

export const viewport: Viewport = {
  themeColor: '#b76e79',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="antialiased min-h-screen bg-secondary-50">
        {children}
      </body>
    </html>
  )
}
