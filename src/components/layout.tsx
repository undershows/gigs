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
        <Navbar hiddenByDefault={navbarProps?.hiddenByDefault} />
        <div className="flex-1 justify-center items-center align-middle">
          <main className="w-full h-full">{children}</main>
        </div>
        <Footer />
      </div>
    </>
  );
}
