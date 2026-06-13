import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import SceneManager from './components/scene/SceneManager'
import SearchBar from './components/ui/SearchBar'
import ShipCard from './components/ui/ShipCard'
import ShipList from './components/ui/ShipList'

const App = () => {
  const [isPanelOpen, setIsPanelOpen] = useState(true)

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">

      {/* 3D Canvas — always full screen behind everything */}
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

      {/* UI Panel — overlays on top of canvas */}
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

      {/* Toggle button — sits at the right edge of the panel */}
      <button
        onClick={() => setIsPanelOpen(prev => !prev)}
        style={{ left: isPanelOpen ? '16rem' : '0' }}
        className="
          absolute z-20 top-1/2 -translate-y-1/2
          w-5 h-12 rounded-r-full
          bg-[#0a0c10]/90 border border-l-0 border-white/10
          flex items-center justify-center text-white/40
          hover:text-white transition-all duration-500
          md:left-auto
        "
      >
        {isPanelOpen
          ? <ChevronLeft size={12} />
          : <ChevronRight size={12} />
        }
      </button>

    </div>
  )
}

export default App