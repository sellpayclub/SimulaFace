'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, User, Building, ArrowRight, Check } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button, Card, Input } from '@/components/ui'

export default function CadastroPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    clinica: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem.')
      setIsLoading(false)
      return
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      setIsLoading(false)
      return
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            nome: formData.nome,
            clinica: formData.clinica,
          },
        },
      })

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('Este email já está cadastrado.')
        } else {
          setError(signUpError.message)
        }
        return
      }

      // Profile is created automatically via database trigger
      // See supabase-schema.sql for the trigger definition

      setSuccess(true)
    } catch (err) {
      setError('Ocorreu um erro. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card padding="lg" variant="elevated" className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">
            Cadastro realizado!
          </h1>
          <p className="text-gray-600 mb-6">
            Enviamos um email de confirmação para <strong>{formData.email}</strong>. 
            Por favor, verifique sua caixa de entrada.
          </p>
          <Link href="/login">
            <Button className="w-full">
              Ir para Login
            </Button>
          </Link>
        </Card>
      </motion.div>
    )
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
            Crie sua conta
          </h1>
          <p className="text-gray-600">
            Comece a usar o SimulaFace hoje mesmo
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              name="nome"
              placeholder="Seu nome completo"
              value={formData.nome}
              onChange={handleChange}
              className="pl-12"
              required
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="email"
              name="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleChange}
              className="pl-12"
              required
            />
          </div>

          <div className="relative">
            <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              name="clinica"
              placeholder="Nome da clínica (opcional)"
              value={formData.clinica}
              onChange={handleChange}
              className="pl-12"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Crie uma senha"
              value={formData.password}
              onChange={handleChange}
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

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Confirme a senha"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="pl-12"
              required
            />
          </div>

          <label className="flex items-start gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              className="w-4 h-4 mt-0.5 rounded border-primary-300 text-primary-600 focus:ring-primary-500"
              required
            />
            <span className="text-gray-600">
              Li e aceito os{' '}
              <Link href="/termos" className="text-primary-600 hover:underline">
                Termos de Uso
              </Link>{' '}
              e{' '}
              <Link href="/privacidade" className="text-primary-600 hover:underline">
                Política de Privacidade
              </Link>
            </span>
          </label>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-5 h-5" />}
          >
            Criar Conta
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-primary-100" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white text-sm text-gray-500">
              Já tem uma conta?
            </span>
          </div>
        </div>

        {/* Login Link */}
        <Link href="/login">
          <Button variant="secondary" className="w-full" size="lg">
            Fazer Login
          </Button>
        </Link>
      </Card>
    </motion.div>
  )
}

