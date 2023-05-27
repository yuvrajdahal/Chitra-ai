import joinClassNames from "@/utils/className";
import React, { ReactNode, ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  buttonType?: "primary" | "secondary" | "error";
  className?: string | string[];
};

function Button({
  children,
  buttonType = "primary",
  className,
  ...props
}: ButtonProps) {
  const baseClassName = () => {
    switch (buttonType) {
      case "primary":
        return "bg-amber-600 hover:bg-amber-700";
      case "secondary":
        return "bg-gray-600 hover:bg-gray-700";
      case "error":
        return "bg-red-600 hover:bg-red-700";

      default:
        return "bg-amber-600 hover:bg-amber-700";
    }
  };
  return (
    <button
      {...props}
      className={joinClassNames(
        "transition duration-300 focus:outline focus:outline-stone-700 focus:ring focus:ring-stone-700",
        "text-sm md:text-lg",
        baseClassName(),
        className
      )}
    >
      {children}
    </button>
  );
}

export default Button;
