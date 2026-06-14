import { WakeTrailModel } from './WakeTrailModel'

const WakeTrail = () => {
  return (
    <WakeTrailModel
      position={[0.8, 0, 0]}
      rotation={[0, Math.PI / 2, 0]}
      scale={18}
    />
  )
}

export default WakeTrail