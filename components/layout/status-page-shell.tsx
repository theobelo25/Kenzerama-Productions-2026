"use client";

import Image from "next/image";
import { APP_NAME } from "@/lib/constants";

type StatusPageShellProps = {
  children: React.ReactNode;
};

export default function StatusPageShell({ children }: StatusPageShellProps) {
  return (
    <div
      className="flex w-full flex-1 flex-col items-center justify-center px-6 py-16 md:py-24"
      role="alert"
      aria-live="assertive"
    >
      <Image
        src="/images/logo.webp"
        width={48}
        height={48}
        alt={`${APP_NAME} logo`}
        priority
      />
      <div className="mt-6 w-full max-w-md rounded-lg p-6 text-center shadow-md">
        {children}
      </div>
    </div>
  );
}
