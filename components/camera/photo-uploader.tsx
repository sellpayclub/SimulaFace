'use client'

import { useCallback, useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react'

interface PreviewFile {
  file: File
  previewUrl: string
  dataUrl?: string
}

interface PhotoUploaderProps {
  onUpload: (files: { dataUrl: string; file: File }[]) => void
  maxFiles?: number
  currentCount?: number
}

// Read file as base64 data URL
async function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (reader.result && typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to read file as data URL'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

export function PhotoUploader({ onUpload, maxFiles = 1, currentCount = 0 }: PhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [previews, setPreviews] = useState<PreviewFile[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isProcessingUpload, setIsProcessingUpload] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const inputId = useRef(`file-input-${Math.random().toString(36).substr(2, 9)}`).current

  const remainingSlots = maxFiles - currentCount - previews.length

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      previews.forEach(p => URL.revokeObjectURL(p.previewUrl))
    }
  }, [])

  const processFiles = useCallback(async (files: FileList | File[]) => {
    setError(null)
    setIsLoading(true)
    const validFiles: PreviewFile[] = []

    const fileArray = Array.from(files).slice(0, Math.max(0, remainingSlots))

    if (fileArray.length === 0) {
      setError('Limite de fotos atingido.')
      setIsLoading(false)
      return
    }

    for (const file of fileArray) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecione apenas imagens.')
        continue
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('Imagens devem ter no máximo 10MB.')
        continue
      }

      // Create object URL for preview (fast and efficient)
      const previewUrl = URL.createObjectURL(file)
      validFiles.push({ file, previewUrl })
    }

    if (validFiles.length > 0) {
      setPreviews(prev => [...prev, ...validFiles])
    }
    setIsLoading(false)
  }, [remainingSlots])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }, [processFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFiles(files)
    }
    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [processFiles])

  const removePreview = (index: number) => {
    setPreviews(prev => {
      const newPreviews = [...prev]
      // Revoke the URL to free memory
      URL.revokeObjectURL(newPreviews[index].previewUrl)
      newPreviews.splice(index, 1)
      return newPreviews
    })
  }

  const confirmUpload = async () => {
    if (previews.length === 0 || isProcessingUpload) return

    setIsProcessingUpload(true)
    setError(null)

    try {
      // Process all images - read as data URL
      const processedFiles: { dataUrl: string; file: File }[] = []

      for (const preview of previews) {
        try {
          const dataUrl = await readFileAsDataUrl(preview.file)
          processedFiles.push({ dataUrl, file: preview.file })
        } catch (err) {
          console.error('Error reading image:', preview.file.name, err)
          setError(`Erro ao processar ${preview.file.name}`)
        }
      }

      if (processedFiles.length > 0) {
        // Call the parent handler
        onUpload(processedFiles)
        
        // Cleanup previews
        previews.forEach(p => URL.revokeObjectURL(p.previewUrl))
        setPreviews([])
      } else {
        setError('Nenhuma imagem foi processada com sucesso.')
      }
    } catch (err) {
      console.error('Error in confirmUpload:', err)
      setError('Erro ao processar imagens. Tente novamente.')
    } finally {
      setIsProcessingUpload(false)
    }
  }

  // Função para abrir o seletor de arquivos
  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="space-y-6">
      {/* File input - hidden */}
      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/jpg,image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Selecionar foto"
      />

      {/* Drop Zone - with explicit click handler */}
      <div
        onClick={openFilePicker}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openFilePicker() }}
        className={`
          block border-2 border-dashed rounded-2xl p-8 text-center
          transition-all duration-200 cursor-pointer
          ${isDragging 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-primary-200 hover:border-primary-400 hover:bg-primary-50/50'
          }
          ${isLoading ? 'pointer-events-none opacity-70' : ''}
        `}
      >
        <div className="flex flex-col items-center gap-4">
          <div className={`
            w-16 h-16 rounded-full flex items-center justify-center
            ${isDragging ? 'gradient-primary' : 'bg-primary-100'}
            transition-colors duration-200
          `}>
            {isLoading ? (
              <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className={`w-8 h-8 ${isDragging ? 'text-white' : 'text-primary-600'}`} />
            )}
          </div>
          
          <div>
            <p className="text-lg font-medium text-gray-700">
              {isLoading ? 'Processando...' : 'Arraste sua foto aqui'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              ou clique para selecionar
            </p>
          </div>

          <p className="text-xs text-gray-400">
            JPG, PNG ou WebP • Máximo 10MB • Foto frontal do rosto
          </p>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-600"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Grid */}
      <AnimatePresence>
        {previews.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-medium text-gray-700">
              Foto selecionada
            </h3>
            
            <div className="grid grid-cols-3 gap-3">
              {previews.map((preview, index) => (
                <motion.div
                  key={`preview-${index}-${preview.file.name}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative aspect-square rounded-xl overflow-hidden group bg-gray-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview.previewUrl}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      removePreview(index)
                    }}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 
                             text-white flex items-center justify-center
                             hover:bg-black/80 transition-colors z-10"
                    aria-label={`Remover foto ${index + 1}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-white text-xs truncate">{preview.file.name}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <button
              type="button"
              onClick={confirmUpload}
              disabled={isProcessingUpload || previews.length === 0}
              className="w-full px-8 py-4 text-lg font-medium rounded-xl gradient-primary text-white 
                       shadow-lg hover:shadow-xl transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            >
              {isProcessingUpload ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processando...</span>
                </>
              ) : (
                <span>Usar esta foto</span>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tips */}
      <div className="p-4 rounded-xl bg-primary-50 border border-primary-100">
        <h4 className="font-medium text-primary-700 mb-2 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Dicas para melhores resultados
        </h4>
        <ul className="text-sm text-primary-600 space-y-1">
          <li>• <strong>Foto frontal</strong> do rosto (olhando para a câmera)</li>
          <li>• Boa iluminação, sem sombras no rosto</li>
          <li>• Rosto centralizado e bem visível</li>
          <li>• Evite óculos escuros, máscaras ou acessórios</li>
          <li>• Fundo neutro de preferência</li>
        </ul>
      </div>
    </div>
  )
}
