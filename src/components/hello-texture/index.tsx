import { useEffect, useRef } from "react";
import * as Three from "three";

import "./index.scss";
// import imgSrc from "@/assets/imgs/mapping.jpg"; //引入图片资源

import imgSrc0 from '@/assets/imgs/dice0.jpg'
import imgSrc1 from '@/assets/imgs/dice1.jpg'
import imgSrc2 from '@/assets/imgs/dice2.jpg'
import imgSrc3 from '@/assets/imgs/dice3.jpg'
import imgSrc4 from '@/assets/imgs/dice4.jpg'
import imgSrc5 from '@/assets/imgs/dice5.jpg'

const HelloTexture = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }

    const renderer = new Three.WebGLRenderer({
      canvas: canvasRef.current as HTMLCanvasElement,
    });

    const camera = new Three.PerspectiveCamera(40, 2, 0.1, 1000);
    camera.position.set(0, 0, 40);

    const scene = new Three.Scene();
    scene.background = new Three.Color(0xcccccc);

    //创建所有纹理加载的管理器
    const loadingManager = new Three.LoadingManager()
    //创建一个 纹理加载器
    const loader = new Three.TextureLoader(loadingManager);
    //创建一个材质，材质的 map 属性值为 纹理加载器加载的图片资源
    // const material = new Three.MeshBasicMaterial({
    //   map: loader.load(imgSrc), //loader.load('xxx.jpg')返回值为Three.Text类型实例
    // });

    const imgSraArr = [imgSrc0, imgSrc5, imgSrc1, imgSrc4, imgSrc2, imgSrc3]
    //创建一组材质，每个材质对应立方体每个面所用到的材质
    const materialArr: Three.MeshBasicMaterial[] = []
    imgSraArr.forEach((src) => {
      materialArr.push(new Three.MeshBasicMaterial({
        map: loader.load(src)
      }))
    })

    //添加加载管理器的各种事件处理函数
    loadingManager.onLoad = () => {
      console.log('纹理图片资源加载完成')
    }
    loadingManager.onProgress = (url, loaded, total) => {
      console.log(`图片加载中, 共 ${total} 张，当前已加载 ${loaded} 张 ${url}`)
    }
    loadingManager.onError = (url) => {
      console.log(`加载失败 ${url}`)
    }

    const box = new Three.BoxBufferGeometry(8, 8, 8);
    // const mesh = new Three.Mesh(box, material);
    const mesh = new Three.Mesh(box, materialArr) //注意，此处使用的不再是单个材质，而是一个材质数组
    scene.add(mesh);

    const render = (time: number) => {
      time = time * 0.001;

      mesh.rotation.x = time;
      mesh.rotation.y = time;
      renderer.render(scene, camera);

      window.requestAnimationFrame(render);
    };
    window.requestAnimationFrame(render);

    const resizeHandle = () => {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    };
    resizeHandle();
    window.addEventListener("resize", resizeHandle);

    return () => {
      window.removeEventListener("resize", resizeHandle);
    };
  }, [canvasRef]);

  return <canvas ref={canvasRef} className="full-screen" />;
};

export default HelloTexture;
