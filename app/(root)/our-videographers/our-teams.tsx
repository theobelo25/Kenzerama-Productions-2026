import Image from "next/image";
import { TEAMS } from "@/data/teams";
const OurTeams = () => {
  return (
    <section className="wrapper py-10 space-y-10">
      <h2 className="mb-15 h2-subheading">Our Teams</h2>
      {TEAMS.map((team) => (
        <div
          key={team.name}
          className="grid grid-cols-1 md:grid-cols-7 gap-20 [--order:1] even:[--order:-1]"
        >
          <Image
            src={team.image}
            alt={team.name}
            className="col-span-1 md:col-span-3 lg:col-span-2 order-(--order) rounded-lg"
            width={0}
            height={0}
            sizes="50vw, 100vw"
            fetchPriority="high"
            placeholder="blur"
            loading="eager"
          />
          <div className="flex flex-col justify-center col-span-1 md:col-span-4 lg:col-span-5 space-y-4">
            <h3 className="font-cinzel text-2xl text-kenzerama-pink">
              {team.name}
              <span className="block text-base font-questrial text-black">
                {team.title}
              </span>
            </h3>
            <p className="font-questrial text-(--text-ali)">{team.about}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default OurTeams;
