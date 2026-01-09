'use client'

import { forwardRef } from 'react'
import { motion } from 'framer-motion'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({ checked, onChange, label, disabled = false }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-7 w-12 items-center rounded-full 
          transition-colors duration-200 focus:outline-none focus:ring-2 
          focus:ring-primary-500 focus:ring-offset-2
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${checked ? 'bg-primary-500' : 'bg-gray-300'}
        `}
      >
        {label && <span className="sr-only">{label}</span>}
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 700, damping: 30 }}
          className={`
            inline-block h-5 w-5 rounded-full bg-white shadow-md
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    )
  }
)

Toggle.displayName = 'Toggle'

export { Toggle }

