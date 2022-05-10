/* eslint-disable @next/next/no-img-element */
import { NextPage } from "next";
import Image from "next/image";
import { Show } from "../classes/show";
import { parse } from "date-fns";
import Link from "next/link";
import createShowUri from "../utils/createShowUri";
import imageLoader from "../utils/loader";

export const HomeCard: NextPage<Show> = (show: Show) => {
  const convertedDate = parse(show.date, "dd/MM/yyyy", new Date());
  return (
    <div className="content-center w-full h-full">
      <Link href={`/show/${createShowUri(show)}`}>
        <a>
          <Image
            src={`${
              process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : ""
            }/assets/${convertedDate.getFullYear()}/${convertedDate.getMonth() + 1}/${show.img}`}
            alt={show.name ? show.name : ""}
            layout="fill"
            objectFit="contain"
            loader={imageLoader}
          />
        </a>
      </Link>
    </div>
  );
};
