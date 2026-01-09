'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Camera, 
  History, 
  CreditCard, 
  TrendingUp, 
  Sparkles,
  ArrowRight,
  Zap
} from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { useSimulationStore } from '@/lib/store'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/types'

export default function DashboardPage() {
  const { reset } = useSimulationStore()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [simulationCount, setSimulationCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        
        if (profileData) {
          setProfile(profileData as Profile)
        }

        // Count simulations
        const { count } = await supabase
          .from('simulacoes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
        
        setSimulationCount(count || 0)
      }
    }

    fetchData()
  }, [supabase])

  const handleNewSimulation = () => {
    reset()
  }

  const stats = [
    {
      label: 'Simulações Realizadas',
      value: simulationCount.toString(),
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Simulações Restantes',
      value: profile?.simulacoes_restantes?.toString() || '0',
      icon: Zap,
      color: 'text-amber-600',
      bgColor: 'bg-amber-100',
    },
    {
      label: 'Plano Atual',
      value: profile?.plano === 'free' ? 'Gratuito' : profile?.plano === 'pro' ? 'Profissional' : 'Clínica',
      icon: CreditCard,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
          Olá, {profile?.nome?.split(' ')[0] || 'Usuário'}! 👋
        </h1>
        <p className="text-gray-600">
          Bem-vindo ao SimulaFace. O que deseja fazer hoje?
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid sm:grid-cols-3 gap-4 mb-8"
      >
        {stats.map((stat, index) => (
          <Card key={stat.label} padding="md" className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </Card>
        ))}
      </motion.div>

      {/* Main Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* New Simulation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card 
            padding="lg" 
            hoverable 
            className="h-full relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 gradient-primary opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity" />
            
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mb-6">
                <Camera className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">
                Nova Simulação
              </h2>
              
              <p className="text-gray-600 mb-6">
                Tire fotos ou faça upload de imagens para criar uma nova simulação 
                de procedimentos estéticos.
              </p>

              <Link href="/captura" onClick={handleNewSimulation}>
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Iniciar Simulação
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>

        {/* History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card 
            padding="lg" 
            hoverable 
            className="h-full relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-400 opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity" />
            
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl gradient-gold flex items-center justify-center mb-6">
                <History className="w-8 h-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">
                Histórico
              </h2>
              
              <p className="text-gray-600 mb-6">
                Veja todas as suas simulações anteriores e compare os resultados 
                novamente quando quiser.
              </p>

              <Link href="/historico">
                <Button 
                  variant="secondary"
                  size="lg" 
                  className="w-full sm:w-auto"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Ver Histórico
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Upgrade Banner */}
      {profile?.plano === 'free' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card 
            padding="lg" 
            className="gradient-primary text-white"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">
                    Desbloqueie todo o potencial!
                  </h3>
                  <p className="text-white/80 text-sm">
                    Faça upgrade para o plano Profissional e tenha 100 simulações por mês.
                  </p>
                </div>
              </div>
              <Link href="/planos">
                <Button 
                  variant="secondary" 
                  className="bg-white text-primary-700 hover:bg-primary-50 whitespace-nowrap"
                >
                  Ver Planos
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

