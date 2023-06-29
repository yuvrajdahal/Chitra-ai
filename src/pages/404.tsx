import Button from "@/components/Buttons/Button";
import React, { ErrorInfo } from "react";
import { Toaster, toast } from "react-hot-toast";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { MdArrowBack } from "react-icons/md";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <AiOutlineExclamationCircle className="mb-4 text-6xl text-amber-600" />
      <h2 className="mb-4 text-2xl font-semibold text-amber-600">
        Oops, there was an error!
      </h2>
      <div className="mb-4 text-center text-white">
        Something went wrong while loading the page. Please try again.
      </div>
      <Button
        buttonType="primary"
        className="flex items-center rounded px-4 py-2 text-white"
        onClick={handleGoBack}
      >
        <MdArrowBack className="mr-2 text-xl" />
        Go Back
      </Button>
      <Toaster position="top-right" /> {/* Initialize the toast container */}
    </div>
  );
}
