import Button from "../Buttons/Button";
import Loader from "../Loader/loader";

const HelperButtons = ({
  authStatus,
  envoleRegenerateImageProcess,
  isSuccess,
  isLoading,
}: {
  authStatus: "authenticated" | "unauthenticated" | "loading";
  envoleRegenerateImageProcess: () => void;
  isSuccess: boolean;
  isLoading: boolean;
}) => {
  return (
    <>
      {authStatus === "authenticated" && (
        <div className="mb-8 flex gap-4">
          <Button
            onClick={envoleRegenerateImageProcess}
            className={
              "rounded px-4 py-2 text-white disabled:bg-gray-600 disabled:text-gray-400"
            }
            buttonType="secondary"
            disabled={!isSuccess}
          >
            {isLoading ? <Loader /> : "Re-Generate"}
          </Button>
          <Button
            className={"rounded px-4 py-2 text-white"}
            buttonType="primary"
          >
            Buy Credits
          </Button>
        </div>
      )}
    </>
  );
};
export default HelperButtons;
