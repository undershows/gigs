import Navbar, { NavbarProps } from "./navbar";
import { Footer } from "./footer";

type LayoutProps = {
  children: React.ReactNode;
  title?: string;
  navbarProps?: NavbarProps;
};

export default function Layout({ children, navbarProps }: LayoutProps) {
  return (
    <>
      <div className="flex flex-col w-screen h-screen min-h-screen">
        <style jsx global>{`
          @font-face {
            font-family: "Newake";
            src: url("${process.env.NEXT_PUBLIC_BASE_PATH
              ? process.env.NEXT_PUBLIC_BASE_PATH
              : ""}/fonts/newake-demo-400.otf");
            font-style: normal;
            font-weight: 400;
            font-display: swap;
          }
        `}</style>

        <Navbar hiddenByDefault={navbarProps?.hiddenByDefault} />
        <div className="flex-1 justify-center items-center align-middle">
          <main className="w-full h-full">{children}</main>
        </div>
        <Footer />
      </div>
    </>
  );
}
