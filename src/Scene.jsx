import { useRef, useEffect } from 'react'
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing'
import gsap from 'gsap'

const Scene = () => {
  const meshRef = useRef()

  useEffect(() => {
    // GSAP animation
    gsap.to(meshRef.current.rotation, {
      y: Math.PI * 2,
      duration: 4,
      repeat: -1,
      ease: 'none'
    })

    gsap.to(meshRef.current.position, {
      y: 1,
      duration: 2,
      yoyo: true,
      repeat: -1,
      ease: 'power1.inOut'
    })
  }, [])

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} />

      {/* Object */}
      <mesh ref={meshRef}>
        <boxGeometry />
        <meshStandardMaterial color="orange" />
      </mesh>

      {/* Postprocessing */}
      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={0.2} />
        <Noise opacity={0.03} />
      </EffectComposer>
    </>
  )
}

export default Scene