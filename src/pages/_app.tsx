import "../styles/globals.css";
import type { AppProps } from "next/app";
import { NextPage } from "next";
import { ReactElement, ReactNode } from "react";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  <style jsx global>{`
    @font-face {
      font-family: "Newake";
      src: url("${process.env.BASE_PATH}/fonts/newake-demo-400.otf");
      font-style: normal;
      font-weight: 400;
      font-display: swap;
    }
  `}</style>;

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || (page => page);

  return getLayout(<Component {...pageProps} />);
}
