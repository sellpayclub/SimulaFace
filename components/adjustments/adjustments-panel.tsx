'use client'

import { AdjustmentCard } from './adjustment-card'
import { FACIAL_AREAS } from '@/lib/facial-areas'
import { useSimulationStore } from '@/lib/store'
import type { AdjustmentValue } from '@/types'

export function AdjustmentsPanel() {
  const { adjustments, setAdjustment } = useSimulationStore()

  const handleChange = (areaId: string, optionId: string, value: AdjustmentValue) => {
    const key = `${areaId}_${optionId}`
    setAdjustment(key, value)
  }

  // Group areas by category
  const upperFace = FACIAL_AREAS.filter(a => ['testa', 'olhos'].includes(a.id))
  const midFace = FACIAL_AREAS.filter(a => ['nariz', 'sulco_nasogeniano', 'maca_rosto', 'boca', 'bigode'].includes(a.id))
  const lowerFace = FACIAL_AREAS.filter(a => ['queixo', 'mandibula', 'pescoco'].includes(a.id))

  return (
    <div className="space-y-8">
      {/* Upper Face */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 font-serif">
          Região Superior
        </h2>
        <div className="space-y-3">
          {upperFace.map((area) => (
            <AdjustmentCard
              key={area.id}
              area={area}
              values={adjustments}
              onChange={(optionId, value) => handleChange(area.id, optionId, value)}
            />
          ))}
        </div>
      </section>

      {/* Mid Face */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 font-serif">
          Região Central
        </h2>
        <div className="space-y-3">
          {midFace.map((area) => (
            <AdjustmentCard
              key={area.id}
              area={area}
              values={adjustments}
              onChange={(optionId, value) => handleChange(area.id, optionId, value)}
            />
          ))}
        </div>
      </section>

      {/* Lower Face */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4 font-serif">
          Região Inferior
        </h2>
        <div className="space-y-3">
          {lowerFace.map((area) => (
            <AdjustmentCard
              key={area.id}
              area={area}
              values={adjustments}
              onChange={(optionId, value) => handleChange(area.id, optionId, value)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

