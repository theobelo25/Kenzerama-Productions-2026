"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import FeaturedPostMenuItem from "./featured-post-menu-item";
import Poster from "../carousel/poster";
import { Film, InstagramPost, Post } from "@/types";
import InstagramPostComponent from "../carousel/instagram-post";
import Search from "./search";

const BlogMenu = ({
  featuredPost,
  featuredFilm,
  latestInstagram,
}: {
  featuredPost: Post;
  featuredFilm: Film;
  latestInstagram: InstagramPost;
}) => {
  const isMobile = useIsMobile();

  return (
    <NavigationMenu
      viewport={isMobile}
      className="max-w-full h-[76px] md:h-[50px]"
    >
      <NavigationMenuList className="flex-wrap space-x-2">
        <NavigationMenuItem>
          <NavigationMenuTrigger>Films</NavigationMenuTrigger>
          <NavigationMenuContent className="p-5">
            <ul className="grid gap-x-3 gap-y-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[1fr_1fr]">
              <li className="row-span-4">
                <span className="w-full text-center font-playfair-display uppercase">
                  Featured Film
                </span>
                <Poster film={featuredFilm} />
              </li>
              <ListItem href="/search?type=film" title="See All Films">
                View all wedding films.
              </ListItem>
              <ListItem href="/docs/installation" title="Random Film">
                Randomly select one of our wedding films to watch
              </ListItem>
              {latestInstagram && (
                <li className="relative row-span-2 font-cinzel text-2xl text-center text-kenzerama-pink-light">
                  <span className="absolute z-10 w-full left-0 top-3 ">
                    Follow us on
                  </span>
                  <InstagramPostComponent post={latestInstagram} />
                  <span className="absolute w-full z-10 left-0 bottom-3 ">
                    Instagram!
                  </span>
                </li>
              )}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Blog</NavigationMenuTrigger>
          <NavigationMenuContent className="p-5">
            <ul className="grid gap-x-3 gap-y-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[1fr_.75fr]">
              <li className="row-span-3">
                <FeaturedPostMenuItem post={featuredPost} />
              </li>
              <ListItem
                href={`/search?type=post`}
                title="See All Posts"
                className="row-span-1"
              >
                View all blog posts
              </ListItem>
              <ListItem href="/" title="Random Post" className="row-span-1">
                Randomly select one of our blog posts to read
              </ListItem>
              <ListItem
                href="/contact-us"
                title="Contact Us"
                className="row-span-1"
              >
                Let us know what you think!
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Search />
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href} className="h-full flex flex-col justify-center">
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

export default BlogMenu;
