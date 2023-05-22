import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import PageLayout from "@/components/Layouts/PageLayout";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <PageLayout>
      <Component {...pageProps} />
      <div className="modal-root"></div>
    </PageLayout>
  );
};

export default api.withTRPC(MyApp);
