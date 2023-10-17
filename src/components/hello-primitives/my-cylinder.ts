import { CylinderBufferGeometry } from "three"

const radiusTop = 4
const radiusBottom = 4
const height = 8
const radialSegments = 12

const myCylinder = new CylinderBufferGeometry(radiusTop, radiusBottom, height, radialSegments)

export default myCylinder