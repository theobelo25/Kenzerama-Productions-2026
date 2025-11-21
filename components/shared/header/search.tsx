"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon } from "lucide-react";

const Search = () => {
  return (
    <form action="/search" method="GET">
      <div className="flex space-x-2">
        <Select name="type" defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent className="z-10" onClick={(e) => e.stopPropagation()}>
            <SelectItem key={"All"} value={"all"}>
              All
            </SelectItem>
            <SelectItem key={"Film"} value={"film"}>
              Film
            </SelectItem>
            <SelectItem key={"Blog Post"} value={"post"}>
              Blog Post
            </SelectItem>
          </SelectContent>
        </Select>
        <Input
          name="q"
          type="text"
          placeholder="Search..."
          className="md:w-[100px] lg:w-[300px]"
        />
        <Button type="submit">
          <SearchIcon />
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </form>
  );
};

export default Search;
