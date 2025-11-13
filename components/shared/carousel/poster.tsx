import Image, { StaticImageData } from "next/image";
import { Card, CardContent } from "@/components/ui/card";

const Poster = ({
  data,
}: {
  data: { name: string; image: StaticImageData; date: Date; venue: string };
}) => {
  const { name, date, venue, image } = data;

  return (
    <Card className="relative aspect-poster overflow-hidden rounded-none">
      <Image src={image} alt={name} className="absolute inset-0 z-0" />
      <div className="absolute inset-0 z-1 bg-black opacity-45" />
      <CardContent className="z-2 flex flex-col justify-between items-center h-full text-white">
        <span className="text-xl text-center font-playfair-display">
          {venue}
        </span>
        <div className="flex flex-col items-center font-cinzel">
          <span className="text-2xl text-center font-cinzel">{name}</span>
          <span>{date.getFullYear()}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Poster;
