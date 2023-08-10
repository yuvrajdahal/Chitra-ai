import React, { FC, useRef, useState } from "react";
import { toast } from "react-hot-toast";

import { api } from "@/utils/api";

import { Size } from "./dto";

import ImageGeneratorInput from "./ImageGeneratorInput";
import ImageGeneratorTags from "./ImageGeneratorTags";
import ImageGeneratorOutputBox from "./ImageGeneratorOutputBox";
import ImageAsFullScreen from "./ImageAsFullScreen";
import ImageGeneratorHeader from "./ImageGeneratorHeader";
import HelperButtons from "./HelperButtons";

import { getSizeDimensions } from "@/hooks/getDimension";
import useAuth from "@/hooks/user-state";
import useModalStore from "@/hooks/modal-state";
import useWindowSize from "@/hooks/useWindowSize";

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

  // Envokes creation of image from backend
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
  // Envokes regeneration of image from backend ( using a hack )
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
        <ImageGeneratorHeader />
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
        <HelperButtons
          authStatus={authStatus}
          envoleRegenerateImageProcess={envoleRegenerateImageProcess}
          isSuccess={hitApi.isSuccess}
          isLoading={hitRegenerateApi.isLoading}
        />
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
