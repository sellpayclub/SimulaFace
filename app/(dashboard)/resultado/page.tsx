'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Download, 
  Share2, 
  RefreshCw, 
  Home,
  Check,
  X,
  Sparkles,
  Edit3,
  RotateCcw
} from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { ImageComparison } from '@/components/comparison'
import { useSimulationStore } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'

export default function ResultadoPage() {
  const router = useRouter()
  const supabase = createClient()
  const { 
    photos, 
    adjustments, 
    resultImage, 
    isProcessing, 
    setResultImage, 
    setIsProcessing,
    reset,
    addPhoto,
    clearPhotos,
    clearAdjustments,
    gender
  } = useSimulationStore()
  
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  // Progress tracking
  const [progress, setProgress] = useState(0)
  const [progressStage, setProgressStage] = useState<string>('Preparando...')

  // Process the image
  useEffect(() => {
    if (photos.length === 0) {
      router.push('/captura')
      return
    }

    if (!resultImage && isProcessing) {
      processImage()
    }
  }, [photos, resultImage, isProcessing])

  // Animate progress during processing
  useEffect(() => {
    if (!isProcessing) {
      setProgress(0)
      return
    }

    // Progress stages with timing
    const stages = [
      { progress: 10, stage: 'Enviando imagem...', delay: 500 },
      { progress: 20, stage: 'Imagem enviada ✓', delay: 1500 },
      { progress: 30, stage: 'Na fila de processamento...', delay: 2500 },
      { progress: 40, stage: 'Iniciando IA...', delay: 4000 },
      { progress: 50, stage: 'Analisando rosto...', delay: 6000 },
      { progress: 60, stage: 'Aplicando ajustes...', delay: 9000 },
      { progress: 70, stage: 'Refinando detalhes...', delay: 13000 },
      { progress: 80, stage: 'Gerando resultado...', delay: 18000 },
      { progress: 85, stage: 'Quase lá...', delay: 25000 },
      { progress: 90, stage: 'Finalizando...', delay: 35000 },
    ]

    const timeouts: NodeJS.Timeout[] = []
    
    stages.forEach(({ progress: p, stage, delay }) => {
      const timeout = setTimeout(() => {
        if (isProcessing) {
          setProgress(p)
          setProgressStage(stage)
        }
      }, delay)
      timeouts.push(timeout)
    })

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [isProcessing])

  // Set 100% when result arrives
  useEffect(() => {
    if (resultImage && !error) {
      setProgress(100)
      setProgressStage('Concluído! ✓')
    }
  }, [resultImage, error])

  const processImage = async () => {
    try {
      setError(null)
      setProgress(5)
      setProgressStage('Preparando imagem...')
      
      // Convert photos to base64 URLs
      const imageUrls = photos.map(p => p.dataUrl)

      const response = await fetch('/api/transform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrls,
          adjustments,
          gender,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Erro ao processar imagem')
      }

      const data = await response.json()
      
      if (data.images && data.images.length > 0) {
        setProgress(100)
        setProgressStage('Concluído! ✓')
        setResultImage(data.images[0].url)
      } else {
        throw new Error('Nenhuma imagem retornada')
      }
    } catch (err) {
      console.error('Error processing image:', err)
      setError(err instanceof Error ? err.message : 'Erro ao processar imagem')
      setProgress(0)
      setProgressStage('')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSave = async () => {
    if (!resultImage || saved) return

    setIsSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      await supabase.from('simulacoes').insert({
        user_id: user.id,
        fotos_originais: photos.map(p => p.dataUrl),
        foto_resultado: resultImage,
        ajustes: adjustments as unknown as Record<string, unknown>,
        prompt_usado: 'AI Generated',
      } as never)

      // Update remaining simulations - decrement via direct update
      const { data: profile } = await supabase
        .from('profiles')
        .select('simulacoes_restantes')
        .eq('id', user.id)
        .single()
      
      if (profile) {
        const currentSimulacoes = (profile as { simulacoes_restantes: number }).simulacoes_restantes || 0
        await supabase
          .from('profiles')
          .update({ simulacoes_restantes: Math.max(0, currentSimulacoes - 1) } as never)
          .eq('id', user.id)
      }

      setSaved(true)
    } catch (err) {
      console.error('Error saving simulation:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownload = () => {
    if (!resultImage) return

    const link = document.createElement('a')
    link.href = resultImage
    link.download = `simulaface-resultado-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleNewSimulation = () => {
    reset()
    router.push('/captura')
  }

  // Continuar editando a foto gerada (usar resultado como nova base)
  const handleContinueEditing = () => {
    if (!resultImage) return
    
    // Salva a foto gerada como a nova foto base
    clearPhotos()
    addPhoto({
      id: `${Date.now()}-generated`,
      dataUrl: resultImage,
      type: 'uploaded',
      timestamp: Date.now(),
    })
    
    // Limpa ajustes e resultado para novo processamento
    clearAdjustments()
    setResultImage(null)
    
    router.push('/ajustes')
  }

  // Refazer com a foto original (manter foto, ajustar novamente)
  const handleRedoWithOriginal = () => {
    // Mantém a foto original, limpa ajustes e resultado
    clearAdjustments()
    setResultImage(null)
    
    router.push('/ajustes')
  }

  if (photos.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button 
          onClick={() => router.push('/ajustes')}
          className="flex items-center gap-2 text-gray-600 hover:text-primary-700 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar aos ajustes</span>
        </button>
        
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
          Resultado da Simulação
        </h1>
        <p className="text-gray-600">
          Compare o antes e depois arrastando o slider na imagem.
        </p>
      </motion.div>

      {/* Loading State */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card padding="lg" className="text-center">
              <div className="py-8">
                {/* Percentage display */}
                <div className="relative w-32 h-32 mx-auto mb-6">
                  {/* Background circle */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-primary-100"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      className="text-primary-600 transition-all duration-500"
                      style={{
                        strokeDasharray: `${2 * Math.PI * 56}`,
                        strokeDashoffset: `${2 * Math.PI * 56 * (1 - progress / 100)}`,
                      }}
                    />
                  </svg>
                  {/* Percentage text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-primary-600">{progress}%</span>
                  </div>
                </div>

                {/* Stage text */}
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {progressStage}
                </h2>
                
                {/* Progress bar */}
                <div className="w-full max-w-md mx-auto mb-4">
                  <div className="h-2 bg-primary-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full gradient-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                  </div>
                </div>

                {/* Stage indicators */}
                <div className="flex justify-between text-xs text-gray-400 max-w-md mx-auto mb-4">
                  <span className={progress >= 10 ? 'text-primary-600 font-medium' : ''}>Envio</span>
                  <span className={progress >= 40 ? 'text-primary-600 font-medium' : ''}>Fila</span>
                  <span className={progress >= 60 ? 'text-primary-600 font-medium' : ''}>IA</span>
                  <span className={progress >= 90 ? 'text-primary-600 font-medium' : ''}>Final</span>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Sparkles className="w-4 h-4 text-primary-500" />
                  <span>A IA está aplicando os ajustes selecionados</span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error State */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card padding="lg" className="text-center">
              <div className="py-12">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-10 h-10 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Ops! Algo deu errado
                </h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button
                    onClick={processImage}
                    leftIcon={<RefreshCw className="w-5 h-5" />}
                  >
                    Tentar Novamente
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => router.push('/ajustes')}
                  >
                    Voltar aos Ajustes
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result */}
      <AnimatePresence>
        {resultImage && !isProcessing && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Comparison Slider */}
            <div 
              className="relative w-full mx-auto rounded-2xl overflow-hidden shadow-xl bg-gray-900" 
              style={{ height: 'calc(100vh - 300px)', minHeight: '400px', maxHeight: '700px' }}
            >
              <ImageComparison
                beforeImage={photos[0].dataUrl}
                afterImage={resultImage}
                beforeLabel="Antes"
                afterLabel="Depois"
              />
            </div>

            {/* Actions */}
            <Card padding="md">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  {saved ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">Salvo no histórico</span>
                    </div>
                  ) : (
                    <Button
                      variant="secondary"
                      onClick={handleSave}
                      isLoading={isSaving}
                      leftIcon={<Check className="w-5 h-5" />}
                    >
                      Salvar no Histórico
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={handleDownload}
                    leftIcon={<Download className="w-5 h-5" />}
                  >
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    leftIcon={<Share2 className="w-5 h-5" />}
                  >
                    Compartilhar
                  </Button>
                </div>
              </div>
            </Card>

            {/* Edit Options */}
            <Card padding="md">
              <h3 className="font-medium text-gray-900 mb-4">Não gostou do resultado?</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <Button
                  variant="secondary"
                  onClick={handleRedoWithOriginal}
                  leftIcon={<RotateCcw className="w-5 h-5" />}
                  className="w-full"
                >
                  Refazer com foto original
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleContinueEditing}
                  leftIcon={<Edit3 className="w-5 h-5" />}
                  className="w-full"
                >
                  Editar foto gerada
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                • <strong>Refazer</strong>: volta para ajustes com sua foto original
                <br />
                • <strong>Editar gerada</strong>: usa o resultado como nova base para mais ajustes
              </p>
            </Card>

            {/* Next Actions */}
            <div className="grid sm:grid-cols-2 gap-4">
              <Button
                variant="outline"
                size="lg"
                onClick={handleNewSimulation}
                leftIcon={<RefreshCw className="w-5 h-5" />}
                className="w-full"
              >
                Nova Foto
              </Button>
              <Link href="/dashboard" className="w-full">
                <Button
                  size="lg"
                  leftIcon={<Home className="w-5 h-5" />}
                  className="w-full"
                >
                  Ir para Dashboard
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

