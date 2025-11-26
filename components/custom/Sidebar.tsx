"use client";

import Image from "next/image";
import Link from "next/link";

import { Montserrat } from "next/font/google";
import { cn } from "@/lib/utils";
import {
    Code,
    ImageIcon,
    AudioLinesIcon,
    LayoutDashboard,
    MessageSquare,
    Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";

import FreeCounter from "./FreeCounter";

const montserrat = Montserrat({
    weight: "700",
    subsets: ["latin"],
});

const routes = [
    {
        label: "Conversation",
        icon: MessageSquare,
        color: "text-indigo-600",
        bgColor: "bg-indigo-600/10",
        href: "/conversation",
    },
    {
        label: "Image Generation",
        icon: ImageIcon,
        href: "/image",
        color: "text-rose-500",
        bgColor: "bg-rose-500/10",
    },
    {
        label: "Audio Generation",
        icon: AudioLinesIcon,
        href: "/audio",
        color: "text-cyan-600",
        bgColor: "bg-cyan-600/10",
    },
    {
        label: "Code Generation",
        icon: Code,
        href: "/code",
        color: "text-emerald-600",
        bgColor: "bg-emerald-600/10",
    },
    {
        label: "Settings",
        icon: Settings,
        href: "/settings",
        color: "",
    },
];

const Sidebar = ({ apiLimitCount = 0 }: { apiLimitCount: number }) => {
    const pathname = usePathname();
    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 py-2 flex-1">
                <Link
                    href="/dashboard"
                    className="flex items-center pl-3 mb-14"
                >
                    <div className="relative w-8 h-8 mr-4">
                        <Image
                            fill
                            alt="logo"
                            src="/logo.png"
                            className="rounded-full"
                        />
                    </div>
                    <h1
                        className={cn(
                            "text-2xl font-bold",
                            montserrat.className
                        )}
                    >
                        you-and-live
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            href={route.href}
                            key={route.label}
                            className={cn(
                                "text-sm group p-3 flex w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                                pathname === route.href
                                    ? "text-white bg-white/10"
                                    : "text-zinc-400"
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon
                                    className={cn("h-5 w-5 mr-3", route.color)}
                                />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            <FreeCounter apiLimitCount={apiLimitCount} />
        </div>
    );
};

export default Sidebar;
