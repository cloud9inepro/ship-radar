import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import SceneManager from './components/scene/SceneManager'

const App = () => {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position: [0, 0, 3],
        }}
        dpr={[1, 2]}              // max 2x pixel ratio, protects mobile GPU
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
      >
        <Suspense fallback={null}>
          <SceneManager />
        </Suspense>
      </Canvas>
    </div>
  )
}

export default App