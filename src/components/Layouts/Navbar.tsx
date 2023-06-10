import React, { FC, useState } from "react";
import Button from "../Buttons/Button";
import SignupModal from "@/components/Modals/SignupModal";
import LoginModal from "@/components/Modals/LoginModal";
import { signOut, useSession } from "next-auth/react";
import NavLink from "next/link";
import useModalStore from "@/hooks/modal-state";
import Loader from "../Loader/loader";
import useAuth, { CustomUser } from "@/hooks/user-state";
import { motion } from "framer-motion";

const Navbar: FC = () => {
  const { authStatus, user } = useAuth();

  const { setIsSignupModalOpen, setIsLoginModalOpen } = useModalStore();

  return (
    <>
      <div className="border-b border-gray-600 py-4">
        <div className="container relative mx-auto  flex w-full items-center justify-between gap-10 px-4 px-4">
          <NavLink href="/">
            <div className="flex items-center gap-2">
              <div className="text-2xl font-semibold text-white">Chitra</div>
              <Button
                buttonType="primary"
                className={"rounded px-2 py-1 text-white"}
              >
                Ai
              </Button>
            </div>
          </NavLink>
          <div className="flex items-center justify-center gap-8">
            <LinksForDesktop
              authStatus={authStatus}
              setIsLoginModalOpen={setIsLoginModalOpen}
              user={user}
              setIsSignupModalOpen={setIsSignupModalOpen}
            />

            <LinksForMobile
              authStatus={authStatus}
              setIsLoginModalOpen={setIsLoginModalOpen}
              user={user}
              setIsSignupModalOpen={setIsSignupModalOpen}
            />
          </div>
        </div>
      </div>
    </>
  );
};
const LinksForDesktop: FC<{
  authStatus: "loading" | "unauthenticated" | "authenticated";
  user: CustomUser;
  setIsLoginModalOpen: () => void;
  setIsSignupModalOpen: () => void;
}> = ({ authStatus, user, setIsLoginModalOpen, setIsSignupModalOpen }) => {
  return (
    <div className="hidden items-center justify-center gap-10 md:flex">
      <div className="cursor-pointer text-white">Faq</div>
      <div className="cursor-pointer text-white">Contact</div>
      <div className="cursor-pointer text-white">Pricing</div>

      {authStatus === "loading" && (
        <div className="">
          <Loader ringLayerColor="fill-amber-700" />
        </div>
      )}
      {authStatus !== "loading" && (
        <div className="relative top-0.5 cursor-pointer text-lg font-bold text-amber-600">
          {user?.credit}
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
  );
};
const LinksForMobile: FC<{
  authStatus: "loading" | "unauthenticated" | "authenticated";
  user: CustomUser;
  setIsLoginModalOpen: () => void;
  setIsSignupModalOpen: () => void;
}> = ({ authStatus, user, setIsLoginModalOpen, setIsSignupModalOpen }) => {
  const [isMobileNavModalOpen, setNavModalOpen] = useState<boolean>(false);
  return (
    <div className="relative block md:hidden">
      <div className="justfiy-center flex items-center gap-4">
        {authStatus !== "loading" && (
          <div className="flex items-center justify-center gap-4">
            <div className="flex gap-2 whitespace-nowrap text-white">
              Credit{" "}
              <motion.span
                initial={{
                  x: 0,
                }}
                animate={{
                  x: 4,
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "mirror",
                  duration: 0.6,
                  ease: "easeIn",
                }}
              >
                -&gt;
              </motion.span>
            </div>
            <div className="relative top-0.5 cursor-pointer text-lg font-bold text-amber-600">
              {user?.credit}
            </div>
          </div>
        )}

        <Button
          buttonType={"secondary"}
          className={"block w-full rounded px-4 py-2 text-white"}
          onClick={() => setNavModalOpen((prev) => !prev)}
        >
          #
        </Button>
      </div>
      {isMobileNavModalOpen === true && (
        <div className="absolute right-0">
          <div className="z-50  mt-4 w-64 list-none divide-y divide-gray-100 rounded-lg bg-white  text-base shadow dark:bg-gray-700">
            <div className="py-2 font-medium">
              <div className="block px-4  py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                Faq
              </div>
              <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                Contact
              </div>
              <div className="block px-4  py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">
                Pricing
              </div>

              {authStatus === "loading" && (
                <div className="mt-2">
                  <Loader ringLayerColor="fill-amber-700" />
                </div>
              )}
              {authStatus === "unauthenticated" && (
                <div className="mx-4 mt-2">
                  <Button
                    buttonType={"secondary"}
                    className={" block w-full rounded px-8 py-2 text-white"}
                    onClick={setIsLoginModalOpen}
                  >
                    Login
                  </Button>

                  <Button
                    buttonType={"primary"}
                    onClick={setIsSignupModalOpen}
                    className={"mt-2 block w-full rounded px-8 py-2 text-white"}
                  >
                    Signup
                  </Button>
                </div>
              )}
              {authStatus === "authenticated" && (
                <div className="mx-4 flex items-center gap-8">
                  <Button
                    buttonType={"error"}
                    onClick={() =>
                      signOut({
                        redirect: true,
                      })
                    }
                    className={"mt-2 w-full rounded px-8 py-2 text-white"}
                  >
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Navbar;
