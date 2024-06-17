"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="w-screen h-screen flex flex-col gap-6 justify-center items-center">
          <h2 className="text-4xl md:text-7xl text-black font-extrabold">Something went Wrong!</h2>
          <p className="text-lg md:text-xl text-muted-foreground">{error.message}</p>
          <Button variant={"destructive"} onClick={() => reset()} className="px-12 py-6">
            Try again
          </Button>
        </div>
      </body>
    </html>
  );
}
