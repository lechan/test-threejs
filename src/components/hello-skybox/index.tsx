import { useRef, useEffect } from "react";
import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import "./index.scss";

const HelloSkybox = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<Three.Texture | null>(null);

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }

    const renderer = new Three.WebGLRenderer({ canvas: canvasRef.current });

    const scene = new Three.Scene();
    const textureLoader = new Three.TextureLoader();
    // textureLoader.load(require("@/assets/imgs/bluesky.jpg"), (texture) => {
    //   textureRef.current = texture;
    //   scene.background = textureRef.current;
    //   handleResize();
    // });
    // scene.background = textureRef.current;

    // const cubeTextureLoader = new Three.CubeTextureLoader();
    // cubeTextureLoader.load(
    //   [
    //     "https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-x.jpg",
    //     "https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-x.jpg",
    //     "https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-y.jpg",
    //     "https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-y.jpg",
    //     "https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/pos-z.jpg",
    //     "https://threejsfundamentals.org/threejs/resources/images/cubemaps/computer-history-museum/neg-z.jpg",
    //   ],
    //   (texture) => {
    //     scene.background = texture;
    //   }
    // );
    textureLoader.load(require('@/assets/imgs/tears_of_steel_bridge_2k.jpg'),
        (texture) => {
            const crt = new Three.WebGLCubeRenderTarget(texture.image.height)
            crt.fromEquirectangularTexture(renderer,texture)
            scene.background = crt.texture
        }
    )

    const camera = new Three.PerspectiveCamera(20, 2, 0.1, 100);
    camera.position.set(5, 5, 10);

    const light = new Three.HemisphereLight(0xffffff, 0x333333, 5);
    scene.add(light);

    const loader = new GLTFLoader();
    loader.load(require("@/assets/model/Astronaut.glb"), (gltf) => {
      scene.add(gltf.scene);
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
      const canvasAspect = width / height;

      if (textureRef.current !== null) {
        const bgTexture = textureRef.current;
        const imgAspect = bgTexture.image.width / bgTexture.image.height;

        const resultAspect = imgAspect / canvasAspect;

        bgTexture.offset.x = resultAspect > 1 ? (1 - 1 / resultAspect) / 2 : 0;
        bgTexture.repeat.x = resultAspect > 1 ? 1 / resultAspect : 1;

        bgTexture.offset.y = resultAspect > 1 ? 0 : (1 - resultAspect) / 2;
        bgTexture.repeat.y = resultAspect > 1 ? 1 : resultAspect;
      }

      camera.aspect = canvasAspect;
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

export default HelloSkybox;
