import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import {
    ArrowRight,
    Code,
    ImageIcon,
    MessageSquare,
    Music,
    VideoIcon,
    FileText,
    Languages,
    HelpCircle,
    Smile,
    Mail,
    Terminal,
    Utensils,
} from "lucide-react";
import Link from "next/link";

const tools = [
    {
        label: "Conversation",
        icon: MessageSquare,
        color: "text-violet-500",
        bgColor: "bg-violet-500/10",
        href: "/conversation",
    },
    {
        label: "Image Generation",
        icon: ImageIcon,
        color: "text-pink-700",
        bgColor: "bg-pink-700/10",
        href: "/image",
    },
    {
        label: "Video Generation",
        icon: VideoIcon,
        color: "text-orange-700",
        bgColor: "bg-orange-700/10",
        href: "/video",
    },
    {
        label: "Audio Generation",
        icon: Music,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        href: "/audio",
    },
    {
        label: "Code Generation",
        icon: Code,
        color: "text-green-700",
        bgColor: "bg-green-700/10",
        href: "/code",
    },
    {
        label: "Summarizer",
        icon: FileText,
        color: "text-cyan-600",
        bgColor: "bg-cyan-600/10",
        href: "/summary",
    },
    {
        label: "Translator",
        icon: Languages,
        color: "text-blue-600",
        bgColor: "bg-blue-600/10",
        href: "/translate",
    },
    // New
    {
        label: "Quiz Generator",
        icon: HelpCircle,
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
        href: "/quiz",
    },
    {
        label: "Bio Generator",
        icon: Smile,
        color: "text-pink-500",
        bgColor: "bg-pink-500/10",
        href: "/bio",
    },
    {
        label: "Email Drafter",
        icon: Mail,
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10",
        href: "/email",
    },
    {
        label: "Regex Gen",
        icon: Terminal,
        color: "text-slate-700",
        bgColor: "bg-slate-700/10",
        href: "/regex",
    },
    {
        label: "Recipe Gen",
        icon: Utensils,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        href: "/recipe",
    },
];

const Dashboard = () => {
    return (
        <div>
            <div className="mb-8 space-y-4">
                <h2 className="text-2xl md:tex-4xl font-bold text-center">
                    Explore the power of AI
                </h2>
                <p className="text-muted-foreground font-light text-sm md:text-lg text-center">
                    Chat with your favorite AI
                </p>
            </div>
            <div className="px-4 md:px-20 lg:px-32 space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map((tool) => (
                    <Link
                        href={tool.href}
                        key={tool.href}
                        className="m-2 border-black/5 hover:shadow-md transition cursor-pointer block h-full"
                    >
                        <Card className="p-4 w-full flex items-center justify-between h-full">
                            <div className="flex times-center space-x-4">
                                <div
                                    className={cn(
                                        "p-2, w-fit rounded-md",
                                        tool.bgColor
                                    )}
                                >
                                    <tool.icon
                                        className={cn("w-8 h-8", tool.color)}
                                    />
                                </div>
                                <div className="font-semibold">
                                    {tool.label}
                                </div>
                            </div>
                            <ArrowRight className="w-5 h-5" />
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
