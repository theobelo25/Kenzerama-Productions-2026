import type { Film } from "@/types";

type FilmDetailDescriptionProps = {
  film: Film | null;
};

export default function FilmDetailDescription({ film }: FilmDetailDescriptionProps) {
  const text = film?.description?.trim();
  if (!text) return null;

  return (
    <p className="wrapper text-center font-questrial py-10">
      {text}
    </p>
  );
}
