"use client";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    VANTA: any;
    THREE: any;
  }
}

export default function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let vantaEffect: any = null;

    function loadScript(src: string) {
      return new Promise<HTMLScriptElement>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve(script);
        script.onerror = reject;
        document.body.appendChild(script);
      });
    }

    async function initVanta() {
      if (!window.VANTA || !window.THREE) return;
      if (vantaEffect) vantaEffect.destroy();
      vantaEffect = window.VANTA.FOG({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        highlightColor: 0x0,
        midtoneColor: 0xff9500,
        lowlightColor: 0xfa0000,
        baseColor: 0x0,
      });
    }

    let isMounted = true;
    Promise.all([
      loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"),
      loadScript("https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.fog.min.js"),
    ]).then(() => {
      if (isMounted) setTimeout(initVanta, 100);
    });

    return () => {
      isMounted = false;
      if (vantaEffect && vantaEffect.destroy) vantaEffect.destroy();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div
      id="vanta-bg"
      ref={vantaRef}
      style={{ position: "fixed", inset: 0, zIndex: -1, width: "100vw", height: "100vh" }}
      aria-hidden="true"
    />
  );
} 