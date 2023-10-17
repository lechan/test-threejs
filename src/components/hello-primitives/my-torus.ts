import { TorusBufferGeometry } from "three"

const radius = 5;
const tubeRadius = 2;
const radialSegments = 8;
const tubularSegments = 24;

const myTorus = new TorusBufferGeometry(radius, tubeRadius, radialSegments, tubularSegments)

export default myTorus