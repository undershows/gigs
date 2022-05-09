import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Head from "next/head";
import { ReactElement } from "react";
import { Show } from "../../classes/show";
import { DetailsCard } from "../../components/detailsCard";
import Layout from "../../components/layout";
import createShowName from "../../utils/createShowName";
import createShowUri from "../../utils/createShowUri";
import getShow from "../../utils/getShow";
import getShows from "../../utils/getShows";

export default function Details({ show }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      <Head>
        <title>undershows - {createShowName(show)} </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="h-full antialiased tracking-wider leading-normal text-gray-900 bg-cover">
        <DetailsCard show={show} key={createShowUri(show)} />
      </div>
    </>
  );
}

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
  const shows: Show[] = await getShows();

  // Get the paths we want to pre-render based on posts
  const paths = shows.map(show => {
    return {
      params: {
        name: [createShowUri(show)],
      },
    };
  });

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
};

// This also gets called at build time
export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params) {
    throw new Error(`A show was not found with the ParsedUrlQuery ${JSON.stringify(params)}`);
  }

  return {
    props: {
      show: getShow(params.name as string),
    },
  };
};

Details.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
