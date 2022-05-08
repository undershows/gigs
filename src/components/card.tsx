import { NextPage } from "next";
import Image from "next/image";
import { Show } from "../classes/show";
import { format, parse } from "date-fns";
import Link from "next/link";
import createShowName from "../utils/createShowName";

export const Card: NextPage<Show> = (show: Show) => {
  const convertedDate = parse(show.date, "dd/MM/yyyy", new Date());
  return (
    <Link href={`show/${createShowName(show)}`}>
      <a className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600">
        <h3 className="text-2xl font-bold">{show.name ? show.name : show.bands.join(", ")}</h3>
        <p className="mt-4 text-xl">
          Data: {format(convertedDate, "dd/MM/yyyy")} - Horário: {show.schedule}
        </p>
        <Image
          src={`/assets/${convertedDate.getFullYear()}/${convertedDate.getMonth() + 1}/${show.img}`}
          alt={show.name ? show.name : ""}
          width={720}
          height={480}
        ></Image>
      </a>
    </Link>
  );
};
