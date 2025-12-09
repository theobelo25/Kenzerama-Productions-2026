import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PackageItem = ({
  packageItem: { title, includes, price },
  index,
}: {
  packageItem: { title: string; includes: string[]; price: string };
  index: number;
}) => {
  const getBGColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-kenzerama-pink/25";
      case 1:
        return "bg-kenzerama-pink/50";

      case 2:
        return "bg-kenzerama-pink/75";

      case 3:
        return "bg-kenzerama-pink";

      default:
        return "bg-kenzerama-pink";
    }
  };
  return (
    <li>
      <Card
        className={cn(
          "h-full justify-between bg-kenzerama-pink",
          getBGColor(index)
        )}
      >
        <div>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {includes.map((include, index) => (
                <li key={title + include + index}>{include}</li>
              ))}
            </ul>
          </CardContent>
        </div>

        <CardFooter>
          <span className="w-full text-center">${price} + HST</span>
        </CardFooter>
      </Card>
    </li>
  );
};

export default PackageItem;
