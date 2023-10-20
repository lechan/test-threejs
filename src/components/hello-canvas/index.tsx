import { useRef, useState } from "react";
import DatGUI, { DatButton } from "react-dat-gui";
import useCreateScene from "./use-create-scene";

import "./index.scss";
import "./index.css";

const HelloCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [date, setDate] = useState<any>({});
  const renderRef =  useCreateScene(canvasRef) //获取自定义 hook 返回的 renderRef

  const handleGUIUpdate = (newDate: any) => {
    setDate(newDate);
  };

  const handleSaveClick = () => {
    if (canvasRef.current === null || renderRef.current === null) {
      return;
    }
    const canvas = canvasRef.current;
    renderRef.current() //此时调用 render()，进行一次渲染，确保 canvas 缓冲区有数据
    //采用 toDataURL() 方式
    // const imgurl = canvas.toDataURL('image/jpeg', 0.8)
    // const a = document.createElement('a')
    // a.href = imgurl
    // a.download = 'myimg.jpeg' //我们定义下载图片的文件名
    // a.click()

    //采用 toBlob() 方式
    canvas.toBlob(
      (blob: Blob | null) => {
        if (blob) {
          const imgurl = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = imgurl;
          a.download = "myimg.jpeg";
          a.click();
        }
      },
      "image/jpeg",
      0.8
    );
  };

  return (
    <div className="full-screen">
      <canvas ref={canvasRef} className="full-screen" />
      <DatGUI data={date} onUpdate={handleGUIUpdate} className="dat-gui">
        <DatButton label="点击保存画布快照" onClick={handleSaveClick} />
      </DatGUI>
    </div>
  );
};

export default HelloCanvas;
