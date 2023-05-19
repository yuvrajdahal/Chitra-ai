import joinClassNames from "@/utils/className";
import React, { ReactNode } from "react";
import Navbar from "./Navbar";
type TLayout = {
  children: ReactNode;
};
function PageLayout({ children }: TLayout) {
  return (
    <div
      className={
        "min-h-screen w-full overflow-hidden overflow-y-scroll bg-gray-900 "
      }
    >
      <Navbar />
      {children}
    </div>
  );
}

export default PageLayout;
