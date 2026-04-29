import Link from "@/components/link-component";
import Image from "next/image";
import { headers } from "next/headers";
import { APP_NAME } from "@/lib/constants";
import Menu from "./menu";
import logo from "@/public/images/logo.webp";

const Header = async () => {
  const headerList = await headers();
  const pathname = headerList.get("x-current-path");
  const isLandingPage = pathname === "/";

  return (
    <header className="w-screen fixed z-9 bg-transparent text-white">
      <div className="flex-between w-full px-5 py-3 md:px-15 md:py-4 lg:px-25">
        <div className="flex-start transition-disabled">
          <Link href="/" className="flex-start" withTransition>
            <Image
              src={logo}
              alt={`${APP_NAME} logo`}
              height={36}
              width={36}
              className="hidden"
            />
            {!isLandingPage && (
              <span className="block text-xl md:text-2xl text-white font-cinzel">
                {APP_NAME}
              </span>
            )}
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
