import { NextRequest, NextResponse } from 'next/server'
import { fal } from '@fal-ai/client'
import { createClient } from '@/lib/supabase/server'
import { buildPrompt } from '@/lib/fal'
import type { AdjustmentsState, Gender } from '@/types'

// Configure runtime for Vercel
export const runtime = 'nodejs'
export const maxDuration = 60 // 60 seconds for image processing

// Configure fal client
fal.config({
  credentials: process.env.FAL_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Check if user has remaining simulations
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('simulacoes_restantes, plano')
      .eq('id', user.id)
      .single()

    console.log('User ID:', user.id)
    console.log('Profile data:', profile)
    console.log('Profile error:', profileError)

    // If profile doesn't exist, create one with free tier
    if (profileError || !profile) {
      console.log('Creating profile for user:', user.id)
      // @ts-expect-error - Type inference issue with mock client during build
      await supabase.from('profiles').upsert({
        id: user.id,
        nome: user.email ?? null,
        plano: 'free',
        simulacoes_restantes: 3,
      })
      // Continue with 3 free simulations
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profileData = profile as any
    const simulacoesRestantes = profileData?.simulacoes_restantes ?? 3
    
    console.log('Simulacoes restantes:', simulacoesRestantes)

    if (simulacoesRestantes <= 0) {
      return NextResponse.json(
        { error: 'Você não tem simulações restantes. Faça upgrade do seu plano.' },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await request.json()
    const { imageUrls, adjustments, gender } = body as {
      imageUrls: string[]
      adjustments: AdjustmentsState
      gender?: Gender
    }

    if (!imageUrls || imageUrls.length === 0) {
      return NextResponse.json(
        { error: 'Nenhuma imagem fornecida' },
        { status: 400 }
      )
    }

    // Use only the first image (fal.ai expects single face image)
    const imageUrl = imageUrls[0]
    console.log('Processing single image')

    // Upload image to fal storage if it's base64
    let processedUrl: string
    if (imageUrl.startsWith('data:')) {
      // Convert base64 to File and upload
      const base64Data = imageUrl.split(',')[1]
      const mimeType = imageUrl.split(';')[0].split(':')[1] || 'image/jpeg'
      const buffer = Buffer.from(base64Data, 'base64')
      const blob = new Blob([buffer], { type: mimeType })
      const file = new File([blob], `face-${Date.now()}.jpg`, { type: mimeType })
      
      processedUrl = await fal.storage.upload(file)
    } else {
      processedUrl = imageUrl
    }

    // Build prompt based on adjustments and gender
    const prompt = buildPrompt(adjustments, gender)

    console.log('Gender:', gender)
    console.log('Processing with prompt:', prompt)
    console.log('Image URL:', processedUrl)

    // Call fal.ai API with single image
    // lora_scale: 0.8-1.0 para mudanças mais visíveis
    // guidance_scale: 2.5 (padrão) para seguir o prompt sem exagerar
    const result = await fal.subscribe('fal-ai/flux-2-lora-gallery/face-to-full-portrait', {
      input: {
        image_urls: [processedUrl],
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

    console.log('fal.ai result:', result)

    return NextResponse.json({
      images: result.data.images,
      prompt,
    })
  } catch (error) {
    console.error('Transform error:', error)
    
    // Log full error details for fal.ai validation errors
    if (error && typeof error === 'object') {
      const falError = error as { status?: number; body?: unknown; message?: string }
      console.error('Error status:', falError.status)
      console.error('Error body:', JSON.stringify(falError.body, null, 2))
      console.error('Error message:', falError.message)
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro ao processar imagem' },
      { status: 500 }
    )
  }
}

