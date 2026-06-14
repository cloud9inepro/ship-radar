import { useStore } from '../../store/useStore'

const OceanHUD = () => {
  const activeShip = useStore(state => state.activeShip)

  if (!activeShip) return null

  return (
    <div className="absolute bottom-8 left-6 z-20 md:bottom-10 md:left-8">

      {/* ship name */}
      <p className="text-white/40 text-[9px] tracking-widest uppercase mb-1">
        Active Vessel
      </p>
      <h2 className="text-white text-lg tracking-widest uppercase font-medium mb-4">
        {activeShip.name}
      </h2>

      {/* divider */}
      <div className="w-12 h-px bg-white/20 mb-4" />

      {/* stats */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-3">
        {[
          { label: 'Type',        value: activeShip.type },
          { label: 'Flag',        value: activeShip.flag },
          { label: 'Speed',       value: `${activeShip.speed} KTS` },
          { label: 'Heading',     value: `${activeShip.heading}°` },
          { label: 'Destination', value: activeShip.destination },
          { label: 'Status',      value: 'Underway' },
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

export default OceanHUD