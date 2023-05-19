import React, { FC, HTMLAttributes, useState } from "react";
import Button from "../Buttons/Button";
import Input from "../Inputs/Input";
import Tag from "../Tags/Tag";
import { NextApiRequest, NextApiResponse } from "next";
import { api } from "@/utils/api";
import Loader from "../Loader/loader";

interface TSize {
  256: "256x256";
  512: "512x512";
  1024: "1024x1024";
}
const imageSize: TSize = {
  1024: "1024x1024",
  256: "256x256",
  512: "512x512",
};
enum Size {
  S256 = "256x256",
  S512 = "512x512",
  S1024 = "1024x1024",
}

const Hero: FC = () => {
  const [selectedImageSize, setImageSize] = useState<Size>(Size.S512);
  const [userPrompt, setPrompt] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);
  const hitApi = api.stableDiffusion.textToImage.useMutation();
  const hitRegenerateApi = api.stableDiffusion.regenerate.useMutation();
  const [image, setImage] = useState("");
  async function envokeImageCreationProcess() {
    if (userPrompt === "") {
      alert("Enter prompt");
      return;
    }
    if (userPrompt === "") {
      alert("Enter prompt");
      return;
    }
    await hitApi.mutateAsync(
      {
        text: userPrompt,
        size: selectedImageSize,
      },
      {
        onSuccess: (res) => {
          if (res.data) setImage(res.data);
        },
      }
    );
  }
  async function envoleRegenerateImageProcess() {
    setImage("");
    if (userPrompt === "") {
      alert("Enter prompt");
      return;
    }
    if (userPrompt === "") {
      alert("Enter prompt");
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
      }
    );
  }
  const ifCreationOrRegenIsLoading = hitApi.isLoading
    ? true
    : hitRegenerateApi.isLoading
    ? true
    : false;
  return (
    <section className="container mx-auto flex flex-col  items-center justify-center justify-center px-4 pt-32">
      <div className="flex items-center gap-4">
        <div className="text-4xl font-semibold text-white">Chitra</div>
        <Button buttonType="primary" className={"rounded px-2 py-1 text-white"}>
          Ai
        </Button>
      </div>
      <p className="mt-4 text-lg text-gray-400">
        Free online AI image generator from text
      </p>
      <div className="flex-reverse-col relative mt-8 flex gap-4  md:flex-row">
        <div className="flex items-center gap-4">
          <Input
            value={userPrompt}
            className="w-full py-2 md:w-[400px]"
            placeholder="Generate a Nepalese developing a site"
            onChange={(e) => setPrompt(e.target.value)}
          />
          <Button
            buttonType="primary"
            className="rounded px-4 py-2 text-white"
            onClick={envokeImageCreationProcess}
          >
            {hitApi.isLoading ? (
              <Loader ringLayerColor="fill-amber-700" />
            ) : (
              "Create"
            )}
          </Button>
        </div>
        <AbsoluteGuide className="absolute -right-0 top-12 md:-right-28 md:top-0 " />
      </div>
      <div className="mt-28 flex gap-4 md:mt-4">
        {Object.entries(imageSize).map(([key, value]) => {
          return (
            <Tag key={key} onClick={() => setImageSize(value)}>
              <div className="jutsify-center flex items-center gap-1">
                <div className="text-white">{value}</div>
              </div>
            </Tag>
          );
        })}
      </div>
      <div className="my-8 h-[500px] w-full overflow-hidden rounded border border-gray-400 bg-gray-600 text-white md:max-w-xl">
        {ifCreationOrRegenIsLoading && (
          <div className=" flex  h-full w-full animate-pulse flex-col items-center justify-center rounded border border-gray-400 bg-gray-500">
            <Loader />
          </div>
        )}
        {hitApi.isLoading === false && hitApi.isSuccess && (
          <img src={image} className="h-full w-full" />
        )}
      </div>
      <div className="mb-8 flex gap-4">
        <Button className={"rounded px-4 py-2 text-white"} buttonType="primary">
          Buy This Image
        </Button>
        <Button
          onClick={envoleRegenerateImageProcess}
          className={"rounded px-4 py-2 text-white"}
          buttonType="secondary"
        >
          {hitRegenerateApi.isLoading ? <Loader /> : "Re-Generate"}
        </Button>
      </div>
    </section>
  );
};

export default Hero;
const AbsoluteGuide: FC<HTMLAttributes<HTMLDivElement>> = ({ ...props }) => {
  return (
    <div {...props}>
      <svg
        width="47"
        height="57"
        className="rotate-[90deg] md:rotate-0"
        viewBox="0 0 47 57"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.97816 19.5295C0.166064 20.6461 0.412939 22.2097 1.52957 23.0218L19.7261 36.2556C20.8428 37.0677 22.4063 36.8209 23.2184 35.7042C24.0305 34.5876 23.7836 33.0241 22.667 32.212L6.49227 20.4485L18.2557 4.2738C19.0678 3.15717 18.8209 1.59363 17.7043 0.781535C16.5877 -0.0305602 15.0241 0.216315 14.212 1.33295L0.97816 19.5295ZM3.38991 23.4693C9.6694 22.4778 19.168 21.2922 27.2564 20.9477C31.3181 20.7747 34.9071 20.8196 37.5231 21.1714C38.8427 21.3488 39.7733 21.5869 40.3542 21.8366C41.0043 22.116 40.7672 22.2071 40.6283 21.7905L45.3717 20.2094C44.8328 18.5928 43.4415 17.7213 42.3287 17.243C41.1465 16.7348 39.7052 16.4198 38.1894 16.216C35.1346 15.8052 31.1986 15.7752 27.0436 15.9522C18.6986 16.3077 8.99726 17.522 2.61009 18.5305L3.38991 23.4693ZM40.6283 21.7905C40.9037 22.6168 41.1429 24.4683 41.2714 27.2497C41.3951 29.9266 41.4083 33.1871 41.3504 36.633C41.2346 43.5199 40.8372 51.0249 40.5059 55.828L45.4941 56.172C45.8295 51.3084 46.2321 43.7133 46.3496 36.717C46.4084 33.2212 46.3966 29.8441 46.2661 27.019C46.1404 24.2982 45.8963 21.783 45.3717 20.2094L40.6283 21.7905Z"
          fill="#4B5563"
        />
      </svg>
      <div className="text-white">Get Started</div>
    </div>
  );
};
