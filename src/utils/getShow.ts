import path from "path";
import { Show } from "../classes/show";
import { Events } from "../types/events";
import yaml from "yaml";
import fs from "fs";
import { Year } from "../types/year";
import { Month } from "../types/month";
import createShowUri from "./createShowUri";
export default function getShow(showUri: string): Show | undefined {
  const events = yaml.parse(fs.readFileSync(path.join(process.cwd(), "/public/shows.yaml"), "utf-8")).events as Events;

  const shows: Show[] = [];
  events.years.forEach((year: Year): void => {
    return year.months.forEach((month: Month): void => {
      return month.shows.forEach((show: Show): void => {
        shows.push(show);
      });
    });
  });

  const show = shows.find(show => {
    if (showUri == createShowUri(show)) {
      return show;
    }
  });

  if (!show) {
    console.error(`An show with the URI ${showUri} was not found.`);
  }

  return show;
}
