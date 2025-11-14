import KT from "@/public/images/kenz-and-theo-about.webp";
import MJ from "@/public/images/mitch-and-joel-about.webp";
import Image from "next/image";

const TEAMS_TEMP = [
  {
    name: "Kenzie & Theo",
    title: "Owners / Lead Shooters",
    image: KT,
    about:
      "Kenzie is the founder and heart behind Kenzerama Productions. Following in her families footsteps, she has background in the arts, with a focus on television and documentary production. She has over 16 years of experience running the company, bringing with her a sharp eye for storytelling, and has a deep passion for capturing real and candid moments on the wedding day. She loves to bring both her infalible dedication and uniquely creative approach to each wedding she shoots. Theo joined Kenzerama Productions seven years ago and quickly became an essential part of the team. With a background in audio engineering, a sharp creative eye, and a passion for storytelling, he brings a calm, confident presence to every wedding day. Theo is especially known for his love of drone piloting—capturing sweeping aerial shots that add cinematic depth and beauty to each film. His technical skill and artistic perspective help elevate every project and ensure that no moment goes unnoticed from the ground or the sky.",
  },
  {
    name: "Mitch & Joel",
    title: "Associate Shooters",
    image: MJ,
    about:
      "Mitch was the first Associate Shooter to join Kenzerama Productions, bringing with him a strong background in real estate and advertising media. He has a love for cinematography, and a keen eye for composition and detail. His experience behind the camera translates beautifully to weddings, where he captures moments with clarity, creativity, and care. Mitch’s steady presence and thoughtful shooting style make him a trusted and valued part of the team, helping bring each couple’s story to life with professionalism and heart. Joel is the newest Associate Shooter at Kenzerama Productions, but he brings with him years of experience capturing weddings with skill and creativity. His love of travel and documenting the world through his lens, allows him to anticipate moments and document them with authenticity and style. Joel’s easygoing nature and sharp storytelling instincts on a wedding day make him a natural fit for the team, and his work consistently adds depth and beauty to every film he’s part of.",
  },
];

const OurTeams = () => {
  return (
    <section className="wrapper py-10 space-y-10">
      <h2 className="mb-15 text-center text-xl pink-title-underline font-playfair-display">
        Our Teams
      </h2>
      {TEAMS_TEMP.map((team) => (
        <div
          key={team.name}
          className="grid grid-cols-1 md:grid-cols-7 gap-20 [--order:1] even:[--order:-1]"
        >
          <Image
            src={team.image}
            alt={team.name}
            className="col-span-1 md:col-span-3 lg:col-span-2 order-(--order) rounded-lg"
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
