import SignupModal from "@/components/Modals/SignupModal";
import joinClassNames from "@/utils/className";
import React, { ReactNode, Suspense, useEffect } from "react";
import Navbar from "./Navbar";
import useModalStore from "@/hooks/modal-state";
import LoginModal from "../Modals/LoginModal";
import ErrorBoundary from "../Boundary/ErrorBoundary";
import { Toaster, toast } from "react-hot-toast";
import { api } from "@/utils/api";
import useAuth from "@/hooks/user-state";
type TLayout = {
  children: ReactNode;
};
function PageLayout({ children }: TLayout) {
  const { isSignupModalOpen, setIsSignupModalOpen } = useModalStore();
  const { isLoginModalOpen, setIsLoginModalOpen } = useModalStore();
  const stableDiffusionApi = api.stableDiffusion.checkForCredit.useMutation();
  const { authStatus } = useAuth();

  useEffect(() => {
    if (authStatus === "loading" || authStatus === "unauthenticated") return;
    stableDiffusionApi.mutateAsync(
      {},
      {
        onSuccess: (res) => {
          if (!res) return;
          toast.success(res?.data, {
            style: {
              backgroundColor: "#4b5563",
              color: "#ffffff",
            },
          });
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
  }, [authStatus]);
  return (
    <div
      className={
        "min-h-screen w-full overflow-hidden overflow-y-scroll bg-gray-900 "
      }
    >
      <ErrorBoundary>
        <Navbar />
        {children}
        {isSignupModalOpen && (
          <SignupModal
            isOpen={isSignupModalOpen}
            onClose={setIsSignupModalOpen}
          />
        )}
        {isLoginModalOpen && (
          <LoginModal isOpen={isLoginModalOpen} onClose={setIsLoginModalOpen} />
        )}
      </ErrorBoundary>
      <Toaster position="top-right" reverseOrder={false} />{" "}
    </div>
  );
}

export default PageLayout;
