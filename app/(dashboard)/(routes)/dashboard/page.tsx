import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ArrowRight, Code, ImageIcon, MessageSquare } from "lucide-react";
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
        href: "/image",
        color: "text-pink-700",
        bgColor: "bg-pink-700/10",
    },
    // Music and Video removed
    {
        label: "Code Generation",
        icon: Code,
        href: "/code",
        color: "text-green-700",
        bgColor: "bg-green-700/10",
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
            <div className="px-4 md:px-20 lg:px-32 space-y-4">
                {tools.map((tool) => (
                    <Link
                        href={tool.href}
                        key={tool.href}
                        className="m-2 border-black/5 hover:shadow-md transition cursor-pointer"
                    >
                        <Card className="p-4 w-full  flex items-center justify-between">
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
