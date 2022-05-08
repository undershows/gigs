import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { Card } from "../components/card";
import { Show } from "../classes/show";
import getShows from "../utils/getShows";

export default function Home({ shows }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>undershows</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="font-newake text-6xl font-bold tracking-wider ">
          <span className="underline underline-offset-4 ">UNDER</span>
          <span className="bg-black bg-clip-padding pl-1 pt-2 pr-1 text-white">SHOWS</span>
        </h1>

        <p className="mt-3 text-2xl">O underground respira.</p>

        <div className="mt-6 flex max-w-4xl flex-wrap items-center justify-around sm:w-full">
          {shows.map((show: Show) => (
            <Card
              key={show.name}
              name={show.name}
              date={show.date}
              bands={show.bands}
              schedule={show.schedule}
              img={show.img}
            ></Card>
          ))}
        </div>
      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          className="flex items-center justify-center gap-2"
          href="https://github.com/undershows/gigs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Colabore você também.
        </a>
      </footer>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      shows: await getShows(),
    },
  };
};
