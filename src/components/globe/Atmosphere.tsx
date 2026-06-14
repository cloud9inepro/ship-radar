import * as THREE from 'three'

const vertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
    gl_FragColor = vec4(0.2, 0.5, 1.0, 1.0) * intensity;
  }
`

const Atmosphere = () => {
  return (
    <mesh scale={[1.08, 1.08, 1.08]}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        transparent
      />
    </mesh>
  )
}

export default Atmosphere