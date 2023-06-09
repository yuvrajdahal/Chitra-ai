import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import { api } from "@/utils/api";
import Hero from "@/components/Home/Hero";

const Home: NextPage = () => {
  return <Hero />;
};

export default Home;
