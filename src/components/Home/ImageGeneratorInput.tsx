import Button from "../Buttons/Button";
import Input from "../Inputs/Input";
import Loader from "../Loader/loader";
import AbsoluteGuide from "./AbsoulteGuide";

const ImageGeneratorInput = ({
  authStatus,
  onChange,
  envokeImageCreationProcess,
  userPrompt,
  isLoading,
  setIsSignupModalOpen,
}: {
  authStatus: "authenticated" | "unauthenticated" | "loading";
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  envokeImageCreationProcess: () => void;
  userPrompt: string;
  isLoading: boolean;
  setIsSignupModalOpen: () => void;
}) => {
  return (
    <div className="flex-reverse-col relative mt-8 flex gap-4  md:flex-row">
      <div className="flex items-center gap-4">
        <Input
          value={userPrompt}
          className="w-full py-2 md:w-[400px]"
          placeholder="Generate a Nepalese developing a site"
          onChange={onChange}
        />
        {authStatus === "authenticated" && (
          <Button
            buttonType="primary"
            className="rounded px-4 py-2 text-white"
            onClick={envokeImageCreationProcess}
          >
            {isLoading ? <Loader ringLayerColor="fill-amber-700" /> : "Create"}
          </Button>
        )}
        {authStatus === "loading" && (
          <Button buttonType="primary" className="rounded px-4 py-2 text-white">
            <Loader ringLayerColor="fill-amber-700" />
          </Button>
        )}
        {authStatus === "unauthenticated" && (
          <Button
            className={"rounded px-4 py-2 text-white"}
            buttonType="primary"
            onClick={setIsSignupModalOpen}
          >
            Signup
          </Button>
        )}
      </div>
      {authStatus === "unauthenticated" && (
        <AbsoluteGuide className="absolute -right-0 top-12 md:-right-28 md:top-0 " />
      )}
    </div>
  );
};
export default ImageGeneratorInput;
