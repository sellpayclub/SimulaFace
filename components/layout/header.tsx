'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu, X, User, LogOut, History, Home } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui'

interface HeaderProps {
  user?: { email?: string; id?: string } | null
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const navItems = user
    ? [
        { href: '/dashboard', label: 'Dashboard', icon: Home },
        { href: '/historico', label: 'Histórico', icon: History },
      ]
    : []

  return (
    <header className="sticky top-0 z-40 glass border-b border-primary-100">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <span className="text-white text-xl font-bold">S</span>
          </div>
          <span className="text-xl font-serif font-bold text-gradient">
            SimulaFace
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                  transition-colors
                  ${isActive 
                    ? 'text-primary-700 bg-primary-100' 
                    : 'text-gray-600 hover:text-primary-700 hover:bg-primary-50'
                  }
                `}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            )
          })}

          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-primary-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span className="max-w-[150px] truncate">{user.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg text-gray-500 hover:text-primary-700 hover:bg-primary-50 transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : null}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-primary-50"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={{
          height: isMobileMenuOpen ? 'auto' : 0,
          opacity: isMobileMenuOpen ? 1 : 0,
        }}
        className="md:hidden overflow-hidden border-t border-primary-100"
      >
        <div className="container mx-auto px-4 py-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                  ${isActive 
                    ? 'text-primary-700 bg-primary-100' 
                    : 'text-gray-600 hover:bg-primary-50'
                  }
                `}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}

          {user ? (
            <>
              <div className="px-4 py-3 text-sm text-gray-500 border-t border-primary-100 mt-2 pt-4">
                {user.email}
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </>
          ) : null}
        </div>
      </motion.div>
    </header>
  )
}

