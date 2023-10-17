import { useRef, useEffect, useCallback } from 'react'
import * as Three from 'three'

import './index.scss'

import myBox from './my-box'
import myCircle from './my-circle'
import myCone from './my-cone'
import myCylinder from './my-cylinder'
import myDodecahedron from './my-dodecahedron'
import myEdges from './my-edges'
import myExtrude from './my-extrude'
import myIcosahedron from './my-icosahedron'
import myLathe from './my-lathe'
import myOctahedron from './my-octahedron'
import myParametric from './my-parametric'
import myPlane from './my-plane'
import myPolyhedron from './my-polyhedron'
import myRing from './my-ring'
import myShape from './my-shape'
import mySphere from './my-sphere'
import myTetrahedron from './my-tetrahedron'
import myTorus from './my-torus'
import myTorusKnot from './my-torus-knot'
import myTube from './my-tube'
import myWireframe from './my-wireframe'
import createText from './my-text'

const meshArr: (Three.Mesh | Three.LineSegments | Three.Object3D)[] = [] //保存所有图形的元数组

export const createMaterial = () => {
    const material = new Three.MeshPhongMaterial({ side: Three.DoubleSide })

    const hue = Math.floor(Math.random() * 100) / 100 //随机获得一个色相
    const saturation = 1 //饱和度
    const luminance = 0.5 //亮度

    material.color.setHSL(hue, saturation, luminance)

    return material
}

//定义物体在画面中显示的网格布局
const eachRow = 5 //每一行显示 5 个
const spread = 15 //行高 和 列宽

const getPositionByIndex = (index: number) => {
    //我们设定的排列是每行显示 eachRow，即 5 个物体、行高 和 列宽 均为 spread 即 15
    //因此每个物体根据顺序，计算出自己所在的位置
    const row = Math.floor(index / eachRow) //计算出所在行
    const column = index % eachRow //计算出所在列

    const x = (column - 2) * spread //为什么要 -2 ？
    //因为我们希望将每一行物体摆放的单元格，依次是：-2、-1、0、1、2，这样可以使每一整行物体处于居中显示
    const y = (2 - row) * spread

    return { x, y }
}

const HelloPrimitives = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const rendererRef = useRef<Three.WebGLRenderer | null>(null)
    const cameraRef = useRef<Three.PerspectiveCamera | null>(null)

    const createInit = useCallback(
        async () => {

            if (canvasRef.current === null) {
                return
            }

            meshArr.length = 0 //以防万一，先清空原有数组

            //初始化场景
            const scene = new Three.Scene()
            scene.background = new Three.Color(0xAAAAAA)

            //初始化镜头
            const camera = new Three.PerspectiveCamera(40, 2, 0.1, 1000)
            camera.position.z = 120
            cameraRef.current = camera

            //初始化渲染器
            const renderer = new Three.WebGLRenderer({ canvas: canvasRef.current as HTMLCanvasElement })
            rendererRef.current = renderer

            //添加 2 盏灯光
            const light0 = new Three.DirectionalLight(0xFFFFFF, 1)
            light0.position.set(-1, 2, 4)
            scene.add(light0)

            const light1 = new Three.DirectionalLight(0xFFFFFF, 1)
            light0.position.set(1, -2, -4)
            scene.add(light1)

            //获得各个 solid 类型的图元实例，并添加到 solidPrimitivesArr 中
            const solidPrimitivesArr: Three.BufferGeometry[] = []
            solidPrimitivesArr.push(myBox, myCircle, myCone, myCylinder, myDodecahedron)
            solidPrimitivesArr.push(myExtrude, myIcosahedron, myLathe, myOctahedron, myParametric)
            solidPrimitivesArr.push(myPlane, myPolyhedron, myRing, myShape, mySphere)
            solidPrimitivesArr.push(myTetrahedron, myTorus, myTorusKnot, myTube)

            //将各个 solid 类型的图元实例转化为网格，并添加到 primitivesArr 中
            solidPrimitivesArr.forEach((item) => {
                const material = createMaterial() //随机获得一种颜色材质
                const mesh = new Three.Mesh(item, material)
                meshArr.push(mesh) //将网格添加到网格数组中
            })

            //创建 3D 文字，并添加到 mesArr 中，请注意此函数为异步函数
            meshArr.push(await createText())

            //获得各个 line 类型的图元实例，并添加到 meshArr 中
            const linePrimitivesArr: Three.BufferGeometry[] = []
            linePrimitivesArr.push(myEdges, myWireframe)

            //将各个 line 类型的图元实例转化为网格，并添加到 meshArr 中
            linePrimitivesArr.forEach((item) => {
                const material = new Three.LineBasicMaterial({ color: 0x000000 })
                const mesh = new Three.LineSegments(item, material)
                meshArr.push(mesh)
            })

            //配置每一个图元实例，转化为网格，并位置和材质后，将其添加到场景中
            meshArr.forEach((mesh, index) => {
                const { x, y } = getPositionByIndex(index)

                mesh.position.x = x
                mesh.position.y = y

                scene.add(mesh) //将网格添加到场景中
            })

            //添加自动旋转渲染动画
            const render = (time: number) => {
                time = time * 0.001
                meshArr.forEach(item => {
                    item.rotation.x = time
                    item.rotation.y = time
                })

                renderer.render(scene, camera)
                window.requestAnimationFrame(render)
            }
            window.requestAnimationFrame(render)
        },
        [canvasRef],
    )

    const resizeHandle = () => {
        //根据窗口大小变化，重新修改渲染器的视椎
        if (rendererRef.current === null || cameraRef.current === null) {
            return
        }

        const canvas = rendererRef.current.domElement
        cameraRef.current.aspect = canvas.clientWidth / canvas.clientHeight
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(canvas.clientWidth, canvas.clientHeight, false)
    }

    //组件首次装载到网页后触发，开始创建并初始化 3D 场景
    useEffect(() => {
        createInit()
        resizeHandle()
        window.addEventListener('resize', resizeHandle)
        return () => {
            window.removeEventListener('resize', resizeHandle)
        }
    }, [canvasRef, createInit])

    return (
        <canvas ref={canvasRef} className='full-screen' />
    )
}

export default HelloPrimitives