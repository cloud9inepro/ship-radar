import { WakeTrailModel } from './WakeTrailModel'

const WakeTrail = () => {
  return (
    <WakeTrailModel
      position={[-2.4, 0, 0]}
      rotation={[0, -Math.PI / 2, 0]}
      scale={30}
    />
  )
}

export default WakeTrail