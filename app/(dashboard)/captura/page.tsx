'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Camera, 
  Upload, 
  X, 
  ArrowLeft,
  Check,
  AlertCircle,
  User
} from 'lucide-react'
import { Button, Card } from '@/components/ui'
import { CameraCapture, PhotoUploader } from '@/components/camera'
import { useSimulationStore } from '@/lib/store'
import type { CapturedPhoto, Gender } from '@/types'

type CaptureMode = 'gender' | 'select' | 'camera' | 'upload'
type CameraStep = 'frente' | 'esquerda' | 'direita'

const cameraSteps: { type: CameraStep; instruction: string }[] = [
  { type: 'frente', instruction: 'Olhe para frente' },
  { type: 'esquerda', instruction: 'Vire para a esquerda' },
  { type: 'direita', instruction: 'Vire para a direita' },
]

export default function CapturaPage() {
  const router = useRouter()
  const { photos, addPhoto, removePhoto, clearPhotos, gender, setGender } = useSimulationStore()
  
  // Start with gender selection if not set, otherwise go to select mode
  const [mode, setMode] = useState<CaptureMode>(gender ? 'select' : 'gender')
  const [currentCameraStep, setCurrentCameraStep] = useState(0)
  const [showCamera, setShowCamera] = useState(false)

  const handleGenderSelect = (selectedGender: Gender) => {
    setGender(selectedGender)
    setMode('select')
  }

  const handleCameraCapture = (dataUrl: string) => {
    // Limpa fotos anteriores e adiciona a nova
    clearPhotos()
    
    const photo: CapturedPhoto = {
      id: `${Date.now()}-camera`,
      dataUrl,
      type: 'frente',
      timestamp: Date.now(),
    }
    addPhoto(photo)
    setShowCamera(false)
    
    // Redireciona automaticamente para ajustes
    router.push('/ajustes')
  }

  const handleUpload = (files: { dataUrl: string; file: File }[]) => {
    // Limpa fotos anteriores e adiciona a nova
    clearPhotos()
    
    const file = files[0] // Apenas 1 foto
    const photo: CapturedPhoto = {
      id: `${Date.now()}-upload`,
      dataUrl: file.dataUrl,
      type: 'uploaded',
      timestamp: Date.now(),
    }
    addPhoto(photo)
    
    // Redireciona automaticamente para ajustes
    router.push('/ajustes')
  }

  const handleBack = () => {
    if (mode === 'camera' || mode === 'upload') {
      setMode('select')
      setCurrentCameraStep(0)
    } else if (mode === 'select') {
      setMode('gender')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
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
        
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
          Sua Foto
        </h1>
        <p className="text-gray-600">
          Envie uma foto frontal do seu rosto para a simulação.
        </p>
      </motion.div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 mb-8"
      >
        <div className="flex-1 h-2 bg-primary-100 rounded-full overflow-hidden">
          <div 
            className="h-full gradient-primary transition-all duration-300"
            style={{ width: mode === 'gender' ? '0%' : gender ? (photos.length >= 1 ? '100%' : '50%') : '0%' }}
          />
        </div>
        <span className="text-sm font-medium text-gray-600">
          {mode === 'gender' 
            ? 'Selecione o gênero' 
            : photos.length >= 1 
              ? '✓ Foto enviada' 
              : 'Envie sua foto'}
        </span>
      </motion.div>

      {/* Mode Selection */}
      <AnimatePresence mode="wait">
        {/* Gender Selection */}
        {mode === 'gender' && (
          <motion.div
            key="gender"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <Card padding="lg">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-primary-100 flex items-center justify-center mb-4">
                  <User className="w-10 h-10 text-primary-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Você é...
                </h2>
                <p className="text-gray-600">
                  Isso ajuda a IA a manter suas características corretamente
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleGenderSelect('masculino')}
                  className={`
                    p-6 rounded-2xl border-2 transition-all duration-200
                    hover:border-primary-400 hover:bg-primary-50
                    ${gender === 'masculino' 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200'
                    }
                  `}
                >
                  <div className="text-4xl mb-3">👨</div>
                  <h3 className="font-bold text-gray-900">Homem</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Mantém barba, traços masculinos
                  </p>
                </button>

                <button
                  onClick={() => handleGenderSelect('feminino')}
                  className={`
                    p-6 rounded-2xl border-2 transition-all duration-200
                    hover:border-primary-400 hover:bg-primary-50
                    ${gender === 'feminino' 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200'
                    }
                  `}
                >
                  <div className="text-4xl mb-3">👩</div>
                  <h3 className="font-bold text-gray-900">Mulher</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Mantém maquiagem, traços femininos
                  </p>
                </button>
              </div>
            </Card>
          </motion.div>
        )}

        {mode === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Card 
                padding="lg" 
                hoverable 
                onClick={() => setMode('camera')}
                className="cursor-pointer text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl gradient-primary flex items-center justify-center mb-4">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Tirar Foto
                </h3>
                <p className="text-sm text-gray-600">
                  Use a câmera do dispositivo
                </p>
              </Card>

              <Card 
                padding="lg" 
                hoverable 
                onClick={() => setMode('upload')}
                className="cursor-pointer text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-2xl gradient-gold flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Upload de Foto
                </h3>
                <p className="text-sm text-gray-600">
                  Envie uma foto frontal do seu rosto
                </p>
              </Card>
            </div>

            {/* Captured Photo */}
            {photos.length > 0 && (
              <Card padding="md">
                <h3 className="font-medium text-gray-900 mb-4">
                  Sua foto
                </h3>
                <div className="flex justify-center">
                  <div className="relative w-48 h-48 rounded-xl overflow-hidden group">
                    <img
                      src={photos[0].dataUrl}
                      alt="Sua foto"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => removePhoto(photos[0].id)}
                        className="w-10 h-10 rounded-full bg-white/90 text-red-500 flex items-center justify-center hover:bg-white"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-500 mt-3">
                  Clique na foto para remover e escolher outra
                </p>
              </Card>
            )}
          </motion.div>
        )}

        {mode === 'camera' && !showCamera && (
          <motion.div
            key="camera-guide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card padding="lg">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto rounded-full gradient-primary flex items-center justify-center mb-4">
                  <Camera className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {cameraSteps[currentCameraStep].instruction}
                </h2>
                <p className="text-gray-600">
                  Foto {currentCameraStep + 1} de {cameraSteps.length}
                </p>
              </div>

              {/* Steps indicator */}
              <div className="flex justify-center gap-2 mb-6">
                {cameraSteps.map((step, index) => {
                  const isCaptured = photos.some(p => p.type === step.type)
                  const isCurrent = index === currentCameraStep
                  
                  return (
                    <div
                      key={step.type}
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                        ${isCaptured 
                          ? 'bg-green-100 text-green-600' 
                          : isCurrent 
                            ? 'gradient-primary text-white' 
                            : 'bg-gray-100 text-gray-400'
                        }
                      `}
                    >
                      {isCaptured ? <Check className="w-5 h-5" /> : index + 1}
                    </div>
                  )
                })}
              </div>

              <div className="p-4 rounded-xl bg-primary-50 border border-primary-100 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-primary-700">
                    <p className="font-medium mb-1">Dicas para melhores resultados:</p>
                    <ul className="space-y-1 text-primary-600">
                      <li>• Boa iluminação no rosto</li>
                      <li>• Fundo neutro se possível</li>
                      <li>• Rosto centralizado no guia oval</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setShowCamera(true)} 
                className="w-full"
                size="lg"
                leftIcon={<Camera className="w-5 h-5" />}
              >
                Abrir Câmera
              </Button>
            </Card>
          </motion.div>
        )}

        {mode === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card padding="lg">
              <PhotoUploader 
                onUpload={handleUpload}
                maxFiles={1}
                currentCount={0}
              />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Modal */}
      <AnimatePresence>
        {showCamera && (
          <CameraCapture
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
            instruction={cameraSteps[currentCameraStep].instruction}
            captureType={cameraSteps[currentCameraStep].type}
          />
        )}
      </AnimatePresence>

    </div>
  )
}

