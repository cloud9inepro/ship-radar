import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  varying vec2 vUv;
  uniform float time;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  void main() {
    float dist = vUv.y;
    float side = abs(vUv.x - 0.5) * 2.0;

    // tighter Kelvin V — narrower spread
    float kelvinEdge = dist * 0.22;
    float vShape = smoothstep(kelvinEdge + 0.04, kelvinEdge - 0.01, side);

    // thin center wash only
    float centerWash = smoothstep(0.12, 0.0, side) * (1.0 - dist * 0.7);

    float wakeMask = max(vShape * 0.65, centerWash);

    // animated foam flowing away from stern
    vec2 foamUV = vec2(vUv.x * 6.0, vUv.y * 10.0 - time * 1.2);
    float foam  = noise(foamUV * 4.0);
    foam       += noise(foamUV * 8.0)  * 0.5;
    foam       += noise(foamUV * 16.0) * 0.25;
    foam        = smoothstep(0.4, 0.78, foam / 1.75);

    // aggressive distance fade — wake tightens fast
    float distFade  = 1.0 - smoothstep(0.0, 0.85, dist * dist);
    float sternFade = smoothstep(0.0, 0.08, dist);

    float alpha = wakeMask * foam * distFade * sternFade * 0.9;

    gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
  }
`

const WakeTrail = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(() => ({
    time: { value: 0 },
  }), [])

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value += delta
    }
  })

  return (
    <mesh
      rotation={[-Math.PI / 2 + 0.2, Math.PI / 2, 0]}
      position={[0.9, 0.015, 0]}
    >
      {/* narrower width, same length */}
      <planeGeometry args={[0.45,1.8, 32, 32]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        side={THREE.FrontSide}
      />
    </mesh>
  )
}

export default WakeTrail