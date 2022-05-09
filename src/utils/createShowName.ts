import { Show } from "../classes/show";
import upperfirst from "lodash.upperfirst";
import { format, parse } from "date-fns";
export default function createShowName(show: Show): string {
  if (!show.name) {
    const showName = show.bands
      .map(band => {
        return upperfirst(band.toString()); // coloca a primeira letra do nome de cada banda em maiúsculo
      })
      .join(", ") // liga as bandas com ,
      .concat(" - ", format(parse(show.date, "dd/MM/yyyy", new Date()), "dd/MM")); // adiciona o dia e o mês do show no nome

    return showName;
  } else {
    return show.name;
  }
}
