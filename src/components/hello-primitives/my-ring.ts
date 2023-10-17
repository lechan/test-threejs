import { RingBufferGeometry } from "three"

const innerRadius = 2
const outerRadius = 7
const segments = 18

const myRing = new RingBufferGeometry(innerRadius, outerRadius, segments)

export default myRing