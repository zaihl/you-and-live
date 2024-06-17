"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-screen h-screen flex flex-col gap-6 justify-center items-center">
      <h2 className="text-4xl md:text-7xl text-black font-extrabold">
        ERROR 404
      </h2>
      <p className="text-lg md:text-xl text-muted-foreground">
        Page Not Found!
      </p>
      <Link href="/">
        <Button variant={"destructive"} className="px-12 py-6">
          Go To Home
        </Button>
      </Link>
    </div>
  );
}
