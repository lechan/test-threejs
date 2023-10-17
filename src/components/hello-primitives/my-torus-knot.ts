import { TorusKnotBufferGeometry } from "three"

const radius = 3.5
const tube = 1.5
const radialSegments = 8
const tubularSegments = 64
const p = 2
const q = 3

const myTorusKnot = new TorusKnotBufferGeometry(radius, tube, radialSegments, tubularSegments, p, q)

export default myTorusKnot