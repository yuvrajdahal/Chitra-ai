import { type NextPage } from "next";
import Head from "next/head";
import Hero from "@/components/Home/Hero";
import Script from "next/script";
import { useEffect } from "react";
import AdBanner from "@/components/Ad/AdBanner";

const Home: NextPage = () => {
  return (
    <>
      <Hero />
    </>
  );
};

export default Home;
