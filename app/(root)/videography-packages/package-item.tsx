import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Car } from "lucide-react";

const PackageItem = ({
  packageItem: { title, includes, price },
}: {
  packageItem: { title: string; includes: string[]; price: string };
}) => {
  return (
    <li>
      <Card className="h-full justify-between">
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
