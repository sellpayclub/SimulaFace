'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, RotateCcw, Check, X } from 'lucide-react'
import { Button } from '@/components/ui'

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void
  onClose: () => void
  instruction: string
  captureType: 'frente' | 'esquerda' | 'direita'
}

export function CameraCapture({ onCapture, onClose, instruction, captureType }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user')

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Stop existing stream if any
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      setStream(mediaStream)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        await videoRef.current.play()
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('Não foi possível acessar a câmera. Verifique as permissões.')
    } finally {
      setIsLoading(false)
    }
  }, [facingMode, stream])

  useEffect(() => {
    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      startCamera()
    }
  }, [facingMode])

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Flip horizontally if using front camera
    if (facingMode === 'user') {
      context.translate(canvas.width, 0)
      context.scale(-1, 1)
    }

    context.drawImage(video, 0, 0)

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    setCapturedImage(dataUrl)
  }

  const retake = () => {
    setCapturedImage(null)
  }

  const confirmCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 glass-dark">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <span className="text-white font-medium">{instruction}</span>
          <button
            onClick={switchCamera}
            className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Camera View or Captured Image */}
      <div className="relative w-full h-full flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 text-white">
            <div className="spinner" />
            <span>Iniciando câmera...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4 text-white p-8 text-center">
            <Camera className="w-16 h-16 opacity-50" />
            <p>{error}</p>
            <Button onClick={startCamera} variant="secondary">
              Tentar Novamente
            </Button>
          </div>
        ) : capturedImage ? (
          <img
            src={capturedImage}
            alt="Foto capturada"
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`max-w-full max-h-full object-contain ${
                facingMode === 'user' ? 'scale-x-[-1]' : ''
              }`}
            />
            {/* Face guide overlay */}
            <div className="camera-guide">
              <div className="camera-guide-oval" />
            </div>
          </>
        )}
      </div>

      {/* Hidden canvas for capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6 glass-dark">
        <div className="flex items-center justify-center gap-6">
          {capturedImage ? (
            <>
              <Button
                variant="secondary"
                size="lg"
                onClick={retake}
                leftIcon={<RotateCcw className="w-5 h-5" />}
              >
                Refazer
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={confirmCapture}
                leftIcon={<Check className="w-5 h-5" />}
              >
                Usar Foto
              </Button>
            </>
          ) : (
            <button
              onClick={capture}
              className="w-20 h-20 rounded-full bg-white border-4 border-primary-500 
                         flex items-center justify-center shadow-lg
                         hover:scale-105 active:scale-95 transition-transform"
            >
              <div className="w-14 h-14 rounded-full gradient-primary" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

