import { useEffect, useRef } from "react";
import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./index.scss";
interface URLParams {
  width: number,
  height: number,
  depth: number
}

const getURLParams = (): URLParams => {
  const params = new URLSearchParams(window.location.search.substring(1))
  const widthStr = params.get('width')
  const heightStr = params.get('height')
  const depthStr = params.get('depth')

  let [width, height, depth] = [4, 4, 4]

  if (widthStr) { width = parseInt(widthStr, 10) || 4 }
  if (heightStr) { height = parseInt(heightStr, 10) || 4 }
  if (depthStr) { depth = parseInt(depthStr, 10) || 4 }

  return { width, height, depth }
}
let boo = false;
const RenderingOnDemand = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const urlParams = getURLParams()
  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }

    const renderer = new Three.WebGLRenderer({ canvas: canvasRef.current });
    const scene = new Three.Scene();
    const camera = new Three.PerspectiveCamera(45, 2, 1, 100);
    camera.position.z = 20;
    const light = new Three.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 10);
    scene.add(light);

    const colors = ["blue", "red", "green"];
    const cubes: Three.Mesh[] = [];
    colors.forEach((color, index) => {
      
      const material = new Three.MeshPhongMaterial({ color });
      const geometry = new Three.BoxBufferGeometry(urlParams.width, urlParams.height, urlParams.depth);
      const mesh = new Three.Mesh(geometry, material);
      mesh.position.x = (index - 1) * Math.max(urlParams.width, urlParams.height, urlParams.depth) * 1.5;
      scene.add(mesh);
      cubes.push(mesh);
    });

    const render = () => {
      boo = false;
      controls.update();
      renderer.render(scene, camera);
    };
    window.requestAnimationFrame(render);

    const handleChange = () => {
      if (boo === false) {
        boo = true;
        window.requestAnimationFrame(render);
      }
    };

    const controls = new OrbitControls(camera, canvasRef.current);
    controls.addEventListener("change", handleChange);
    controls.enableDamping = true;
    controls.update();

    const handleResize = () => {
      if (canvasRef.current === null) {
        return;
      }
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [canvasRef, urlParams]);
  return (
    <div className="full-screen">
      <canvas ref={canvasRef} className="full-screen" />
      <div className='debug'>
          <span>width:{urlParams.width}</span>
          <span>height:{urlParams.height}</span>
          <span>depth:{urlParams.depth}</span>
      </div>
    </div>
  );
};

export default RenderingOnDemand;
