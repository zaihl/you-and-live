"use client";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useAuth } from "@clerk/nextjs";

const font = Montserrat({
    subsets: ["latin"],
});

export const LandingNavbar = () => {
    const { isSignedIn } = useAuth();
    return (
        <nav className="p-4 bg-transparent flex items-center justify-between">
            <Link href="/" className="flex items-center">
                <div className="relative h-8 w-8 mr-4">
                    <Image
                        fill
                        alt="log"
                        src="/logo.png"
                        className="rounded-full"
                    />
                </div>
                <h1
                    className={cn(
                        "text-white text-2xl font-bold",
                        font.className
                    )}
                >
                    You-and-Live
                </h1>
            </Link>
            <div className="flex items-center gap-x-2">
                <Link href={isSignedIn ? "/dashboard" : "/dashboard"}>
                    <Button variant={"outline"} className="rounded-full">
                        Get Started
                    </Button>
                </Link>
            </div>
        </nav>
    );
};
