"use client";

import * as z from "zod";
import Heading from "@/components/custom/Heading";
import { Code } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, User } from "lucide-react";
import { Empty } from "./empty";
import Loader from "@/components/custom/Loader";
import ReactMarkdown from "react-markdown";
import { useProModal } from "@/hooks/useProModal";

interface geminiChat {
    role: "user" | "model";
    parts: { text: string }[];
}

const CodePage = () => {
    const proModal = useProModal();
    const router = useRouter();
    const [messages, setMessages] = useState<geminiChat[]>([]);

    // Guest Cookie Check
    useEffect(() => {
        if (document.cookie.indexOf("guest_id") === -1) {
            const randomId = Math.random().toString(36).substring(2, 15);
            document.cookie = `guest_id=${randomId}; path=/; max-age=31536000`;
        }
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const userMessage: geminiChat = {
                role: "user",
                parts: [{ text: values.prompt }],
            };
            const newMessages = [...messages, userMessage];

            const response = await fetch("/api/code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages }),
            });

            if (!response.ok) {
                if (response.status === 403) proModal.onOpen();
                else throw new Error("Something went wrong");
                return;
            }

            const data = await response.json();

            setMessages((current) => [
                ...current,
                userMessage,
                { role: "model", parts: [{ text: data.text }] },
            ]);

            form.reset();
        } catch (error: any) {
            console.error(error);
        } finally {
            router.refresh();
        }
    };

    return (
        <div>
            <Heading
                title="Code Generation"
                description="Generate code using descriptive text!"
                icon={Code}
                iconColor="text-green-700"
                bgColor="bg-green-700/10"
            />
            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
                        >
                            <FormField
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <FormControl className="m-0 p-0">
                                            <Input
                                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                                disabled={isLoading}
                                                placeholder="write a code for toggle button using react hooks"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button
                                className="col-span-12 lg:col-span-2 w-full"
                                disabled={isLoading}
                            >
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>
                <div className="space-y-4 mt-4">
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
                            <Loader />
                        </div>
                    )}
                    {messages.length === 0 && !isLoading && (
                        <div>
                            <Empty label="No conversations started" />
                        </div>
                    )}
                    <div className="p-2 flex flex-col gap-y-4 w-full">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={cn(
                                    "rounded-lg p-4 border border-black/10",
                                    message.role === "user"
                                        ? "bg-blue-100"
                                        : "bg-gray-100"
                                )}
                            >
                                {message.role === "user" ? (
                                    <User />
                                ) : (
                                    <Sparkles />
                                )}
                                <div>
                                    <ReactMarkdown className="w-full prose max-w-none m-0 p-4">
                                        {message.parts[0].text || ""}
                                    </ReactMarkdown>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CodePage;
