'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { Toggle, Slider } from '@/components/ui'
import type { FacialArea, AdjustmentValue } from '@/types'

interface AdjustmentCardProps {
  area: FacialArea
  values: Record<string, AdjustmentValue>
  onChange: (optionId: string, value: AdjustmentValue) => void
}

export function AdjustmentCard({ area, values, onChange }: AdjustmentCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const hasActiveAdjustments = area.options.some(
    opt => values[`${area.id}_${opt.id}`]?.enabled
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        bg-white rounded-2xl border-2 overflow-hidden transition-colors
        ${hasActiveAdjustments ? 'border-primary-400' : 'border-primary-100'}
      `}
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-primary-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{area.icon}</span>
          <div className="text-left">
            <h3 className="font-medium text-gray-900">{area.label}</h3>
            {hasActiveAdjustments && (
              <p className="text-xs text-primary-600">
                {area.options.filter(opt => values[`${area.id}_${opt.id}`]?.enabled).length} ajuste(s) ativo(s)
              </p>
            )}
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>

      {/* Options */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 space-y-4 border-t border-primary-100 pt-4">
              {area.options.map((option) => {
                const key = `${area.id}_${option.id}`
                const value = values[key] || {
                  areaId: area.id,
                  optionId: option.id,
                  intensity: 50,
                  enabled: false,
                }

                return (
                  <div key={option.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        {option.label}
                      </span>
                      <Toggle
                        checked={value.enabled}
                        onChange={(enabled) =>
                          onChange(option.id, { ...value, enabled })
                        }
                      />
                    </div>

                    <AnimatePresence>
                      {value.enabled && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <Slider
                            label="Intensidade"
                            value={value.intensity}
                            min={0}
                            max={100}
                            onChange={(e) =>
                              onChange(option.id, {
                                ...value,
                                intensity: parseInt(e.target.value),
                              })
                            }
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

