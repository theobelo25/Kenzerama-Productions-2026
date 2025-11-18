import Link from "next/link";

const Tag = ({ tag }: { tag: string }) => {
  return (
    <Link
      href={`/search?tag=${tag}`}
      className="py-1 px-3 bg-kenzerama-pink rounded-lg text-xs text-white font-questrial"
    >
      {tag}
    </Link>
  );
};

export default Tag;
