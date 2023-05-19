import joinClassNames from "@/utils/className";
import React, { FC, InputHTMLAttributes } from "react";

const Input: FC<InputHTMLAttributes<HTMLInputElement>> = ({
  className,
  ...props
}) => {
  return (
    <input
      type="text"
      {...props}
      className={joinClassNames(
        "bg-gray-600 outline-none transition duration-300 focus:ring-1 focus:ring-amber-700",
        "rounded",
        "text-gray-400 placeholder:text-gray-400",
        "px-4",
        className
      )}
    />
  );
};

export default Input;
