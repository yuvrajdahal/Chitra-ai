import React, { ErrorInfo } from "react";
import { Toaster, toast } from "react-hot-toast";
import { AiOutlineExclamationCircle, AiOutlineReload } from "react-icons/ai";
import Button from "../Buttons/Button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary:", error, errorInfo);
    toast.error("Oops! Something went wrong.");
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8">
          <AiOutlineExclamationCircle className="mb-4 text-6xl text-amber-600" />
          <h2 className="mb-4 text-2xl font-semibold text-amber-600">
            Oops, there was an error!
          </h2>
          <div className="mb-4 text-center text-white">
            Something went wrong while loading the page. Please try again.
          </div>
          <Button
            buttonType="primary"
            className="flex items-center rounded px-4 py-2 text-white"
            onClick={() => this.setState({ hasError: false })}
          >
            <AiOutlineReload className="mr-2 text-xl" />
            Try Again
          </Button>
          <Toaster position="top-right" />{" "}
          {/* Initialize the toast container */}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
