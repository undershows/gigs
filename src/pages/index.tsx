import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { Card } from "../components/card";
import { Show } from "../classes/show";
import getShows from "../utils/getShows";
import Layout from "../components/layout";
import { ReactElement } from "react";
import Logo from "../components/logo";
import createShowUri from "../utils/createShowUri";

export default function Home({ shows }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>undershows</title>
        <link rel="icon" href={`${process.env.BASE_PATH}/favicon.ico`} />
      </Head>

      <body className="flex flex-col justify-center content-center items-center px-20 w-full h-full">
        <h1>
          <Logo />
        </h1>

        <p className="mt-3 text-2xl">O underground respira.</p>

        <div className="flex flex-wrap justify-center self-center mt-6 w-full">
          {shows.map((show: Show) => (
            <Card
              key={createShowUri(show)}
              name={show.name}
              date={show.date}
              bands={show.bands}
              schedule={show.schedule}
              img={show.img}
            ></Card>
          ))}
        </div>
      </body>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      shows: getShows(),
    },
  };
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout navbarProps={{ hiddenByDefault: true }}>{page}</Layout>;
};
