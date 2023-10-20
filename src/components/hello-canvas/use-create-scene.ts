import { useEffect, useRef } from "react";
import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

type RenderType = () => void;

const useCreateScene = (canvasRef: React.RefObject<HTMLCanvasElement>) => {
  const renderRef = useRef<RenderType | null>(null);

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }

    const renderer = new Three.WebGLRenderer({
      canvas: canvasRef.current
    });
    const scene = new Three.Scene();
    scene.background = new Three.Color(0x222222);
    const camera = new Three.PerspectiveCamera(45, 2, 0.1, 100);
    camera.position.set(0, 5, 10);

    const light = new Three.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 0);
    scene.add(light);

    const controls = new OrbitControls(camera, canvasRef.current);
    controls.update();

    const colors = ["blue", "red", "green"];
    const cubes: Three.Mesh[] = [];
    colors.forEach((color, index) => {
      const mat = new Three.MeshPhongMaterial({ color });
      const geo = new Three.BoxBufferGeometry(2, 2, 2);
      const mesh = new Three.Mesh(geo, mat);
      mesh.position.x = (index - 1) * 4;
      scene.add(mesh);
      cubes.push(mesh);
    });

    const render = () => {
      renderer.render(scene, camera);
    };
    renderRef.current = render;

    const animate = (time: number) => {
      time *= 0.001;
      cubes.forEach((cube) => {
        cube.rotation.x = cube.rotation.y = time;
      });
      render(); //这样 render() 就是一个不需要参数的函数
      window.requestAnimationFrame(animate);
    };
    window.requestAnimationFrame(animate);

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
  }, [canvasRef]);

  return renderRef;
};

export default useCreateScene;
