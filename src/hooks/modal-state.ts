import { create } from "zustand";

type ModalState = {
  isSignupModalOpen: boolean;
  isLoginModalOpen: boolean;
  isCreditBuyModal: boolean;
  setIsSignupModalOpen: () => void;
  setIsCreditBuyModal: () => void;
  setIsLoginModalOpen: () => void;
};

const useModalStore = create<ModalState>((set) => ({
  isLoginModalOpen: false,
  isSignupModalOpen: false,
  isCreditBuyModal: false,
  setIsCreditBuyModal: () =>
    set((state) => ({ isCreditBuyModal: !state.isCreditBuyModal })),
  setIsSignupModalOpen: () =>
    set((state) => ({ isSignupModalOpen: !state.isSignupModalOpen })),
  setIsLoginModalOpen: () =>
    set((state) => ({ isLoginModalOpen: !state.isLoginModalOpen })),
}));
export default useModalStore;
