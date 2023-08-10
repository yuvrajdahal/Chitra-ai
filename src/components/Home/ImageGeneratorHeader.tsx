import Button from "../Buttons/Button";

const ImageGeneratorHeader = () => {
  return (
    <>
      <div className="flex items-center gap-4">
        <div className="text-4xl font-semibold text-white">Chitra</div>
        <Button buttonType="primary" className={"rounded px-2 py-1 text-white"}>
          Ai
        </Button>
      </div>
      <div className="mt-4 text-lg text-gray-400">
        Free online AI image generator from text
      </div>
    </>
  );
};
export default ImageGeneratorHeader;
