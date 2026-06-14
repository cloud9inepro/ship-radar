import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import { mockShips } from '../../data/mockShips'
import { latLngToVec3 } from '../../lib/latLngToVec3'

const GLOBE_RADIUS = 1
const SPEED_MULTIPLIER = 100


const FLAG_MAP: Record<string, string> = {
  'Panama':       '🇵🇦',
  'Liberia':      '🇱🇷',
  'Bahamas':      '🇧🇸',
  'Indonesia':    '🇮🇩',
  'Turkey':       '🇹🇷',
  'South Africa': '🇿🇦',
  'Norway':       '🇳🇴',
  'UAE':          '🇦🇪',
  'Brazil':       '🇧🇷',
}

const ShipDots = () => {
  const meshRef       = useRef<THREE.InstancedMesh>(null)
  const labelRefs     = useRef<(THREE.Group | null)[]>(Array(mockShips.length).fill(null))
  const shipStates    = useRef(mockShips.map(s => ({ ...s })))
  const dummy         = useRef(new THREE.Object3D())
  const setShipList   = useStore(state => state.setShipList)
  // const setShipList  = useStore(state => state.setShipList)
const setActiveShip = useStore(state => state.setActiveShip)

  useEffect(() => {
    setShipList(mockShips)
  }, [])

  useFrame((_, delta) => {
    if (!meshRef.current) return

    shipStates.current.forEach((ship, i) => {
      const headingRad = (ship.heading * Math.PI) / 180
      const speedDeg   = (ship.speed * delta * SPEED_MULTIPLIER) / 3600

      ship.lat += Math.cos(headingRad) * speedDeg
      ship.lng += Math.sin(headingRad) * speedDeg

      if (ship.lng > 180)  ship.lng -= 360
      if (ship.lng < -180) ship.lng += 360
      ship.lat = Math.max(-85, Math.min(85, ship.lat))

      // update cone position
      const pos = latLngToVec3(ship.lat, ship.lng, GLOBE_RADIUS + 0.01)
      dummy.current.position.copy(pos)
      dummy.current.lookAt(0, 0, 0)
      dummy.current.rotateX(Math.PI / 2)
      dummy.current.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.current.matrix)

      // update label group position — slightly above cone
      const label = labelRefs.current[i]
      if (label) {
        const labelPos = latLngToVec3(ship.lat, ship.lng, GLOBE_RADIUS + 0.09)
        label.position.copy(labelPos)
      }
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      {/* instanced cones — single draw call */}
      <instancedMesh
  ref={meshRef}
  args={[undefined, undefined, mockShips.length]}
  onClick={(e) => {
    e.stopPropagation()
    if (e.instanceId === undefined) return
    const ship = shipStates.current[e.instanceId]
    if (ship) setActiveShip(mockShips[e.instanceId])
  }}
  onPointerOver={(e) => {
    e.stopPropagation()
    document.body.style.cursor = 'pointer'
  }}
  onPointerOut={() => {
    document.body.style.cursor = 'default'
  }}
>
  <coneGeometry args={[0.008, 0.025, 8]} />
  <meshStandardMaterial
    color="#ffffff"
    emissive="#4488ff"
    emissiveIntensity={2}
  />
</instancedMesh>

      {/* individual label groups driven by useFrame */}
      {mockShips.map((ship, i) => (
  <group
    key={ship.id}
    ref={el => { labelRefs.current[i] = el }}
  >
    <Html
      center
      distanceFactor={4}
      occlude
      style={{ pointerEvents: 'none' }}
    >
      <div style={{
        background:     'rgba(10, 12, 16, 0.82)',
        border:         '1px solid rgba(255,255,255,0.15)',
        borderRadius:   '3px',
        padding:        '2px 6px',
        display:        'flex',
        alignItems:     'center',
        gap:            '4px',
        whiteSpace:     'nowrap',
        backdropFilter: 'blur(4px)',
      }}>
        <span style={{ fontSize: '9px' }}>
          {FLAG_MAP[ship.flag] ?? '🚢'}
        </span>
        <span style={{
          color:         'rgba(255,255,255,0.9)',
          fontSize:      '7px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          fontFamily:    'sans-serif',
        }}>
          {ship.name}
        </span>
      </div>
    </Html>
  </group>
))}
    </>
  )
}

export default ShipDots