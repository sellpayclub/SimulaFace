'use client'

import { forwardRef, InputHTMLAttributes } from 'react'

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  value: number
  showValue?: boolean
  unit?: string
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(
  ({ label, value, showValue = true, unit = '%', className = '', ...props }, ref) => {
    // Calculate fill percentage for the gradient
    const min = Number(props.min) || 0
    const max = Number(props.max) || 100
    const fillPercent = ((value - min) / (max - min)) * 100

    return (
      <div className="w-full">
        {(label || showValue) && (
          <div className="flex items-center justify-between mb-2">
            {label && (
              <span className="text-sm font-medium text-gray-700">{label}</span>
            )}
            {showValue && (
              <span className="text-sm font-bold text-primary-600">
                {value}{unit}
              </span>
            )}
          </div>
        )}
        <div className="relative">
          <input
            ref={ref}
            type="range"
            value={value}
            className={`slider-custom w-full h-3 rounded-full appearance-none cursor-pointer ${className}`}
            style={{
              background: `linear-gradient(to right, #c17b7b 0%, #d4a5a5 ${fillPercent}%, #e8d5d5 ${fillPercent}%, #f5eded 100%)`
            }}
            {...props}
          />
        </div>
      </div>
    )
  }
)

Slider.displayName = 'Slider'

export { Slider }
