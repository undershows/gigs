import Link from "next/link";
import Logo from "./logo";

export type NavbarProps = {
  hiddenByDefault?: boolean;
};

export default function Navbar({ hiddenByDefault }: NavbarProps) {
  return (
    <>
      <nav className={`${hiddenByDefault ? `hidden` : `flex`} flex-wrap items-center bg-black p-5`}>
        <style jsx>{`
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
        <Link href="/">
          <a className="inline-flex items-center p-2 mr-4">
            <span className="mr-2 w-8 h-8 text-white fill-current">
              <Logo textSize="text-3xl" invertColors={true} />
            </span>
          </a>
        </Link>
      </nav>
    </>
  );
}
