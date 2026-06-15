import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Water } from 'three/examples/jsm/objects/Water.js'

const sunDirection = new THREE.Vector3(1, 1, 0.5).normalize()

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
  sunColor:        0xffffff,
  waterColor:      0x3a5060,
  distortionScale: 0.3,
  alpha:           0.5,
  fog:             true,
})

    // apply sun direction to the shader uniforms directly
    w.material.uniforms['sunDirection'].value.copy(sunDirection)

    return w
  }, [])

  useFrame((_, delta) => {
    if (water.material.uniforms['time']) {
      water.material.uniforms['time'].value += delta * 0.1
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