import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import logo from "@/public/images/logo.webp";
import { APP_NAME } from "@/lib/constants";
import { Post } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

const FeaturedPostMenuItem = ({
  post,
  className,
}: {
  post: Post;
  className?: string;
}) => {
  const { title, description, publishDate, slug } = post;

  return (
    <Link className="h-full w-full rounded-md" href={`/blog/${slug}`}>
      <Card
        className={cn(
          "relative hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground rounded-sm overflow-hidden",
          className
        )}
      >
        <Image
          src={logo}
          alt={`${APP_NAME} logo`}
          className="absolute top-[50%] left-[50%] -translate-[50%] opacity-18"
        />
        <CardHeader className="gap-0">
          <CardTitle>{post.isFeatured && "Featured"}</CardTitle>
          <CardDescription className="text-muted-foreground">
            Blog Post
          </CardDescription>
        </CardHeader>
        <CardContent>
          <article className="space-y-2">
            <h1>{title}</h1>
            <p>{description}</p>
          </article>
        </CardContent>
        <CardFooter>{formatDateTime(publishDate).dateOnly}</CardFooter>
      </Card>
    </Link>
  );
};

export default FeaturedPostMenuItem;
