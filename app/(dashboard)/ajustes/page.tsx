'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Sparkles, RotateCcw } from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { AdjustmentsPanel } from '@/components/adjustments'
import { useSimulationStore } from '@/lib/store'

export default function AjustesPage() {
  const router = useRouter()
  const { photos, adjustments, clearAdjustments, setIsProcessing } = useSimulationStore()

  // Redirect if no photos
  useEffect(() => {
    if (photos.length === 0) {
      router.push('/captura')
    }
  }, [photos, router])

  const activeAdjustmentsCount = Object.values(adjustments).filter(
    adj => adj.enabled
  ).length

  const handleProcess = async () => {
    setIsProcessing(true)
    router.push('/resultado')
  }

  const handleBack = () => {
    router.push('/captura')
  }

  if (photos.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                Selecione os Ajustes
              </h1>
              <p className="text-gray-600">
                Escolha as áreas do rosto que deseja modificar e ajuste a intensidade.
              </p>
            </div>
            
            {activeAdjustmentsCount > 0 && (
              <Button
                variant="ghost"
                onClick={clearAdjustments}
                leftIcon={<RotateCcw className="w-4 h-4" />}
              >
                Limpar ajustes
              </Button>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Photos Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card padding="md" className="sticky top-24">
              <h2 className="font-medium text-gray-900 mb-4">
                Suas fotos ({photos.length})
              </h2>
              <div className="grid grid-cols-3 lg:grid-cols-1 gap-3">
                {photos.map((photo, index) => (
                  <div 
                    key={photo.id} 
                    className="aspect-square rounded-xl overflow-hidden border-2 border-primary-100"
                  >
                    <img
                      src={photo.dataUrl}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-6 p-4 rounded-xl bg-primary-50 border border-primary-100">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-5 h-5 text-primary-600" />
                  <span className="font-medium text-primary-700">
                    Resumo dos ajustes
                  </span>
                </div>
                <p className="text-sm text-primary-600">
                  {activeAdjustmentsCount === 0
                    ? 'Nenhum ajuste selecionado ainda'
                    : `${activeAdjustmentsCount} ajuste(s) selecionado(s)`
                  }
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Adjustments Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <AdjustmentsPanel />
          </motion.div>
        </div>

        {/* Process Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 sticky bottom-4 z-10"
        >
          <Card padding="md" className="shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="font-medium text-gray-900">
                  Pronto para ver o resultado?
                </p>
                <p className="text-sm text-gray-500">
                  A IA vai processar suas fotos com os ajustes selecionados
                </p>
              </div>
              <Button
                onClick={handleProcess}
                size="lg"
                className="w-full sm:w-auto"
                rightIcon={<ArrowRight className="w-5 h-5" />}
              >
                Gerar Simulação
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

