import Image from "next/image";
import type { OurTeamsProps } from "@/lib/directus/blocks/block_our_teams";
import { cn } from "@/lib/utils";

type Props = {
  data?: OurTeamsProps | null;
};

const OurTeams = ({ data }: Props) => {
  if (!data?.members?.length) {
    return null;
  }

  return (
    <section className="wrapper pt-0 pb-10 space-y-10">
      <h2 className="mb-15 h2-subheading">{data.title}</h2>
      {data.members.map((team, index) => (
        <div
          key={team.id}
          className="grid grid-cols-1 md:grid-cols-7 gap-20 [--order:1] even:[--order:-1]"
        >
          <div
            className={cn(
              "relative col-span-1 aspect-[3/4] w-full md:col-span-3 lg:col-span-2 order-(--order) md:min-h-0",
              index === 1 && "hidden md:block",
            )}
          >
            <Image
              src={team.imageSrc}
              alt={team.name}
              fill
              className="rounded-lg object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
              placeholder="empty"
              priority={index === 0}
            />
          </div>
          <div className="flex flex-col justify-center col-span-1 md:col-span-4 lg:col-span-5">
            <h3 className="font-cinzel text-2xl text-kenzerama-pink">
              {team.name}
            </h3>
            <p className="mt-1 text-base font-questrial text-black">
              {team.title}
            </p>
            <p className="mt-4 font-questrial text-(--text-ali)">{team.about}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default OurTeams;
