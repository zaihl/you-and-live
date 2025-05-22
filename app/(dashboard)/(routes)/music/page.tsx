"use client";

import * as z from "zod";
import Heading from "@/components/custom/Heading";
import { Music } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { User } from "lucide-react";
import { Empty } from "./empty";
import Loader from "@/components/custom/Loader";
import ReactMarkdown from "react-markdown";
import { useProModal } from "@/hooks/useProModal";

const MusicPage = () => {
    const router = useRouter();
    const proModal = useProModal();
    const [musicHistory, setMusicHistory] = useState<string[]>([]);
    const [promptHistory, setPromptHistory] = useState<string[]>([]);

    const promptAndMusic = [];
    for (let i = 0; i < musicHistory.length; i++) {
        promptAndMusic.push(promptHistory[i], musicHistory[i]);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/music", {
                prompt: values.prompt,
            });

            setMusicHistory([...musicHistory, response.data.audio]);
            setPromptHistory([...promptHistory, values.prompt]);

            form.reset();
        } catch (error: any) {
            if (error?.response?.status === 403) {
                proModal.onOpen();
            }
            console.error(error);
        } finally {
            router.refresh();
        }
    };

    return (
        <div>
            <Heading
                title="Music Generation"
                description="Turn text to Sound!"
                icon={Music}
                iconColor="text-emerald-500"
                bgColor="bg-emerald-500/10"
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
                                                placeholder="Solo Piono, Jazz, Rock, etc."
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
                    {musicHistory.length === 0 && (
                        <div>
                            <Empty label="No Sounds here!" />
                        </div>
                    )}
                    <div className="flex flex-col-reverse gap-y-4 w-full p-2">
                        {promptAndMusic.map((item, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "w-full prose max-w-none m-0 p-4",
                                    i % 2 === 0 ? "bg-blue-100" : "bg-gray-100",
                                    "rounded-lg p-4 border border-black/10"
                                )}
                            >
                                {i % 2 === 0 ? <User /> : <Sparkles />}
                                {i % 2 === 0 ? (
                                    <p>{item}</p>
                                ) : (
                                    <div className="w-full p-2 flex items-center justify-center">
                                        <audio controls className="w-full p-4">
                                            <source src={item} />
                                        </audio>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MusicPage;
