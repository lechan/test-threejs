import { SphereBufferGeometry } from "three"

const radius = 7
const widthSegments = 12
const heightSegments = 8

const mySphere = new SphereBufferGeometry(radius, widthSegments, heightSegments)

export default mySphere