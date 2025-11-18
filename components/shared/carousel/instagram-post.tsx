import { Card, CardContent } from "@/components/ui/card";
import Image, { StaticImageData } from "next/image";
import logo from "@/public/images/logo.webp";

const InstagramPost = ({
  data,
}: {
  data: { name: string; date: Date; venue: string; image: StaticImageData };
}) => {
  return (
    <Card className="aspect-square rounded-lg overflow-hidden">
      <Image src={logo} alt={"temp"} className="" />
      <div className="" />
      <CardContent className=""></CardContent>
    </Card>
  );
};

export default InstagramPost;
