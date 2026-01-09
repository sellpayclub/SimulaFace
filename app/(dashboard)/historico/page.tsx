'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Calendar, Trash2, Eye, Search, Filter } from 'lucide-react'
import Link from 'next/link'
import { Button, Card, Input } from '@/components/ui'
import { ImageComparison } from '@/components/comparison'
import { createClient } from '@/lib/supabase/client'
import type { Simulacao } from '@/types'

export default function HistoricoPage() {
  const supabase = createClient()
  const [simulacoes, setSimulacoes] = useState<Simulacao[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSimulacao, setSelectedSimulacao] = useState<Simulacao | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchSimulacoes()
  }, [])

  const fetchSimulacoes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('simulacoes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setSimulacoes(data as Simulacao[])
    } catch (err) {
      console.error('Error fetching simulacoes:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta simulação?')) return

    try {
      await supabase.from('simulacoes').delete().eq('id', id)
      setSimulacoes(prev => prev.filter(s => s.id !== id))
      if (selectedSimulacao?.id === id) {
        setSelectedSimulacao(null)
      }
    } catch (err) {
      console.error('Error deleting simulacao:', err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const filteredSimulacoes = simulacoes.filter(s => 
    formatDate(s.created_at).toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link 
          href="/dashboard"
          className="flex items-center gap-2 text-gray-600 hover:text-primary-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
              Histórico de Simulações
            </h1>
            <p className="text-gray-600">
              {simulacoes.length} simulação(ões) realizadas
            </p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar por data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="spinner" />
        </div>
      ) : simulacoes.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card padding="lg" className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary-100 flex items-center justify-center">
              <Calendar className="w-10 h-10 text-primary-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Nenhuma simulação ainda
            </h2>
            <p className="text-gray-600 mb-6">
              Suas simulações aparecerão aqui após serem realizadas.
            </p>
            <Link href="/captura">
              <Button>Criar Primeira Simulação</Button>
            </Link>
          </Card>
        </motion.div>
      ) : (
        /* Grid of Simulations */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSimulacoes.map((simulacao, index) => (
            <motion.div
              key={simulacao.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card padding="none" hoverable className="overflow-hidden">
                {/* Preview Image */}
                <div className="aspect-video relative group">
                  {simulacao.foto_resultado ? (
                    <img
                      src={simulacao.foto_resultado}
                      alt="Resultado"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-400">Sem imagem</span>
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      onClick={() => setSelectedSimulacao(simulacao)}
                      className="p-3 rounded-full bg-white/90 text-primary-600 hover:bg-white transition-colors"
                      title="Ver detalhes"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(simulacao.id)}
                      className="p-3 rounded-full bg-white/90 text-red-500 hover:bg-white transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(simulacao.created_at)}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {Object.values(simulacao.ajustes || {}).filter((a: any) => a?.enabled).length} ajuste(s) aplicado(s)
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedSimulacao && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => setSelectedSimulacao(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <Card padding="lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Detalhes da Simulação
                  </h2>
                  <button
                    onClick={() => setSelectedSimulacao(null)}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                </div>

                {/* Comparison */}
                {selectedSimulacao.foto_resultado && selectedSimulacao.fotos_originais?.[0] && (
                  <div className="aspect-video mb-6">
                    <ImageComparison
                      beforeImage={selectedSimulacao.fotos_originais[0]}
                      afterImage={selectedSimulacao.foto_resultado}
                    />
                  </div>
                )}

                {/* Info */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-gray-50">
                    <h3 className="font-medium text-gray-900 mb-2">Data</h3>
                    <p className="text-gray-600">
                      {formatDate(selectedSimulacao.created_at)}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-gray-50">
                    <h3 className="font-medium text-gray-900 mb-2">Ajustes</h3>
                    <p className="text-gray-600">
                      {Object.values(selectedSimulacao.ajustes || {}).filter((a: any) => a?.enabled).length} modificações
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => handleDelete(selectedSimulacao.id)}
                    leftIcon={<Trash2 className="w-4 h-4" />}
                  >
                    Excluir
                  </Button>
                  <Button onClick={() => setSelectedSimulacao(null)}>
                    Fechar
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

