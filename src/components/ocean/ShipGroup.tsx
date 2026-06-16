// import Ship from './Ship'
// import WakeTrail from './WakeTrail'

// const ShipGroup = () => {
//   return (
//     <group>
//       <Ship />
//       <WakeTrail />
//     </group>
//   )
// }

// export default ShipGroup

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Ship from './Ship'
import WakeTrail from './WakeTrail'

const ShipGroup = () => {
  const groupRef = useRef<THREE.Group>(null)

  // Configuration variables
  const duration = 7 // Loop duration in seconds
  const speed = 0.03    // Distance units traveled per second

  useFrame((state) => {
    if (!groupRef.current) return

    // 1. Get the current clock elapsed time
    const elapsedTime = state.clock.getElapsedTime()

    // 2. Use modulo to create a repeating 0 to 5 second timeline
    const loopTime = elapsedTime % duration

    // 3. Calculate distance based on time (Distance = Speed * Time)
    // Since your ocean moves in -X, the ship moves forward in -X to match 
    const currentDistance = loopTime * speed

    // 4. Update the group position along the X axis
    groupRef.current.position.x = currentDistance
  })

  return (
    <group ref={groupRef}>
      <Ship />
      <WakeTrail />
    </group>
  )
}

export default ShipGroup