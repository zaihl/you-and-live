"use client";

import * as z from "zod";
import Heading from "@/components/custom/Heading";
import { Music } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema, voiceOptions } from "./contants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, User } from "lucide-react";
import { Empty } from "./empty";
import Loader from "@/components/custom/Loader";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
            voice: "nova",
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await fetch("/api/audio", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                if (response.status === 403) {
                    proModal.onOpen();
                }
                throw new Error("Audio generation failed");
            }

            const data = await response.json();

            setMusicHistory([...musicHistory, data.audio]);
            setPromptHistory([...promptHistory, values.prompt]);

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
                title="Audio Generation"
                description="Turn text to Speech/Audio using Pollinations!"
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
                                    <FormItem className="col-span-12 lg:col-span-8">
                                        <FormControl className="m-0 p-0">
                                            <Input
                                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                                disabled={isLoading}
                                                placeholder="Type the text you want to convert to speech..."
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="voice"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-2">
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        defaultValue={
                                                            field.value
                                                        }
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {voiceOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                    {musicHistory.length === 0 && !isLoading && (
                        <div>
                            <Empty label="No Audio generated" />
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
                                            <source
                                                src={item}
                                                type="audio/mpeg"
                                            />
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
