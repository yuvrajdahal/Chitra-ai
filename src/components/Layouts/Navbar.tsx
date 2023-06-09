import React, { FC, useState } from "react";
import Button from "../Buttons/Button";
import SignupModal from "@/components/Modals/SignupModal";
import LoginModal from "@/components/Modals/LoginModal";
import { signOut, useSession } from "next-auth/react";
import NavLink from "next/link";
import useModalStore from "@/hooks/modal-state";
import Loader from "../Loader/loader";
import useAuth from "@/hooks/user-state";

const Navbar: FC<{ credit?: number }> = () => {
  const { authStatus, user } = useAuth();

  const { setIsSignupModalOpen } = useModalStore();
  const { setIsLoginModalOpen } = useModalStore();

  return (
    <>
      <div className="h-[70px] border-b border-gray-600">
        <div className="container mx-auto flex h-full w-full items-center justify-between  gap-10 px-4">
          <NavLink href="/">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-white">Chitra</div>
              <Button
                buttonType="primary"
                className={"rounded px-2 text-white"}
              >
                Ai
              </Button>
            </div>
          </NavLink>
          <div className="hidden items-center justify-center gap-10 md:flex">
            <div className="cursor-pointer text-white">Faq</div>
            <div className="cursor-pointer text-white">Contact</div>
            <div className="cursor-pointer text-white">Pricing</div>

            {authStatus !== "loading" && (
              <div className="relative top-0.5 cursor-pointer text-lg font-bold text-amber-600">
                {user?.credit}
              </div>
            )}
            {authStatus === "loading" && (
              <div className="">
                <Loader ringLayerColor="fill-amber-700" />
              </div>
            )}
            {authStatus === "unauthenticated" && (
              <div className="flex items-center gap-8">
                <Button
                  buttonType={"secondary"}
                  className={"rounded px-8 py-2 text-white"}
                  onClick={setIsLoginModalOpen}
                >
                  Login
                </Button>

                <Button
                  buttonType={"primary"}
                  onClick={setIsSignupModalOpen}
                  className={"rounded px-8 py-2 text-white"}
                >
                  Signup
                </Button>
              </div>
            )}
            {authStatus === "authenticated" && (
              <div className="flex items-center gap-8">
                <Button
                  buttonType={"error"}
                  onClick={() =>
                    signOut({
                      redirect: true,
                    })
                  }
                  className={"rounded px-8 py-2 text-white"}
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
