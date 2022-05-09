import Link from "next/link";
import Logo from "./logo";

export type NavbarProps = {
  hiddenByDefault?: boolean;
};

export default function Navbar({ hiddenByDefault }: NavbarProps) {
  return (
    <>
      <nav className={`${hiddenByDefault ? `hidden` : `flex`} flex-wrap items-center bg-black p-5`}>
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
