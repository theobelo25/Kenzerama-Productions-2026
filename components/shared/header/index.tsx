import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import Menu from "./menu";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex-between">
        <div className="flex-start">
          <Link href="/" className="flex-start ml-4">
            <Image
              src="/images/logo.webp"
              alt={`${APP_NAME} logo`}
              height={48}
              width={48}
              priority={true}
            />
            <span className="hidden lg:block text-2xl ml-3 text-kenzeramaPink font-cinzel">
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
