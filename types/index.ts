import { Asset } from "next-video/dist/assets.js";
import { StaticImageData } from "next/image";

export type Venue = {
  name: string;
  location: string;
  url: string;
  image: StaticImageData;
};

export type Vendor = {
  name: string;
  url: string;
  title: string;
};

export type Post = {
  slug: string;
  publishDate: Date;
  title: string;
  description: string;
  tags: string[];
};

export type Film = {
  id: number;
  isFeatured: boolean;
  type: string;
  slug: string;
  title: string;
  poster: {
    image: StaticImageData;
    alt: string;
  };
  video: Asset;
  tags: string[];
  description: string;
  details: {
    venue: Venue;
    vendors: Vendor[];
  };
  date: Date;
};
