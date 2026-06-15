import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import { latLngToVec3 } from '../../lib/latLngToVec3'
import { useResponsiveCamera } from '../../hooks/useResponsiveCamera'

const GLOBE_RADIUS     = 1
const SPEED_MULTIPLIER = 100
const MAX_RENDER       = 40
const MAX_LABELS       = 20

const ShipDots = () => {
  const meshRef       = useRef<THREE.InstancedMesh>(null)
  const labelRefs     = useRef<(THREE.Group | null)[]>([])
  const shipStates    = useRef<any[]>([])
  const dummy         = useRef(new THREE.Object3D())

  const shipList      = useStore(state => state.shipList)
  const setActiveShip = useStore(state => state.setActiveShip)

  const { maxGlobeShips, maxGlobeLabels } = useResponsiveCamera()

  useEffect(() => {
    if (shipList.length === 0) return
    shipStates.current = shipList.map(s => ({ ...s }))
  }, [shipList])

  useFrame((_, delta) => {
    if (!meshRef.current || shipStates.current.length === 0) return

    shipStates.current.slice(0, maxGlobeShips).forEach((ship, i) => {
      const headingRad = (ship.heading * Math.PI) / 180
      const speedDeg   = (ship.speed * delta * SPEED_MULTIPLIER) / 3600

      ship.lat += Math.cos(headingRad) * speedDeg
      ship.lng += Math.sin(headingRad) * speedDeg

      if (ship.lng > 180)  ship.lng -= 360
      if (ship.lng < -180) ship.lng += 360
      ship.lat = Math.max(-85, Math.min(85, ship.lat))

      const pos = latLngToVec3(ship.lat, ship.lng, GLOBE_RADIUS + 0.01)
      dummy.current.position.copy(pos)
      dummy.current.lookAt(0, 0, 0)
      dummy.current.rotateX(Math.PI / 2)
      dummy.current.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.current.matrix)

      const label = labelRefs.current[i]
      if (label) {
        const labelPos = latLngToVec3(ship.lat, ship.lng, GLOBE_RADIUS + 0.09)
        label.position.copy(labelPos)
      }
    })

    // hide unused instances
    const emptyMatrix = new THREE.Matrix4().makeScale(0, 0, 0)
    for (let i = shipStates.current.length; i < MAX_RENDER; i++) {
      meshRef.current.setMatrixAt(i, emptyMatrix)
    }

    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, 40]}>
        <coneGeometry args={[0.008, 0.025, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#4488ff"
          emissiveIntensity={2}
        />
      </instancedMesh>

      {shipList.slice(0, maxGlobeLabels).map((ship, i) => (
        <group
          key={ship.id}
          ref={el => { labelRefs.current[i] = el }}
        >
          <Html
            center
            distanceFactor={3}
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
              backdropFilter: 'blur(1px)',
            }}>
              <span style={{ fontSize: '9px', color: 'rgba(25,255,255,0.9)' }}>
                {ship.flag}
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