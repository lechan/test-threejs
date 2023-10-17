import { EdgesGeometry, BoxGeometry } from "three"

const width = 8
const height = 8
const depth = 8
const thresholdAngle = 15

const myBox = new BoxGeometry(width, height, depth)

const myEdges = new EdgesGeometry(myBox, thresholdAngle)

export default myEdges