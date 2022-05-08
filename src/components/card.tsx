import { NextPage } from "next";
import Image from "next/image";
import { Show } from "../classes/show";
import { format, parse } from "date-fns";

export const Card: NextPage<Show> = ({ name, date, bands, schedule, img }) => {
  const convertedDate = parse(date, "dd/MM/yyyy", new Date());
  return (
    <div className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600">
      <h3 className="text-2xl font-bold">{name ? name : bands.toString()}</h3>
      <p className="mt-4 text-xl">
        Data: {format(convertedDate, "dd/MM/yyyy")} - Horário: {schedule}
      </p>
      <Image
        src={`/public/assets/${convertedDate.getFullYear()}/${convertedDate.getMonth()}/${img}`}
        alt={name ? name : ""}
        layout="fill"
      ></Image>
    </div>
  );
};
