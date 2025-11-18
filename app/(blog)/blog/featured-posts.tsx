import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import { Post } from "@/types";
import logo from "@/public/images/logo.webp";
import Image from "next/image";
import { APP_NAME } from "@/lib/constants";
import Tag from "./tag";
import Tags from "./tags";

const FeaturedPosts = ({ featuredPost }: { featuredPost: Post }) => {
  return (
    <section className="wrapper space-y-5">
      <h2 className="relative h2-subheading">Featured Posts</h2>
      <div className="w-full">
        <Link href={`/blog/${featuredPost.slug}`} className="w-full h-full">
          <article>
            <Card className="relative min-h-[300px] justify-between">
              <Image
                src={logo}
                alt={`${APP_NAME} logo`}
                className="absolute top-[50%] left-[50%] -translate-[50%] opacity-18 h-full w-auto"
              />
              <CardHeader className="w-full">
                <CardTitle>
                  <h1>{featuredPost.title}</h1>
                </CardTitle>
                <span className="text-muted-foreground text-xs">
                  {formatDateTime(featuredPost.publishDate).dateOnly}
                </span>
              </CardHeader>
              <CardContent>
                <p>{featuredPost.description}</p>
              </CardContent>
              <CardFooter className="space-x-2">
                <Tags tags={featuredPost.tags} />
              </CardFooter>
            </Card>
          </article>
        </Link>
      </div>
      <div className="w-[50%] grid grid-cols-3 gap-2">
        <div className="col-span-1 aspect-square bg-amber-300 rounded-sm"></div>
        <div className="col-span-1 aspect-square bg-amber-300 rounded-sm"></div>
        <div className="col-span-1 aspect-square bg-amber-300 rounded-sm"></div>
        <div className="col-span-1 aspect-square bg-amber-300 rounded-sm"></div>
        <div className="col-span-1 aspect-square bg-amber-300 rounded-sm"></div>
        <div className="col-span-1 aspect-square bg-amber-300 rounded-sm"></div>
      </div>
    </section>
  );
};

export default FeaturedPosts;
