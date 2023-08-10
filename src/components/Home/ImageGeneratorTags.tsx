import { WindowSize } from "@/hooks/useWindowSize";
import { Size, imageSize } from "./dto";
import joinClassNames from "@/utils/className";
import { getSizeDimensions } from "@/hooks/getDimension";
import Tag from "../Tags/Tag";

const ImageGeneratorTags = ({
  authStatus,
  windowSize,
  selectedImageSize,
  setImageSize,
  divRef,
  setPreviousSize,
  setImage,
}: {
  authStatus: "authenticated" | "unauthenticated" | "loading";
  selectedImageSize: Size;
  windowSize: WindowSize;
  setImageSize: React.Dispatch<React.SetStateAction<Size>>;
  setPreviousSize: React.Dispatch<
    React.SetStateAction<{
      height: number;
      width: number;
    }>
  >;
  divRef: React.RefObject<HTMLDivElement>;
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  return (
    <div
      className={joinClassNames(
        " flex gap-4 md:mt-4",
        authStatus === "unauthenticated" ? "mt-28" : "mt-8"
      )}
    >
      {Object.entries(imageSize).map(([key, value]) => {
        return (
          <Tag
            key={value}
            active={value === selectedImageSize}
            onClick={() => {
              setPreviousSize({
                width: getSizeDimensions(windowSize, selectedImageSize).width,
                height: getSizeDimensions(windowSize, selectedImageSize).height,
              });
              setImageSize(value);
              setImage(null);
              if (divRef.current) {
                divRef.current.scrollIntoView({
                  behavior: "smooth",
                  block: "end",
                  inline: "end",
                });
              }
            }}
          >
            <div className="jutsify-center flex items-center gap-1">
              <div className="text-white">{value}</div>
            </div>
          </Tag>
        );
      })}
    </div>
  );
};
export default ImageGeneratorTags;
