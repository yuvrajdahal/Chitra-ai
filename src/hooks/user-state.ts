import { User } from "@prisma/client";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { create } from "zustand";

export type CustomUser =
  | {
      credit: number;
    }
  | Session["user"];
type UserType = {
  user:CustomUser
    
  setUser: (
    payload:
      | Session["user"]
      | {
          credit: number;
        }
  ) => void;
};

export const useUserState = create<UserType>((set) => ({
  user: {
    credit: 0,
  },
  setUser: (payload) =>
    set(() => ({
      user: payload,
    })),
}));
function useAuth() {
  const { status: authStatus, data, ...rest } = useSession();
  const { user, setUser } = useUserState((state) => state);
  useEffect(() => {
    if (authStatus === "authenticated") {
      setUser({ ...data.user });
    }
    if (authStatus === "unauthenticated") {
      setUser({
        credit: 0,
      });
    }
    if (authStatus === "loading") {
      setUser({
        credit: 0,
      });
    }
  }, [authStatus]);
  return { authStatus, setUser, user, ...rest };
}
export default useAuth;
