import { Show } from "../classes/show";
import deburr from "lodash.deburr";
export default function createShowName(show: Show): string {
  if (!show.name) {
    return deburr(
      // remove os acentos
      show.bands
        .join("-") // liga as bandas com -
        .replaceAll(" ", "-") //troca espaço por -
        .toLowerCase() // coloca em minusculo
    );
  } else {
    return show.name;
  }
}
