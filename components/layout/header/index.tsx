import Link from "@/components/navigation/link-component";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import Menu from "./menu";
import logo from "@/public/images/logo.webp";

const Header = () => {
  return (
    <header className="w-screen fixed z-9 bg-transparent text-white">
      <div className="flex-between w-full px-5 py-3 md:px-15 md:py-4 lg:px-25">
        <div className="flex-start transition-disabled">
          <Link
            href="/"
            className="flex-start"
            withTransition
            aria-label={`${APP_NAME} home`}
          >
            <Image
              src={logo}
              alt=""
              height={36}
              width={36}
              className="hidden"
              aria-hidden
            />
          </Link>
        </div>
        <nav aria-label="Primary" className="space-x-2">
          <Menu />
        </nav>
      </div>
    </header>
  );
};

export default Header;
