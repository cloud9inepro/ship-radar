const Ship = () => {
  return (
    <group position={[0, 0.02, 0]} rotation={[0, Math.PI / 2, 0]}>

      {/* main hull */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.06, 0.04, 0.4]} />
        <meshStandardMaterial color="#4a3a2a" />
      </mesh>

      {/* upper deck */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.05, 0.02, 0.38]} />
        <meshStandardMaterial color="#6a5a4a" />
      </mesh>

      {/* cabin block */}
      <mesh position={[0, 0.09, 0.1]}>
        <boxGeometry args={[0.04, 0.06, 0.1]} />
        <meshStandardMaterial color="#8a7a6a" />
      </mesh>

      {/* bridge */}
      <mesh position={[0, 0.14, 0.1]}>
        <boxGeometry args={[0.035, 0.03, 0.06]} />
        <meshStandardMaterial color="#aaa090" />
      </mesh>

    </group>
  )
}

export { default } from './ShipModel'