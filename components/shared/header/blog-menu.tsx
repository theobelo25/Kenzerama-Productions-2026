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
import CB from "@/public/images/posters/c&b-Poster-colorized.webp";
import { Post } from "@/types";
import { Asset } from "next-video/dist/assets.js";

const FEATURED_FILM = {
  name: "Caroline & Brennan",
  date: new Date(),
  venue: "Kingston, On",
  image: CB,
};

const BlogMenu = ({
  featuredPost,
  featuredFilm,
}: {
  featuredPost: Post;
  featuredFilm: Asset;
}) => {
  const isMobile = useIsMobile();

  return (
    <NavigationMenu viewport={isMobile} className="max-w-full h-[50px]">
      <NavigationMenuList className="flex-wrap">
        <NavigationMenuItem>
          <NavigationMenuTrigger>Films</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <Link className="h-full w-full" href="/">
                    <span className="w-full text-center font-playfair-display uppercase">
                      Featured Film
                    </span>
                    <Poster data={FEATURED_FILM} />
                  </Link>
                </NavigationMenuLink>
              </li>
              <ListItem href="/search?type=film" title="See All Films">
                View all wedding films.
              </ListItem>
              <ListItem href="/docs/installation" title="Random Film">
                Randomly select one of our wedding films to watch
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Blog</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-2 md:w-[400px] lg:w-[500px] lg:grid-cols-[1fr_.75fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild className="p-0 bg-transparent">
                  <Link
                    className="h-full w-full rounded-md"
                    href={`/blog/${featuredPost.slug}`}
                  >
                    <FeaturedPostMenuItem
                      title={featuredPost.title}
                      description={featuredPost.description}
                      publishDate={featuredPost.publishDate}
                    />
                  </Link>
                </NavigationMenuLink>
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
            </ul>
          </NavigationMenuContent>
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
