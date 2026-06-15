import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Water } from 'three/examples/jsm/objects/Water.js'

// A slightly lower sun angle helps create stronger glittering highlights across the waves
const sunDirection = new THREE.Vector3(2, 1, 1).normalize()

const Ocean = () => {
  const waterRef = useRef<Water | null>(null)

  const water = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(100, 100, 64, 64)

    const waterNormals = new THREE.TextureLoader().load('/waternormals.jpg', (tex) => {
      tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    })

    const w = new Water(geometry, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      sunDirection,
      // 1. PROPER OCEAN COLOR TUNING
      sunColor:        new THREE.Color('#ffffff'), // Warm, bright sunlight highlight
      waterColor:      new THREE.Color('#004b75'), // Deep, rich blue-teal for depth
      distortionScale: 2.0,                        // Increased for more realistic wave distortion
      alpha:           0.8,                        // Allows sunlight to scatter into the surface properly
    })

    w.material.uniforms['sunDirection'].value.copy(sunDirection)

    return w
  }, [])

  useFrame((_, delta) => {
    if (water.material.uniforms['time']) {
      water.material.uniforms['time'].value += delta * 0.5 // Speed up time for realistic wave movement
    }

    // Scroll water normals in +X — ship faces -X so ocean appears to flow past
    const normalSampler = water.material.uniforms['normalSampler']
    if (normalSampler?.value) {
      // Use offset on the texture matrix rather than directly on the sampler object
      water.material.uniforms['textureMatrix'].value.multiply(
        new THREE.Matrix4().makeTranslation(delta * 0.05, 0, 0)
      )
    }
  })

  return (
    <primitive
      ref={waterRef}
      object={water}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.05, 0]}
    />
  )
}

export default Ocean