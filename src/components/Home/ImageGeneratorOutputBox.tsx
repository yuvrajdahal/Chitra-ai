import { motion } from "framer-motion";
import { Size } from "./dto";
import { WindowSize } from "@/hooks/useWindowSize";
import { getSizeDimensions } from "@/hooks/getDimension";
import Loader from "../Loader/loader";
import { BsFullscreen } from "react-icons/bs";
const ImageGeneratorOutputBox = ({
  windowSize,
  selectedImageSize,
  divRef,
  setPreviousSize,
  previousSize,
  isSuccess,
  isLoading,
  onClick,
  creationOrRegenIsLoading,
  image,
}: {
  selectedImageSize: Size;
  image: string;
  previousSize: {
    height: number;
    width: number;
  };
  windowSize: WindowSize;
  creationOrRegenIsLoading: boolean;
  setPreviousSize: React.Dispatch<
    React.SetStateAction<{
      height: number;
      width: number;
    }>
  >;
  isSuccess: boolean;
  isLoading: boolean;
  onClick: React.MouseEventHandler<SVGElement>;
  divRef: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <motion.div
      key={selectedImageSize}
      className="relative my-8 overflow-hidden rounded border border-gray-400 bg-gray-600 text-white"
      initial={{
        width: previousSize.width,
        height: previousSize.height,
        transformOrigin: "50% 50%",
      }}
      animate={{
        width: `${getSizeDimensions(windowSize, selectedImageSize)?.width}px`,
        height: `${getSizeDimensions(windowSize, selectedImageSize)?.height}px`,
      }}
      transition={{ duration: 0.1 }}
      ref={divRef}
      onClick={() => {
        setPreviousSize({
          width: getSizeDimensions(windowSize, selectedImageSize)?.width,
          height: getSizeDimensions(windowSize, selectedImageSize)?.height,
        });
      }}
    >
      {creationOrRegenIsLoading && (
        <div className=" flex  h-full w-full animate-pulse flex-col items-center justify-center rounded border border-gray-400 bg-gray-500">
          <Loader />
        </div>
      )}
      {isLoading === false && isSuccess && image && (
        <>
          <img src={image} className="h-full w-full object-cover" />
          <div className="absolute bottom-5 right-10 rounded bg-gray-900 p-2.5">
            <BsFullscreen
              size={20}
              onClick={onClick}
              className=" cursor-pointer text-white"
            />
          </div>
        </>
      )}
    </motion.div>
  );
};
export default ImageGeneratorOutputBox;
