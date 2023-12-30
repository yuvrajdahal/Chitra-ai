import { FormEventHandler, useCallback, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import Button from "../Buttons/Button";
import Input from "../Inputs/Input";
import { env } from "@/env.mjs";
import { Router, useRouter } from "next/router";
import { api } from "@/utils/api";
import { toast } from "react-hot-toast";
import Loader from "../Loader/loader";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const LoginModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setLoading] = useState<boolean>(false);

  const handleSignup: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/",
    });
    setLoading(false);
    if (result?.error) {
      toast.error("Something went wrong.", {
        style: {
          backgroundColor: "#4b5563",
          color: "#ffffff",
        },
      });
    }
    onClose();
  };

  if (!isOpen) return <></>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 ">
      <div className="flex max-w-2xl flex-col rounded-lg bg-white p-8">
        <h2 className="mb-4 text-2xl font-bold">Login</h2>
        <form onSubmit={handleSignup} className="flex flex-col justify-end">
          <div className="my-4 flex flex-col gap-4">
            <div>
              <Input
                type="email"
                className="rounded-lg border bg-transparent px-4 py-2"
                placeholder="user@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <Input
                type="password"
                className="rounded-lg border bg-transparent px-4 py-2"
                placeholder="*********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-start gap-4">
            <Button
              className={"rounded px-8 py-2 text-white"}
              buttonType="secondary"
              onClick={onClose}
            >
              Close
            </Button>
            <Button className={"rounded px-8 py-2 text-white"} type="submit">
              {isLoading ? <Loader ringLayerColor="fill-amber-700" /> : "Login"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
