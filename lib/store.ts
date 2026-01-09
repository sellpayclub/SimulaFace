'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { SimulationStore, CapturedPhoto, AdjustmentValue } from '@/types'

export type Gender = 'masculino' | 'feminino' | null

const initialState = {
  photos: [] as CapturedPhoto[],
  adjustments: {},
  resultImage: null as string | null,
  isProcessing: false,
  currentStep: 'capture' as const,
  gender: null as Gender,
}

export const useSimulationStore = create<SimulationStore>()(
  persist(
    (set) => ({
      ...initialState,

      addPhoto: (photo: CapturedPhoto) =>
        set((state) => ({
          photos: [...state.photos, photo],
        })),

      removePhoto: (id: string) =>
        set((state) => ({
          photos: state.photos.filter((p) => p.id !== id),
        })),

      clearPhotos: () =>
        set({
          photos: [],
        }),

      setAdjustment: (key: string, value: AdjustmentValue) =>
        set((state) => ({
          adjustments: {
            ...state.adjustments,
            [key]: value,
          },
        })),

      clearAdjustments: () =>
        set({
          adjustments: {},
        }),

      setResultImage: (url: string | null) =>
        set({
          resultImage: url,
        }),

      setIsProcessing: (processing: boolean) =>
        set({
          isProcessing: processing,
        }),

      setCurrentStep: (step) =>
        set({
          currentStep: step,
        }),

      setGender: (gender: Gender) =>
        set({
          gender,
        }),

      reset: () => set(initialState),
    }),
    {
      name: 'simulaface-storage',
      partialize: (state) => ({
        photos: state.photos,
        adjustments: state.adjustments,
        currentStep: state.currentStep,
        gender: state.gender,
      }),
    }
  )
)

