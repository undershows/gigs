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
      <main className="flex flex-col w-screen h-screen min-h-screen">
        <Navbar hiddenByDefault={navbarProps?.hiddenByDefault} />
        <div className="flex-1 justify-center items-center w-full h-full align-middle">
          <div className="w-full h-full">{children}</div>
        </div>
        <Footer />
      </main>
    </>
  );
}
