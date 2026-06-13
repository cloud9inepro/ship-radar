import { useStore } from '../../store/useStore'

const ShipList = () => {
  const shipList = useStore(state => state.shipList)
  const activeShip = useStore(state => state.activeShip)
  const searchQuery = useStore(state => state.searchQuery)
  const setActiveShip = useStore(state => state.setActiveShip)

  const filtered = shipList.filter(ship =>
    ship.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ship.destination.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex-1 overflow-y-auto">
      {filtered.map((ship, index) => (
        <button
          key={ship.id}
          onClick={() => setActiveShip(ship)}
          className={`
            w-full text-left px-4 py-3 border-b border-white/5
            transition-colors duration-200 group
            ${activeShip?.id === ship.id ? 'bg-white/10' : 'hover:bg-white/5'}
          `}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/40 text-[9px] tracking-widest uppercase">
                {String(index + 1).padStart(2, '0')} · {ship.type}
              </p>
              <p className="text-white text-xs tracking-widest uppercase mt-0.5">
                {ship.name}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/30 text-[9px] tracking-widest uppercase">
                {ship.speed} KTS
              </p>
              <p className="text-white/50 text-[9px] tracking-widest uppercase mt-0.5">
                → {ship.destination}
              </p>
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

export default ShipList