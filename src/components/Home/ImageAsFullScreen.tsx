import { AnimatePresence, motion } from "framer-motion";
import { IoMdArrowRoundBack } from "react-icons/io";

const ImageAsFullScreen = ({
  selectedImage,
  image,
  setSelectedImage,
}: {
  selectedImage: string;
  image: string;
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <AnimatePresence>
      {selectedImage.length !== 0 && image && (
        <motion.div
          key={selectedImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 z-[100] flex h-screen w-screen items-center justify-center bg-gray-900"
        >
          <div className="absolute right-10 top-10">
            <IoMdArrowRoundBack
              size={30}
              className="cursor-pointer text-white"
              onClick={() => setSelectedImage("")}
            />
          </div>
          <img src={image} className="object-contain" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default ImageAsFullScreen;
