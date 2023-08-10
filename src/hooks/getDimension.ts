import { Size } from "@/components/Home/dto";
import { WindowSize } from "./useWindowSize";

export const getSizeDimensions = (
  windowSize: WindowSize,
  selectedImageSize: Size
) => {
  const isMobile = windowSize.width <= 768;
  const isTab = windowSize.width <= 1024;
  const isDesktop = windowSize.width >= 1024;
  switch (selectedImageSize) {
    case Size.S256:
      if (isMobile) {
        return {
          height: windowSize.height / 2,
          width: windowSize.width / 1.5,
        };
      }
      if (isDesktop) {
        return {
          height: windowSize.height / 2,
          width: windowSize.width / 2.5,
        };
      }
      return {
        height: windowSize.height / 3,
        width: windowSize.width / 3,
      };
    case Size.S512:
      if (isMobile) {
        return {
          height: windowSize.height / 1.5,
          width: windowSize.width / 1.3,
        };
      }
      return {
        height: windowSize.height / 1.5,
        width: windowSize.width / 2,
      };
    case Size.S1024:
      if (isMobile) {
        return {
          height: windowSize.height / 1.2,
          width: windowSize.width / 1.2,
        };
      }
      return {
        height: windowSize.height / 1.3,
        width: windowSize.width / 1.5,
      };
    default:
      return { ...windowSize };
  }
};
