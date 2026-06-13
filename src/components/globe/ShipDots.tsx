import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import { mockShips } from '../../data/mockShips'
import { latLngToVec3 } from '../../lib/latLngToVec3'

const GLOBE_RADIUS = 1
const SPEED_MULTIPLIER = 100 // speeds up movement so its visible in demo

const ShipDots = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null)

  // local mutable copy of ship positions updated every frame
  const shipStates = useRef(mockShips.map(s => ({ ...s })))

  // dummy object used to calculate each instance matrix
  const dummy = useRef(new THREE.Object3D())

  const setShipList = useStore(state => state.setShipList)

  // populate the store with mock ships on mount
  useEffect(() => {
    setShipList(mockShips)
  }, [])

  useFrame((_, delta) => {
    if (!meshRef.current) return

    shipStates.current.forEach((ship, i) => {
      // convert heading + speed into lat/lng movement
      const headingRad = (ship.heading * Math.PI) / 180
      const speedDeg = (ship.speed * delta * SPEED_MULTIPLIER) / 3600

      ship.lat += Math.cos(headingRad) * speedDeg
      ship.lng += Math.sin(headingRad) * speedDeg

      // wrap longitude so ships dont disappear at 180/-180
      if (ship.lng > 180) ship.lng -= 360
      if (ship.lng < -180) ship.lng += 360

      // clamp latitude so ships dont go over the poles
      ship.lat = Math.max(-85, Math.min(85, ship.lat))

      // place dummy object on globe surface
      const pos = latLngToVec3(ship.lat, ship.lng, GLOBE_RADIUS + 0.01)
      dummy.current.position.copy(pos)

      // point the cone outward from globe center and upright
      dummy.current.lookAt(0, 0, 0)
      dummy.current.rotateX(Math.PI / 2)

      dummy.current.updateMatrix()
      meshRef.current!.setMatrixAt(i, dummy.current.matrix)
    })

    // tell three.js the matrices changed this frame
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, mockShips.length]}>
      <coneGeometry args={[0.008, 0.025, 8]} />
      <meshStandardMaterial color="#ffffff" />
    </instancedMesh>
  )
}

export default ShipDots