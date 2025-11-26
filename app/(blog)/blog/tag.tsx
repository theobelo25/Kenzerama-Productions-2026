const Tag = ({ tag }: { tag: string }) => {
  return (
    <span className="py-1 px-3 bg-kenzerama-pink rounded-lg text-xs text-white font-questrial whitespace-nowrap">
      {tag}
    </span>
  );
};

export default Tag;
