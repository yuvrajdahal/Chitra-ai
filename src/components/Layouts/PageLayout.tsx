import SignupModal from "@/components/Modals/SignupModal";
import joinClassNames from "@/utils/className";
import React, { ReactNode, Suspense } from "react";
import Navbar from "./Navbar";
import useModalStore from "@/hooks/modal-state";
import LoginModal from "../Modals/LoginModal";
import ErrorBoundary from "../Boundary/ErrorBoundary";
import { Toaster } from "react-hot-toast";
type TLayout = {
  children: ReactNode;
};
function PageLayout({ children }: TLayout) {
  const { isSignupModalOpen, setIsSignupModalOpen } = useModalStore();
  const { isLoginModalOpen, setIsLoginModalOpen } = useModalStore();

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
