import { TubeBufferGeometry, Curve, Vector3 } from "three"

class CustomSinCurve extends Curve<Vector3> {
  scale: number
  constructor(scale: number) {
    super()
    this.scale = scale
  }
  getPoint(t: number) {
    const tx = t * 3 - 1.5
    const ty = Math.sin(2 * Math.PI * t)
    const tz = 0
    return new Vector3(tx, ty, tz).multiplyScalar(this.scale)
  }
}

const path = new CustomSinCurve(4)
const tubularSegments = 20
const radius = 1
const radialSegments = 8
const closed = false

const myTube = new TubeBufferGeometry(path, tubularSegments, radius, radialSegments, closed)

export default myTube