import joinClassNames from "@/utils/className";
import React, { ButtonHTMLAttributes, FC, ReactNode } from "react";

type TagProp = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  active?: boolean;
};
const Tag: FC<TagProp> = ({
  children,
  active = false,
  className,
  ...props
}) => {
  return (
    <button
      className={joinClassNames(
        "rounded bg-gray-600 px-1.5 py-1 transition duration-300 focus:ring focus:ring-sky-500 ",
        "focus:outline focus:outline-sky-500 ",
        className,
        active ? "ring ring-sky-500 " : ""
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Tag;
