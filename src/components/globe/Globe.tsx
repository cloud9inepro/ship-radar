import { useTexture, OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import type { Mesh } from 'three'
import { useResponsiveCamera } from '../../hooks/useResponsiveCamera'

const Globe = () => {
  const meshRef = useRef<Mesh>(null)
  const earthTexture = useTexture('/earth.jpg')
  const { camera } = useThree()
  const { cameraZ, minDistance, maxDistance } = useResponsiveCamera()

  useEffect(() => {
    camera.position.set(0, 0, cameraZ)
  }, [cameraZ, camera])

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