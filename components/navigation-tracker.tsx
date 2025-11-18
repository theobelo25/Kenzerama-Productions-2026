"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { addPageToHistory } from "@/lib/actions/cookies.actions";

const NavigationTracker = () => {
  const pathname = usePathname();

  useEffect(() => {
    async function addData() {
      await addPageToHistory(pathname);
    }
    addData();
  }, [pathname]);

  return null;
};

export default NavigationTracker;
