import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import { Show } from "../../classes/show";
import { DetailsCard } from "../../components/detailsCard";
import createShowName from "../../utils/createShowName";
import getShows from "../../utils/getShows";

export default function Details({ shows }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className="font-sans bg-cover leading-normal tracking-wider text-gray-900 antialiased">
      {shows.map((show: Show) => (
        <DetailsCard show={show} key={createShowName(show)} />
      ))}
    </div>
  );
}

// This function gets called at build time
export const getStaticPaths: GetStaticPaths = async () => {
  const shows = await getShows();

  // Get the paths we want to pre-render based on posts
  const paths = shows.map(show => {
    return {
      params: {
        name: [createShowName(show)],
      },
    };
  });

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false };
};

// This also gets called at build time
export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      shows: await getShows(),
    },
  };
};
