import type { GetStaticPropsResult, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Card } from "../components/card";
import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import { Gig } from "../types/gig";

export const Home: NextPage<{ name: string; date: Date }> = ({ name, date }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="font-newake text-6xl font-bold tracking-wider">
          <span className="underline underline-offset-2 ">UNDER</span>
          <span>SHOWS</span>
        </h1>

        <p className="mt-3 text-2xl">
          Get started by editing <code className="font-mono rounded-md bg-gray-100 p-3 text-lg">pages/index.tsx</code>
        </p>

        <div className="mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full">
          <Card name={name} date={date}></Card>
        </div>
      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2"
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </a>
      </footer>
    </div>
  );
};

export function getStaticProps(): GetStaticPropsResult<Gig> {
  const res = yaml.load(fs.readFileSync(path.join(process.cwd(), "src/gigs/gigs.yaml"), "utf-8")) as Gig;

  return {
    props: res,
  };
}

export default Home;
