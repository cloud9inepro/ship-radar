import { useTexture, OrbitControls } from '@react-three/drei'
import { useThree, useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import type { Mesh } from 'three'
import { useResponsiveCamera } from '../../hooks/useResponsiveCamera'
import { useStore } from '../../store/useStore'

const Globe = () => {
  const meshRef    = useRef<Mesh>(null)
  const earthTexture = useTexture('/earth.jpg')
  const { camera }   = useThree()
  const { cameraZ, minDistance, maxDistance } = useResponsiveCamera()
  const activeShip = useStore(state => state.activeShip)

  useEffect(() => {
    camera.position.set(0, 0, cameraZ)
  }, [cameraZ, camera])

  // slowly rotate globe when idle
  // useFrame((_, delta) => {
  //   if (meshRef.current && !activeShip) {
  //     meshRef.current.rotation.y += delta * 0.04
  //   }
  // })

  return (
    <>
      <OrbitControls
        makeDefault
        enablePan={false}
        minDistance={minDistance}
        maxDistance={maxDistance}
        enableDamping
        dampingFactor={0.05}
      />
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial map={earthTexture} />
      </mesh>
    </>
  )
}

export default Globe