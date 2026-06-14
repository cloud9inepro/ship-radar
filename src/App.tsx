import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import SceneManager from './components/scene/SceneManager'
import SearchBar from './components/ui/SearchBar'
import ShipCard from './components/ui/ShipCard'
import ShipList from './components/ui/ShipList'
import { useStore } from './store/useStore'
import OceanHUD from './components/ui/OceanHUD'

const App = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(true)

  const viewMode         = useStore(state => state.viewMode)
  const isTransitioning  = useStore(state => state.isTransitioning)
  const setViewMode      = useStore(state => state.setViewMode)
  const setActiveShip    = useStore(state => state.setActiveShip)
  const setIsTransitioning = useStore(state => state.setIsTransitioning)

  const handleBackToGlobe = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setViewMode('globe')
      setActiveShip(null)
      setTimeout(() => setIsTransitioning(false), 400)
    }, 400)
  }

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ fov: 45, near: 0.1, far: 1000, position: [0, 0, 3] }}
          dpr={[1, 2]}
          gl={{ antialias: true, powerPreference: 'high-performance' }}
        >
          <Suspense fallback={null}>
            <SceneManager />
          </Suspense>
        </Canvas>
      </div>

      {/* Cinematic transition overlay */}
<div className={`
  absolute inset-0 z-50 pointer-events-none
  transition-opacity duration-300
  ${isTransitioning ? 'opacity-100' : 'opacity-0'}
`}
  style={{
    background: 'radial-gradient(ellipse at center, rgba(20,40,60,0.6) 0%, rgba(0,5,10,0.97) 100%)'
  }}
/>

      {/* Globe mode UI */}
      {viewMode === 'globe' && (
        <>
          {/* Panel */}
          <div className={`
            absolute z-10 top-0 left-0 h-full flex flex-col
            bg-[#0a0c10]/90 backdrop-blur-sm border-r border-white/10
            transition-transform duration-500 ease-in-out
            w-64 md:w-72
            ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}
          `}>
            <div className="px-4 py-4 border-b border-white/10">
              <p className="text-white/30 text-[9px] tracking-widest uppercase">
                Maritime Radar
              </p>
              <h1 className="text-white text-sm tracking-widest uppercase font-medium mt-1">
                Vessel Tracker
              </h1>
            </div>
            <SearchBar />
            <ShipCard />
            <ShipList />
          </div>

          {/* Panel toggle */}
          <button
  onClick={() => setIsPanelOpen(prev => !prev)}
  style={{ left: isPanelOpen ? '16rem' : '0' }}
  className="
    absolute z-20 top-1/2 -translate-y-1/2
    w-6 h-14 rounded-r-full
    bg-white/15 border border-l-0 border-white/40
    flex items-center justify-center text-white
    hover:bg-white/25 transition-all duration-500
    backdrop-blur-sm
  "
>
  {isPanelOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
</button>
        </>
      )}

      {/* Ocean mode UI */}
{viewMode === 'ocean' && (
  <>
    <button
      onClick={handleBackToGlobe}
      className="
        absolute z-20 top-6 left-6
        flex items-center gap-2
        text-white/50 hover:text-white
        text-xs tracking-widest uppercase
        transition-colors duration-200
      "
    >
      <ArrowLeft size={14} />
      Globe View
    </button>

    <OceanHUD />
  </>
)}

    </div>
  )
}

export default App