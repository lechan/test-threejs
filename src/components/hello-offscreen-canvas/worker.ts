import * as Three from "three";
import { CanvasSize, MessageData, WorkerFunName } from "./message-data";

let renderer: Three.WebGLRenderer;
let camera: Three.PerspectiveCamera;
let scene: Three.Scene;

//定义初始化的函数
const main = (canvas: OffscreenCanvas) => {
  //开始创建 3D 相关场景
  renderer = new Three.WebGLRenderer({ canvas });
  camera = new Three.PerspectiveCamera(45, 2, 0.1, 100);
  camera.position.z = 4;
  scene = new Three.Scene();

  const colors = ["blue", "red", "green"];
  const cubes: Three.Mesh[] = [];
  colors.forEach((color, index) => {
    const material = new Three.MeshPhongMaterial({ color });
    const geometry = new Three.BoxBufferGeometry(1, 1, 1);
    const mesh = new Three.Mesh(geometry, material);
    mesh.position.x = (index - 1) * 2;
    scene.add(mesh);
    cubes.push(mesh);
  });

  const light = new Three.DirectionalLight(0xffffff, 1);
  light.position.set(-2, 2, 2);
  scene.add(light);

  const render = (time: number) => {
    time *= 0.001;
    cubes.forEach((item) => {
      item.rotation.set(time, time, 0);
    });
    renderer.render(scene, camera);
    self.requestAnimationFrame(render);
  };
  self.requestAnimationFrame(render);
};

//定义用来接收画布尺寸更新的函数
const updateSize = (newSize: CanvasSize) => {
  camera.aspect = newSize.width / newSize.height;
  camera.updateProjectionMatrix();
  renderer.setSize(newSize.width, newSize.height, false);
};

const handleMessage = (eve: MessageEvent<MessageData>) => {
  switch (eve.data.type) {
    case WorkerFunName.main:
      main(eve.data.params);
      break;
    case WorkerFunName.updateSize:
      updateSize(eve.data.params);
      break;
    default:
      throw new Error(`no handle for the type`);
  }
};
self.addEventListener("message", handleMessage);

const handleMessageError = () => {
  throw new Error("Worker.ts: message error ...");
};
self.addEventListener("messageerror", handleMessageError);

//导出 {} 是因为 .ts 类型的文件必须有导出对象才可以被 TS 编译成模块，而不是全局对象
export {};
