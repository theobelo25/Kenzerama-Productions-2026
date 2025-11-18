import Link from "next/link";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import Menu from "./menu";
import logo from "@/public/images/logo.webp";
import { headers } from "next/headers";
import BlogMenu from "./blog-menu";
import { getFeaturedPost } from "@/lib/actions/posts.actions";

const Header = async () => {
  const headersList = await headers();
  const pathname = headersList.get("x-current-path");
  const featuredPost = await getFeaturedPost();

  return (
    <header className="w-screen fixed z-100 bg-white py-2 px-10 ">
      <div className="flex-between">
        <div className="flex-start">
          <Link href="/" className="flex-start">
            <Image
              src={logo}
              alt={`${APP_NAME} logo`}
              height={36}
              width={36}
              className="hidden md:block lg:hidden"
            />
            <span className="md:hidden lg:block text-xl md:text-2xl text-kenzerama-pink font-cinzel">
              {APP_NAME}
            </span>
          </Link>
        </div>
        <nav className="space-x-2">
          <Menu />
        </nav>
      </div>
      {pathname?.includes("/blog") && <BlogMenu featuredPost={featuredPost} />}
    </header>
  );
};

export default Header;
