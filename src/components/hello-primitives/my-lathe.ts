import { LatheBufferGeometry, Vector2 } from "three"

const points = [];
for (let i = 0; i < 10; ++i) {
  points.push(new Vector2(Math.sin(i * 0.2) * 3 + 3, (i - 5) * .8));
}

const myLathe = new LatheBufferGeometry(points)

export default myLathe