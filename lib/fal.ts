import { fal } from '@fal-ai/client'
import type { AdjustmentsState, Gender } from '@/types'

// Configure fal client - this should only be called server-side
export function configureFal() {
  fal.config({
    credentials: process.env.FAL_KEY!,
  })
}

// Build the prompt based on user adjustments and gender
export function buildPrompt(adjustments: AdjustmentsState, gender: Gender = null): string {
  const activeAdjustments = Object.values(adjustments)
    .filter(adj => adj.enabled && adj.intensity > 0)

  if (activeAdjustments.length === 0) {
    return 'Professional portrait photo of the same person. Photorealistic, natural lighting.'
  }

  const promptParts: string[] = []

  // Descrições mais fortes e diretas para cada ajuste
  const adjustmentDescriptions: Record<string, { low: string; medium: string; high: string }> = {
    // Testa
    'testa_rugas': {
      low: 'slightly smoother forehead',
      medium: 'noticeably smoother forehead with reduced wrinkles',
      high: 'very smooth forehead with wrinkles significantly reduced'
    },
    'testa_suavizar': {
      low: 'slightly softer forehead lines',
      medium: 'softer forehead with reduced lines',
      high: 'very smooth forehead with lines removed'
    },

    // Olhos
    'olhos_pe_galinha': {
      low: 'slightly reduced crow\'s feet',
      medium: 'noticeably reduced crow\'s feet around eyes',
      high: 'crow\'s feet significantly reduced, smoother eye area'
    },
    'olhos_palpebra': {
      low: 'slightly lifted eyelids',
      medium: 'noticeably lifted eyelids, more open eyes',
      high: 'significantly lifted eyelids, very open and alert eyes'
    },

    // Nariz
    'nariz_afinar': {
      low: 'slightly slimmer nose',
      medium: 'noticeably slimmer and refined nose',
      high: 'significantly slimmer nose with refined bridge'
    },
    'nariz_empinar': {
      low: 'slightly lifted nose tip',
      medium: 'noticeably lifted and refined nose tip',
      high: 'significantly lifted nose tip, more upturned'
    },
    'nariz_reduzir': {
      low: 'slightly smaller nose',
      medium: 'noticeably smaller and more delicate nose',
      high: 'significantly smaller nose overall'
    },
    'nariz_engrossar': {
      low: 'slightly wider nose',
      medium: 'noticeably wider nose bridge',
      high: 'significantly wider and stronger nose'
    },

    // Boca
    'boca_volume': {
      low: 'slightly fuller lips',
      medium: 'noticeably fuller and more voluminous lips',
      high: 'significantly fuller lips with enhanced volume'
    },
    'boca_contorno': {
      low: 'slightly more defined lip contour',
      medium: 'noticeably more defined and sculpted lips',
      high: 'very defined lip contour with sharp edges'
    },

    // Sulco Nasogeniano
    'sulco_suavizar': {
      low: 'slightly softened nasolabial folds',
      medium: 'noticeably reduced nasolabial folds',
      high: 'nasolabial folds significantly smoothed'
    },
    'sulco_preencher': {
      low: 'slightly filled nasolabial area',
      medium: 'noticeably filled and smoother nasolabial area',
      high: 'nasolabial area significantly filled and smooth'
    },

    // Maçã do Rosto
    'maca_volume': {
      low: 'slightly enhanced cheekbones',
      medium: 'noticeably more prominent cheekbones',
      high: 'significantly enhanced high cheekbones'
    },
    'maca_definir': {
      low: 'slightly more defined cheekbones',
      medium: 'noticeably sculpted cheekbones',
      high: 'very defined and sculpted cheekbones'
    },

    // Queixo
    'queixo_projetar': {
      low: 'slightly more projected chin',
      medium: 'noticeably more projected chin',
      high: 'significantly projected and defined chin'
    },
    'queixo_reduzir': {
      low: 'slightly smaller chin',
      medium: 'noticeably smaller and refined chin',
      high: 'significantly smaller chin'
    },
    'queixo_definir': {
      low: 'slightly more defined chin',
      medium: 'noticeably more defined chin contour',
      high: 'very defined and sculpted chin'
    },

    // Mandíbula
    'mandibula_afinar': {
      low: 'slightly slimmer jawline',
      medium: 'noticeably slimmer and refined jawline',
      high: 'significantly slimmer V-shaped jawline'
    },
    'mandibula_definir': {
      low: 'slightly more defined jaw angle',
      medium: 'noticeably sharper jaw angle',
      high: 'very sharp and defined jaw angle'
    },

    // Pescoço
    'pescoco_papada': {
      low: 'slightly reduced double chin',
      medium: 'noticeably reduced double chin',
      high: 'double chin significantly reduced'
    },
    'pescoco_definir': {
      low: 'slightly more defined neck',
      medium: 'noticeably more defined neck and jawline',
      high: 'very defined neck with clean jawline'
    },

    // Bigode
    'bigode_suavizar': {
      low: 'slightly smoother upper lip area',
      medium: 'noticeably smoother upper lip',
      high: 'very smooth upper lip area'
    },
    'bigode_preencher': {
      low: 'slightly filled upper lip lines',
      medium: 'noticeably smoother upper lip lines',
      high: 'upper lip lines significantly reduced'
    },
  }

  activeAdjustments.forEach(adj => {
    const key = `${adj.areaId}_${adj.optionId}`
    const descriptions = adjustmentDescriptions[key]
    if (descriptions) {
      // Selecionar descrição baseada na intensidade real
      let description: string
      if (adj.intensity <= 35) {
        description = descriptions.low
      } else if (adj.intensity <= 70) {
        description = descriptions.medium
      } else {
        description = descriptions.high
      }
      promptParts.push(description)
    }
  })

  // Contexto de gênero mais direto
  const genderContext = gender === 'masculino'
    ? 'Male subject - keep beard and facial hair intact.'
    : gender === 'feminino'
      ? 'Female subject - keep makeup intact.'
      : ''

  // Prompt focado nas mudanças, com forte preservação de identidade
  const prompt = `Highly detailed professional portrait. ${genderContext}
PRESERVE IDENTITY: It is CRITICAL to keep the EXACT same person, face shape, unique facial features, and personal characteristics. 
The subject must remain 100% recognizable as the same individual.
ONLY apply the following aesthetic enhancements: ${promptParts.join('. ')}.
The result must look like the SAME person after a successful clinical aesthetic procedure.
DO NOT transform into a different person. Keep same hair, skin texture, skin tone, eye color, clothing, and background. 
Extreme photorealism, natural clinical lighting, high resolution, no artifacts.`.trim()

  return prompt
}

// Process image with fal.ai
export async function processImage(
  imageUrls: string[],
  adjustments: AdjustmentsState
): Promise<{ images: Array<{ url: string }>; prompt: string }> {
  configureFal()

  const prompt = buildPrompt(adjustments)

  // lora_scale: 0.85 para mudanças mais visíveis mantendo identidade
  const result = await fal.subscribe('fal-ai/flux-2-lora-gallery/face-to-full-portrait', {
    input: {
      image_urls: imageUrls,
      prompt,
      guidance_scale: 2.5,
      num_inference_steps: 40,
      enable_safety_checker: true,
      output_format: 'png',
      num_images: 1,
      lora_scale: 0.85,
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === 'IN_PROGRESS' && update.logs) {
        update.logs.map((log) => log.message).forEach(console.log)
      }
    },
  })

  return {
    images: result.data.images,
    prompt,
  }
}

// Upload file to fal storage
export async function uploadToFalStorage(file: File): Promise<string> {
  configureFal()
  const url = await fal.storage.upload(file)
  return url
}

