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
      <div className="flex justify-center items-center space-x-2 md:p-0 max-sm:wrapper">
        <label htmlFor="search-type" className="sr-only">
          Filter by content type
        </label>
        <Select name="type" defaultValue="all">
          <SelectTrigger
            id="search-type"
            aria-label="Filter by content type"
            className="w-[180px]"
          >
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
        <label htmlFor="search-query" className="sr-only">
          Search query
        </label>
        <Input
          id="search-query"
          aria-label="Search query"
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
