import { useRef, useEffect } from 'react'
import * as Three from 'three'
import { solarSystem, earthOrbit, moonOribit, pointLight } from '@/components/hello-scene/create-something'

import './index.scss'

const nodeArr = [solarSystem, earthOrbit, moonOribit] //太阳、地球、月亮对应的网格

const HelloScene = () => {

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const rendererRef = useRef<Three.WebGLRenderer | null>(null)
    const cameraRef = useRef<Three.PerspectiveCamera | null>(null)
    const sceneRef = useRef<Three.Scene | null>(null)

    useEffect(() => {

        //创建渲染器
        const renderer = new Three.WebGLRenderer({ canvas: canvasRef.current as HTMLCanvasElement })
        rendererRef.current = renderer

        //创建镜头
        const camera = new Three.PerspectiveCamera(40, 2, 0.1, 1000)
        camera.position.set(0, 50, 0)
        camera.up.set(0, 0, 1)
        camera.lookAt(0, 0, 0)
        cameraRef.current = camera

        //创建场景
        const scene = new Three.Scene()
        scene.background = new Three.Color(0x111111)
        sceneRef.current = scene

        //将太阳系、灯光添加到场景中
        scene.add(solarSystem)
        scene.add(pointLight)

        //显示轴线
        nodeArr.forEach((item) => {
          const axes = new Three.AxesHelper()
          const material = axes.material as Three.Material
          material.depthTest = false
          axes.renderOrder = 1 // renderOrder 的该值默认为 0，这里设置为 1 ，目的是为了提高优先级，避免被物体本身给遮盖住
          item.add(axes)
        })

        //创建循环渲染的动画
        const render = (time: number) => {
            time = time * 0.001
            nodeArr.forEach((item) => {
                item.rotation.y = time
            })
            renderer.render(scene, camera)
            window.requestAnimationFrame(render)
        }
        window.requestAnimationFrame(render)

        //添加窗口尺寸变化的监听
        const resizeHandle = () => {
            const canvas = renderer.domElement
            camera.aspect = canvas.clientWidth / canvas.clientHeight
            camera.updateProjectionMatrix()
            renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)
        }
        resizeHandle()
        window.addEventListener('resize', resizeHandle)

        return () => {
            window.removeEventListener('resize', resizeHandle)
        }
    }, [canvasRef])

    return (
        <canvas ref={canvasRef} className='full-screen' />
    )
}

export default HelloScene