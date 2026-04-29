import { Card, CardContent } from "@/components/ui/card";

const ExtraItem = ({
  extraItem: { title, price },
}: {
  extraItem: { title: string; price: string };
}) => {
  return (
    <li>
      <Card className="flex flex-row py-3">
        <CardContent className="w-full">
          <dl className="flex items-center justify-between gap-4">
            <dt>{title}</dt>
            <dd>{price}</dd>
          </dl>
        </CardContent>
      </Card>
    </li>
  );
};

export default ExtraItem;
