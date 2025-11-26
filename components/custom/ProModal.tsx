"use client";

import { useProModal } from "@/hooks/useProModal";
import {
    Dialog,
    DialogHeader,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
    Check,
    Code,
    ImageIcon,
    MessageSquare,
    AudioLinesIcon,
    VideoIcon,
    FileText,
    Languages,
} from "lucide-react";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";

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
    {
        label: "Video Generation",
        icon: VideoIcon,
        href: "/video",
        color: "text-orange-700",
        bgColor: "bg-orange-700/10",
    },
    {
        label: "Audio Generation",
        icon: AudioLinesIcon,
        href: "/audio",
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
    },
    {
        label: "Code Generation",
        icon: Code,
        href: "/code",
        color: "text-green-700",
        bgColor: "bg-green-700/10",
    },
    {
        label: "Summarizer",
        icon: FileText,
        href: "/summary",
        color: "text-cyan-600",
        bgColor: "bg-cyan-600/10",
    },
    {
        label: "Translator",
        icon: Languages,
        href: "/translate",
        color: "text-blue-600",
        bgColor: "bg-blue-600/10",
    },
];

const ProModal = () => {
    const proModal = useProModal();

    return (
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="uppercase flex mb-4 gap-4 justify-center items-center">
                        Free Trial Exhausted
                        <div>
                            <Button
                                variant="premium"
                                className="font-semibold shadow-md hover:shadow-lg rounded-full"
                            >
                                Upgrade to Pro
                            </Button>
                        </div>
                    </DialogTitle>
                    <DialogDescription className="flex flex-col gap-4">
                        {tools.map((tool) => (
                            <Card
                                key={tool.href}
                                className="p-2 w-full flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3 w-full">
                                    <div
                                        className={cn(
                                            "p-2 rounded-md",
                                            tool.bgColor
                                        )}
                                    >
                                        <tool.icon
                                            className={cn(
                                                "w-8 h-8",
                                                tool.color
                                            )}
                                        />
                                    </div>
                                    <div className="font-semibold text-sm">
                                        {tool.label}
                                    </div>
                                    <Check className="ml-auto mr-4" />
                                </div>
                            </Card>
                        ))}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default ProModal;
