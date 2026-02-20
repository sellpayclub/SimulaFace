'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button, Card, Input } from '@/components/ui'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log('Attempting login with:', { email })
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('Login response:', { data, error: signInError })

      if (signInError) {
        console.error('Login error:', signInError)
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Email ou senha incorretos.')
        } else {
          setError(signInError.message)
        }
        setIsLoading(false)
        return
      }

      if (data?.user) {
        console.log('Login successful, redirecting...')
        // Use window.location for full page navigation so server-side
        // can read the updated auth cookies properly
        window.location.href = '/dashboard'
        return
      } else {
        setError('Erro ao fazer login. Tente novamente.')
        setIsLoading(false)
      }
    } catch (err) {
      console.error('Login exception:', err)
      setError(err instanceof Error ? err.message : 'Ocorreu um erro. Tente novamente.')
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Card padding="lg" variant="elevated">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-white text-2xl font-bold">S</span>
            </div>
          </Link>
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            Bem-vindo de volta!
          </h1>
          <p className="text-gray-600">
            Entre na sua conta para continuar
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-50 text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-primary-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-gray-600">Lembrar de mim</span>
            </label>
            <Link href="/recuperar-senha" className="text-primary-600 hover:text-primary-700">
              Esqueceu a senha?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Entrar
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-primary-100" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white text-sm text-gray-500">
              Não tem uma conta?
            </span>
          </div>
        </div>

        {/* Register Link */}
        <Link href="/cadastro">
          <Button variant="secondary" className="w-full" size="lg">
            Criar Conta
          </Button>
        </Link>
      </Card>
    </motion.div>
  )
}

