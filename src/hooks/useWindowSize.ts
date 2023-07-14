import { useEffect, useLayoutEffect, useState } from "react";

export interface WindowSize {
  width: number;
  height: number;
}

function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 500,
  });

  useEffect(() => {
    function updateWindowSize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    if (typeof window !== "undefined") {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      window.addEventListener("resize", updateWindowSize);

      return () => {
        window.removeEventListener("resize", updateWindowSize);
      };
    }
  }, []);

  return windowSize;
}

export default useWindowSize;
