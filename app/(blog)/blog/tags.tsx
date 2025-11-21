import Tag from "./tag";
import { cn } from "@/lib/utils";

const Tags = ({ tags, className }: { tags: string[]; className?: string }) => {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {tags.map((tag) => (
        <Tag key={tag} tag={tag} />
      ))}
    </div>
  );
};

export default Tags;
