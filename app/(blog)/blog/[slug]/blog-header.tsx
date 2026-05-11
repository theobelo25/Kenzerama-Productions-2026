import Image from "next/image";
import { formatDateTime } from "@/lib/utils";
import { Post } from "@/types";
import Tags from "../tags";

const BlogHeader = ({ data }: { data: Post }) => {
  return (
    <header className="space-y-1">
      <time className="text-muted-foreground">
        {formatDateTime(data.publishDate).dateOnly}
      </time>
      <h1 className="text-4xl">{data.title}</h1>
      <p className="text-muted-foreground">
        by <span className="text-kenzerama-pink">{data.author}</span>
      </p>
      <Tags tags={data.tags} />
      <div className="aspect-16/6 overflow-hidden relative w-full mt-5">
        <Image
          src={data.heroImage}
          alt={data.title}
          className="w-full absolute top-[50%] left-[50%] -translate-[50%]"
          width={0}
          height={0}
          sizes="100vw"
          loading="eager"
        />
      </div>
    </header>
  );
};

export default BlogHeader;
