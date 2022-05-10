import type { GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { HomeCard } from "../components/homeCard";
import { Show } from "../classes/show";
import getShows from "../utils/getShows";
import Layout from "../components/layout";
import { ReactElement } from "react";
import Logo from "../components/logo";
import createShowUri from "../utils/createShowUri";
import HomeCarousel from "../components/carousel";

export default function Home({ shows }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>undershows</title>
        <link
          rel="icon"
          href={`${process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : ""}/favicon.ico`}
        />
      </Head>

      <div className="flex flex-col justify-center content-center items-center px-20 w-full h-full">
        <h1 className="mt-8">
          <Logo />
        </h1>

        <p className="mt-3 text-2xl">O underground respira.</p>

        <div className="flex my-6 w-full h-full">
          <HomeCarousel
            slides={shows.map((show: Show) => (
              <HomeCard
                key={createShowUri(show)}
                name={show.name}
                date={show.date}
                bands={show.bands}
                schedule={show.schedule}
                img={show.img}
              ></HomeCard>
            ))}
          />
        </div>
      </div>
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
