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
  type: string;
  slug: string;
  publishDate: Date;
  title: string;
  author: string;
  description: string;
  tags: string[];
  category: string;
  isFeatured: boolean;
  layout: string;
  heroImage: string;
};

export type Film = {
  id: number;
  isFeatured: boolean;
  type: string;
  category: string;
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
  publishDate: Date;
};

export type InstagramPost = {
  caption: string;
  id: string;
  media_url: string;
  permalink: string;
  thumbnail_url: string;
  timestamp: string;
};

export type PostMetadata = {};
