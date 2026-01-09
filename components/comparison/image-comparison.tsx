'use client'

import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'
import { motion } from 'framer-motion'

interface ImageComparisonProps {
  beforeImage: string
  afterImage: string
  beforeLabel?: string
  afterLabel?: string
}

export function ImageComparison({
  beforeImage,
  afterImage,
  beforeLabel = 'Antes',
  afterLabel = 'Depois',
}: ImageComparisonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl overflow-hidden shadow-2xl w-full h-full"
    >
      <ReactCompareSlider
        itemOne={
          <ReactCompareSliderImage
            src={beforeImage}
            alt={beforeLabel}
            style={{ 
              objectFit: 'contain',
              width: '100%',
              height: '100%',
              backgroundColor: '#1a1a1a'
            }}
          />
        }
        itemTwo={
          <ReactCompareSliderImage
            src={afterImage}
            alt={afterLabel}
            style={{ 
              objectFit: 'contain',
              width: '100%',
              height: '100%',
              backgroundColor: '#1a1a1a'
            }}
          />
        }
        handle={
          <div className="w-1 h-full bg-white shadow-lg relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-600"
              >
                <path d="m9 18 6-6-6-6" />
                <path d="m15 18-6-6 6-6" transform="rotate(180 15 12)" />
              </svg>
            </div>
          </div>
        }
        position={50}
        style={{
          height: '100%',
          width: '100%',
        }}
      />

      {/* Labels */}
      <div className="absolute bottom-4 left-4 glass px-3 py-1.5 rounded-full">
        <span className="text-sm font-medium text-gray-700">{beforeLabel}</span>
      </div>
      <div className="absolute bottom-4 right-4 glass px-3 py-1.5 rounded-full">
        <span className="text-sm font-medium text-gray-700">{afterLabel}</span>
      </div>
    </motion.div>
  )
}

