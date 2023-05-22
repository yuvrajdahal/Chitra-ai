import React, { FC, useState } from "react";
import Button from "../Buttons/Button";
import SignupModal from "@/components/Modals/SignupModal";
const Navbar: FC<{ credit?: number }> = ({ credit = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <div className="h-[70px] border-b border-gray-600">
        <div className="container mx-auto flex h-full w-full items-center justify-between  gap-10 px-4">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-semibold text-white">Chitra</div>
            <Button buttonType="primary" className={"rounded px-2 text-white"}>
              Ai
            </Button>
          </div>
          <div className="hidden items-center gap-10 md:flex">
            <div className="cursor-pointer text-white">Faq</div>
            <div className="cursor-pointer text-white">Contact</div>
            <div className="cursor-pointer text-white">Search</div>
            <div className="cursor-pointer text-white">Pricing</div>
            <div className="flex items-center gap-8">
              <Button
                buttonType={"secondary"}
                className={"rounded px-8 py-2 text-white"}
              >
                Login
              </Button>

              <Button
                buttonType={"primary"}
                onClick={() => setIsOpen((prev) => !prev)}
                className={"rounded px-8 py-2 text-white"}
              >
                Signup
              </Button>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <SignupModal isOpen onClose={() => setIsOpen((prev) => !prev)} />
      )}
    </>
  );
};

export default Navbar;
