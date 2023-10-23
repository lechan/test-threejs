import { useEffect, useRef } from "react";
import { WorkerFunName } from "./message-data";
import Worker from "worker-loader!./worker";

import "./index.scss";

const HelloOffscreenCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current === null) {
      return;
    }

    const canvas = canvasRef.current as HTMLCanvasElement;
    const offscreen = canvas.transferControlToOffscreen();

    const worker = new Worker();
    worker.postMessage({ type: WorkerFunName.main, params: offscreen }, [
      offscreen,
    ]);

    const handleMessageError = (error: MessageEvent<any>) => {
      console.log(error);
    };
    const handleError = (error: ErrorEvent) => {
      console.log(error);
    };
    worker.addEventListener("messageerror", handleMessageError);
    worker.addEventListener("error", handleError);

    const handleResize = () => {
      worker.postMessage({
        type: WorkerFunName.updateSize,
        params: { width: canvas.clientWidth, height: canvas.clientHeight },
      });
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      worker.removeEventListener("messageerror", handleMessageError);
      worker.removeEventListener("error", handleError);
    };
  }, [canvasRef]);

  return <canvas ref={canvasRef} className="full-screen" />;
};

export default HelloOffscreenCanvas;
