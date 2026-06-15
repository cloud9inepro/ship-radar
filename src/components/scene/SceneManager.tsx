import { useStore } from '../../store/useStore'
import Globe from '../globe/Globe'
import ShipDots from '../globe/ShipDots'
import Starfield from '../globe/Starfield'
// import Atmosphere from '../globe/Atmosphere'
import CameraRig from './CameraRig'
import Ocean from '../ocean/Ocean'
import ShipGroup from '../ocean/ShipGroup'
import { EffectComposer, ChromaticAberration, Vignette, Bloom } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { Vector2 } from 'three'
import { Environment, Preload } from '@react-three/drei'

const SceneManager = () => {
  const viewMode        = useStore(state => state.viewMode)
  const isTransitioning = useStore(state => state.isTransitioning)

  return (
    <>
      {/* {viewMode === 'ocean' && (
        <>
          <color attach="background" args={['#0a1628']} />
          <fog attach="fog" args={['#7a8e9a', 1, 15]} />
        </>
      )} */}

      {viewMode === 'globe' && (
  <>
    <ambientLight intensity={1.5} />
    <directionalLight position={[10, 10, 5]}  intensity={3}   color="#ffffff" />
    <directionalLight position={[-5, 8, -5]}  intensity={1.5} color="#aac4d0" />
  </>
)}

{viewMode === 'ocean' && (
  <>
    <color attach="background" args={['#0a192f']} />
    {/* <fog attach="fog" args={['#7a8e9a', 1, 15]} /> */}
    <hemisphereLight 
      args={['#4fa9ff', '#001122', 0.6]} // [Sky Color (Bright Blue), Ground Color (Deep Dark Blue), Intensity]
    />
    <directionalLight position={[5, 10, 3]}  intensity={3}   color="#ffffff" />
    <directionalLight position={[-3, 8, -2]} intensity={1.5} color="#ddeeff" />
    <Environment files="/puresky.hdr" environmentIntensity={0.1}/>
    <Preload all/>
  </>
)}


      <CameraRig />

      {viewMode === 'globe' && (
        <>
          <Starfield />
          <Globe />
          {/* <Atmosphere /> */}
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
        <Bloom
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          intensity={viewMode === 'globe' ? 1.2 : 0.4}
        />
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