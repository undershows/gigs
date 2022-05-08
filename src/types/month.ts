import { Show } from "../classes/show";

export enum MonthName {
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
}

export interface Month {
  monthNumber: number;
  name: MonthName;
  shows: Show[];
}
