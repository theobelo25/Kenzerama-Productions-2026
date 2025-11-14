import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import logo from "@/public/images/logo.webp";

const InstagramPost = () => {
  return (
    <Card className="aspect-square rounded-lg overflow-hidden">
      <Image src={logo} alt={"temp"} className="" />
      <div className="" />
      <CardContent className=""></CardContent>
    </Card>
  );
};

export default InstagramPost;
