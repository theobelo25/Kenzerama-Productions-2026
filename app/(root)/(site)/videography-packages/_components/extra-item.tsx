const ExtraItem = ({
  extraItem: { title, price },
}: {
  extraItem: { title: string; price: string };
}) => {
  return (
    <li className="py-2">
      <dl className="flex items-center justify-between gap-1">
        <dt className="font-semibold">{title}</dt>
        <dd>{price}</dd>
      </dl>
    </li>
  );
};

export default ExtraItem;
