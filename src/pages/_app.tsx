import type { Session } from "next-auth";
import { type AppType } from "next/app";
import { api } from "@/utils/api";

import "@/styles/globals.css";
import PageLayout from "@/components/Layouts/PageLayout";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { Router } from "next/router";

const MyApp: AppType<{ session: Session }> = ({ Component, pageProps }) => {
  return (
    <SessionProvider session={pageProps?.session}>
      <PageLayout>
        <Component {...pageProps} />
        <div className="modal-root"></div>
      </PageLayout>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
