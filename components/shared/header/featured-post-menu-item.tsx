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

const FeaturedPostMenuItem = ({
  title,
  description,
  publishDate,
}: {
  title: string;
  description: string;
  publishDate: Date;
}) => {
  return (
    <Card className="relative hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground rounded-sm overflow-hidden">
      <Image
        src={logo}
        alt={`${APP_NAME} logo`}
        className="absolute top-[50%] left-[50%] -translate-[50%] opacity-18"
      />
      <CardHeader className="gap-0">
        <CardTitle>Featured</CardTitle>
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
  );
};

export default FeaturedPostMenuItem;
