import { ConeBufferGeometry } from "three"

const radius = 7
const height = 8
const segments = 24

const myCone = new ConeBufferGeometry(radius, height, segments)

export default myCone