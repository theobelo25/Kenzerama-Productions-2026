import { Card, CardContent, CardHeader } from "@/components/ui/card";

const extraItem = ({
  extraItem: { title, price },
}: {
  extraItem: { title: string; price: string };
}) => {
  return (
    <Card className="flex flex-row py-3">
      <CardContent className="w-full flex justify-between">
        <span className="block">{title}</span>
        <span className="block">{price}</span>
      </CardContent>
    </Card>
  );
};

export default extraItem;
