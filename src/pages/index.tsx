import { type NextPage } from "next";
import Head from "next/head";
import Hero from "@/components/Home/Hero";
import Script from "next/script";
import { useEffect } from "react";
import AdBanner from "@/components/Ad/AdBanner";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1959896930486958"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
          onError={(e) => {
            console.error("Script failed to load", e);
          }}
        />
      </Head>
      <AdBanner />
      <Hero />
    </>
  );
};

export default Home;
