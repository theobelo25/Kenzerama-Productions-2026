import Image from "next/image";
import { TEAMS } from "@/info/teams";
import { cn } from "@/lib/utils";
const OurTeams = () => {
  return (
    <section className="wrapper pt-0 pb-10 space-y-10">
      <h2 className="mb-15 h2-subheading">Our Teams</h2>
      {TEAMS.map((team) => (
        <div
          key={team.name}
          className="grid grid-cols-1 md:grid-cols-7 gap-20 [--order:1] even:[--order:-1]"
        >
          <Image
            src={team.image}
            alt={team.name}
            className={cn(
              "col-span-1 md:col-span-3 lg:col-span-2 order-(--order) rounded-lg",
              team.name === "Mitch & Joel" && "hidden md:block",
            )}
            width={0}
            height={0}
            sizes="(min-width: 768px) 50vw, 100vw"
            placeholder="blur"
          />
          <div className="flex flex-col justify-center col-span-1 md:col-span-4 lg:col-span-5">
            <h3 className="font-cinzel text-2xl text-kenzerama-pink">{team.name}</h3>
            <p className="mt-1 text-base font-questrial text-black">{team.title}</p>
            <p className="mt-4 font-questrial text-(--text-ali)">{team.about}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default OurTeams;
