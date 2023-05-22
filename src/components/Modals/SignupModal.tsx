import { useState } from "react";
import { createPortal } from "react-dom";
import { signIn } from "next-auth/react";
import Button from "../Buttons/Button";
import Input from "../Inputs/Input";
type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    ("use server");
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    console.log("DONE");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 ">
      <div className="flex max-w-2xl flex-col rounded-lg bg-white p-8">
        <h2 className="mb-4 text-2xl font-bold">Signup</h2>
        <div className="flex flex-col justify-end">
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
          <div className="flex justify-end gap-4">
            <Button
              className={"rounded px-8 py-2 text-white"}
              buttonType="secondary"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              className={"rounded px-8 py-2 text-white"}
              onClick={handleSignup}
            >
              Signup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
