import { useStore } from '../../store/useStore'
import { X } from 'lucide-react'

const ShipCard = () => {
  const activeShip = useStore(state => state.activeShip)
  const setActiveShip = useStore(state => state.setActiveShip)

  if (!activeShip) return null

  return (
    <div className="border-b border-white/10 p-4 space-y-3">

      {/* header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/40 text-[10px] tracking-widest uppercase">
            Active Vessel
          </p>
          <h2 className="text-white text-sm tracking-widest uppercase font-medium mt-0.5">
            {activeShip.name}
          </h2>
        </div>
        <button
          onClick={() => setActiveShip(null)}
          className="text-white/40 hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* stats grid */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Type', value: activeShip.type },
          { label: 'Flag', value: activeShip.flag },
          { label: 'Speed', value: `${activeShip.speed} KTS` },
          { label: 'Heading', value: `${activeShip.heading}°` },
          { label: 'Destination', value: activeShip.destination },
          { label: 'Status', value: 'UNDERWAY' },
        ].map(({ label, value }) => (
          <div key={label}>
            <p className="text-white/30 text-[9px] tracking-widest uppercase">
              {label}
            </p>
            <p className="text-white text-xs tracking-wider uppercase mt-0.5">
              {value}
            </p>
          </div>
        ))}
      </div>

    </div>
  )
}

export default ShipCard