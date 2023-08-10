import React, { FC, HTMLAttributes, useRef, useState } from "react";
import Button from "../Buttons/Button";

import { api } from "@/utils/api";
import Loader from "../Loader/loader";
import { AnimatePresence, motion } from "framer-motion";
import useAuth from "@/hooks/user-state";
import useModalStore from "@/hooks/modal-state";
import { toast } from "react-hot-toast";
import useWindowSize, { WindowSize } from "@/hooks/useWindowSize";
import joinClassNames from "@/utils/className";

import { IoMdArrowRoundBack } from "react-icons/io";
import { BsFullscreen } from "react-icons/bs";
import { Size, imageSize } from "./dto";
import ImageGeneratorInput from "./ImageGeneratorInput";
import { getSizeDimensions } from "@/hooks/getDimension";
import ImageGeneratorTags from "./ImageGeneratorTags";
import ImageGeneratorOutputBox from "./ImageGeneratorOutputBox";
import ImageAsFullScreen from "./ImageAsFullScreen";

const Hero: FC = () => {
  const [selectedImageSize, setImageSize] = useState<Size>(Size.S512);
  const [userPrompt, setPrompt] = useState<string>("");
  const [image, setImage] = useState<string | null>("");
  const windowSize = useWindowSize();

  const [previousSize, setPreviousSize] = useState({
    ...getSizeDimensions(windowSize, selectedImageSize),
  });

  const hitApi = api.stableDiffusion.textToImage.useMutation();
  const hitRegenerateApi = api.stableDiffusion.regenerate.useMutation();

  const { authStatus, user, setUser } = useAuth();

  async function envokeImageCreationProcess() {
    if (userPrompt === "") {
      toast("Enter Prompt", {
        icon: "❗",
        style: {
          backgroundColor: "#4b5563",
          color: "#ffffff",
        },
      });
      return;
    }
    await hitApi.mutateAsync(
      {
        text: userPrompt,
        size: selectedImageSize,
      },
      {
        onSuccess: (res) => {
          if (!res) return;
          setUser({
            ...user,
            credit: res.credit,
          });
          if (res.data) setImage(res.data);
        },
        onError: (err) => {
          toast.error(err.message, {
            style: {
              backgroundColor: "#4b5563",
              color: "#ffffff",
            },
          });
        },
      }
    );
  }
  async function envoleRegenerateImageProcess() {
    setImage("");
    if (userPrompt === "") {
      toast("Enter Prompt", {
        icon: "❗",
        style: {
          backgroundColor: "#4b5563",
          color: "#ffffff",
        },
      });
      return;
    }

    await hitRegenerateApi.mutateAsync(
      {
        text: userPrompt,
        size: selectedImageSize,
      },
      {
        onSuccess: (res) => {
          setImage("");
          if (res.data) setImage(res.data);
        },
        onError: (err) => {
          toast.error(err.message, {
            style: {
              backgroundColor: "#4b5563",
              color: "#ffffff",
            },
          });
        },
      }
    );
  }

  const creationOrRegenIsLoading = hitApi.isLoading
    ? true
    : hitRegenerateApi.isLoading
    ? true
    : false;
  const { setIsSignupModalOpen } = useModalStore();

  const divRef = useRef<HTMLDivElement>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");

  // @ts-ignore
  function handleChanegImage(image) {
    setSelectedImage(image);
  }
  return (
    <>
      <section className="container mx-auto flex flex-col  items-center justify-center justify-center px-4 pb-4 pt-28">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-semibold text-white">Chitra</div>
          <Button
            buttonType="primary"
            className={"rounded px-2 py-1 text-white"}
          >
            Ai
          </Button>
        </div>
        <div className="mt-4 text-lg text-gray-400">
          Free online AI image generator from text
        </div>
        <ImageGeneratorInput
          setIsSignupModalOpen={setIsSignupModalOpen}
          isLoading={hitApi.isLoading}
          userPrompt={userPrompt}
          authStatus={authStatus}
          envokeImageCreationProcess={envokeImageCreationProcess}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <ImageGeneratorTags
          authStatus={authStatus}
          windowSize={windowSize}
          selectedImageSize={selectedImageSize}
          setImageSize={setImageSize}
          divRef={divRef}
          setPreviousSize={setPreviousSize}
          setImage={setImage}
        />
        <ImageGeneratorOutputBox
          isLoading={hitApi.isLoading}
          windowSize={windowSize}
          isSuccess={hitApi.isSuccess}
          image={image ?? ""}
          previousSize={previousSize}
          creationOrRegenIsLoading={creationOrRegenIsLoading}
          selectedImageSize={selectedImageSize}
          divRef={divRef}
          setPreviousSize={setPreviousSize}
          onClick={() => handleChanegImage(image)}
        />
        {authStatus === "authenticated" && (
          <div className="mb-8 flex gap-4">
            <Button
              onClick={envoleRegenerateImageProcess}
              className={
                "rounded px-4 py-2 text-white disabled:bg-gray-600 disabled:text-gray-400"
              }
              buttonType="secondary"
              disabled={!hitApi.isSuccess}
            >
              {hitRegenerateApi.isLoading ? <Loader /> : "Re-Generate"}
            </Button>
            <Button
              className={"rounded px-4 py-2 text-white"}
              buttonType="primary"
            >
              Buy Credits
            </Button>
          </div>
        )}
      </section>
      <ImageAsFullScreen
        selectedImage={selectedImage}
        image={image ?? ""}
        setSelectedImage={setSelectedImage}
      />
    </>
  );
};

export default Hero;
