import { useRef, useEffect } from "react";
import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";

import "./index.scss";

const HelloOBJLoader = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }

    const renderer = new Three.WebGLRenderer({ canvas: canvasRef.current });
    const scene = new Three.Scene();
    const camera = new Three.PerspectiveCamera(45, 2, 0.1, 100);
    camera.position.set(10, 0, 10);

    const light = new Three.HemisphereLight(0xffffff, 0x333333, 1);
    scene.add(light);

    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();
    mtlLoader.load("./model/hello.mtl", (materialCreator) => {
      objLoader.setMaterials(materialCreator);
      objLoader.load("./model/hello.obj", (group) => {
        scene.add(group);
      });
    });

    const control = new OrbitControls(camera, canvasRef.current);
    control.update();

    const render = () => {
      renderer.render(scene, camera);
      window.requestAnimationFrame(render);
    };
    window.requestAnimationFrame(render);

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
  }, []);

  return <canvas ref={canvasRef} className="full-screen" />;
};

export default HelloOBJLoader;
