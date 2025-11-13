import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import Menu from "./menu";

const Header = () => {
  return (
    <header className="w-screen fixed z-100 bg-white py-2 px-10 ">
      <div className="flex-between">
        <div className="flex-start">
          <Link href="/" className="flex-start">
            <span className="hidden lg:block text-2xl text-kenzerama-pink font-cinzel">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <nav className="space-x-2">
          <Menu />
        </nav>
      </div>
    </header>
  );
};

export default Header;
