import React, { FC, useState } from "react";
import Button from "../Buttons/Button";
import SignupModal from "@/components/Modals/SignupModal";
import LoginModal from "@/components/Modals/LoginModal";
import { signOut, useSession } from "next-auth/react";
import NavLink from "next/link";
const Navbar: FC<{ credit?: number }> = () => {
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const { status: authStatus, data } = useSession();
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
          <div className="hidden items-center gap-10 md:flex">
            <div className="cursor-pointer text-white">Faq</div>
            <div className="cursor-pointer text-white">Contact</div>
            <div className="cursor-pointer text-white">Pricing</div>
            <div className="cursor-pointer font-bold text-amber-600">
              {data?.user?.credit}
            </div>
            {authStatus === "unauthenticated" && (
              <div className="flex items-center gap-8">
                <Button
                  buttonType={"secondary"}
                  className={"rounded px-8 py-2 text-white"}
                  onClick={() => setIsLoginModalOpen((prev) => !prev)}
                >
                  Login
                </Button>

                <Button
                  buttonType={"primary"}
                  onClick={() => setIsSignupModalOpen((prev) => !prev)}
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
      {isSignupModalOpen && (
        <SignupModal
          isOpen={isSignupModalOpen}
          onClose={() => setIsSignupModalOpen((prev) => !prev)}
        />
      )}
      {isLoginModalOpen && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen((prev) => !prev)}
        />
      )}
    </>
  );
};

export default Navbar;
