import { type NextPage } from "next";
import Hero from "@/components/Home/Hero";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Chitra Ai</title>
      </Head>
      <Hero />
    </>
  );
};

export default Home;
