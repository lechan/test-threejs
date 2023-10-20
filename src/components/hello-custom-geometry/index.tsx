import { useEffect, useRef } from "react";
import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import "./index.scss";

const HelloCustomGeometry = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }

    const renderer = new Three.WebGLRenderer({ canvas: canvasRef.current });
    const scene = new Three.Scene();

    const camera = new Three.PerspectiveCamera(45, 2, 0.1, 100);
    camera.position.z = 8;

    const light = new Three.DirectionalLight(0xffffff, 1);
    light.position.set(2, 2, 4);
    scene.add(light);

    const helper = new Three.DirectionalLightHelper(light);
    scene.add(helper);

    const controls = new OrbitControls(camera, canvasRef.current);
    controls.update();

    //自定义一个立方体几何体
    const geometry = new Three.Geometry();
    geometry.vertices.push(
      new Three.Vector3(-1, -1, 1), // 1
      new Three.Vector3(1, -1, 1), // 2
      new Three.Vector3(-1, 1, 1), // 3
      new Three.Vector3(1, 1, 1), // 4
      new Three.Vector3(-1, -1, -1), // 5
      new Three.Vector3(1, -1, -1), // 6
      new Three.Vector3(-1, 1, -1), // 7
      new Three.Vector3(1, 1, -1) // 8
    );
    geometry.faces.push(
      //前面
      new Three.Face3(0, 3, 2),
      new Three.Face3(0, 1, 3),
      //右面
      new Three.Face3(1, 7, 3),
      new Three.Face3(1, 5, 7),
      //后面
      new Three.Face3(5, 6, 7),
      new Three.Face3(5, 4, 6),
      //左面
      new Three.Face3(4, 2, 6),
      new Three.Face3(4, 0, 2),
      //顶面
      new Three.Face3(2, 7, 6),
      new Three.Face3(2, 3, 7),
      //底面
      new Three.Face3(4, 1, 0),
      new Three.Face3(4, 5, 1)
    );

    geometry.faces[0].color = geometry.faces[1].color = new Three.Color("red");
    geometry.faces[2].color = geometry.faces[3].color = new Three.Color(
      "yello"
    );
    geometry.faces[4].color = geometry.faces[5].color = new Three.Color(
      "green"
    );
    geometry.faces[6].color = geometry.faces[7].color = new Three.Color("cyan");
    geometry.faces[8].color = geometry.faces[9].color = new Three.Color("blue");
    geometry.faces[10].color = geometry.faces[11].color = new Three.Color(
      "magenta"
    );

    geometry.faces.forEach((face, index) => {
      face.vertexColors = [
        new Three.Color().setHSL(index / 12, 1, 0.5),
        new Three.Color().setHSL(index / 12 + 0.1, 1, 0.5),
        new Three.Color().setHSL(index / 12 + 0.2, 1, 0.5),
      ];
    });

    geometry.computeFaceNormals();
    //geometry.computeVertexNormals() //对于立方体而言，无需执行此方法

    //const material = new Three.MeshBasicMaterial({ color: 'red' })
    const material = new Three.MeshPhongMaterial({ vertexColors: true });
    //const material = new Three.MeshPhongMaterial({ color: 'red' })
    const cube = new Three.Mesh(geometry, material);
    scene.add(cube);

    const render = (time: number) => {
      cube.rotation.x = cube.rotation.y = time * 0.001;
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
  }, [canvasRef]);

  return <canvas ref={canvasRef} className="full-screen" />;
};

export default HelloCustomGeometry;
