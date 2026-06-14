import { useStore } from '../../store/useStore'
import Globe from '../globe/Globe'
import ShipDots from '../globe/ShipDots'
import CameraRig from './CameraRig'
import Ocean from '../ocean/Ocean'
import ShipGroup from '../ocean/ShipGroup'
import { EffectComposer, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2 } from 'three'

const SceneManager = () => {
  const viewMode        = useStore(state => state.viewMode)
  const isTransitioning = useStore(state => state.isTransitioning)

  return (
    <>
      {viewMode === 'ocean' && (
  <>
    <color attach="background" args={['#6e7e8a']} />
    <fog attach="fog" args={['#7a8e9a', 4, 18]} />
  </>
)}

<ambientLight intensity={2.5} color="#b0c4cc" />
<directionalLight position={[5, 8, 3]} intensity={1.2} color="#d0dde0" />
<directionalLight position={[-5, 4, -3]} intensity={0.8} color="#9ab0b8" />

      <CameraRig />

      {viewMode === 'globe' && (
        <>
          <Globe />
          <ShipDots />
        </>
      )}

      {viewMode === 'ocean' && (
        <>
          <Ocean />
          <ShipGroup />
        </>
      )}

      <EffectComposer multisampling={0}>
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={new Vector2(
            isTransitioning ? 0.012 : 0.0005,
            isTransitioning ? 0.012 : 0.0005,
          )}
        />
        <Vignette
          offset={0.3}
          darkness={isTransitioning ? 1.4 : 0.45}
          eskil={false}
        />
      </EffectComposer>
    </>
  )
}

export default SceneManager