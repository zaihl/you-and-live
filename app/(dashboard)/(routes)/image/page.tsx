"use client";

import * as z from "zod";
import Heading from "@/components/custom/Heading";
import { ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import {
    styleOptions,
    aspectRatioOptions,
    modelOptions,
    formSchema,
} from "./constants";
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
import Image from "next/image";
import { useProModal } from "@/hooks/useProModal";

const ImagePage = () => {
    const proModal = useProModal();
    const [prompts, setPrompts] = useState<string[]>([]);
    const [images, setImages] = useState<string[]>([]);

    const imagesAndPrompts = [];

    for (let i = 0; i < prompts.length; i++) {
        imagesAndPrompts.push(prompts[i], images[i]);
    }

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: "",
            style: "photograph",
            aspectRatio: "1:1",
            model: "flux", // Default model
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await fetch("/api/image", {
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
                throw new Error("Image generation failed");
            }

            const data = await response.json();
            const { src } = data;

            setImages([...images, src]);
            setPrompts([...prompts, values.prompt]);
        } catch (error: any) {
            console.error(error);
        } finally {
            router.refresh();
            form.reset();
        }
    };

    return (
        <div>
            <Heading
                title="Image Generation"
                description="From your text imaginations to images"
                icon={ImageIcon}
                iconColor="text-pink-700"
                bgColor="bg-pink-700/10"
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
                                    <FormItem className="col-span-12 lg:col-span-6">
                                        <FormControl className="m-0 p-0">
                                            <Input
                                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                                disabled={isLoading}
                                                placeholder="A mystical unicorn flying over the rainbow"
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="model"
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
                                                {modelOptions.map((option) => (
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
                            <FormField
                                name="style"
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
                                                {styleOptions.map((option) => (
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
                            <FormField
                                name="aspectRatio"
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
                                                {aspectRatioOptions.map(
                                                    (option) => (
                                                        <SelectItem
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <Button
                                className="col-span-12 w-full"
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
                    {images.length === 0 && !isLoading && (
                        <div>
                            <Empty label="No Images generated" />
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                        {imagesAndPrompts.map((item, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "rounded-lg p-4 border border-black/10 flex flex-col justify-between",
                                    i % 2 === 0
                                        ? "bg-blue-100/50"
                                        : "bg-gray-100/50"
                                )}
                            >
                                {i % 2 === 0 ? (
                                    <div className="mb-4">
                                        <div className="flex items-center gap-x-2 mb-2">
                                            <User className="w-6 h-6" />
                                            <p className="font-semibold">
                                                Prompt:
                                            </p>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            {item}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="relative aspect-square w-full">
                                        <Image
                                            fill
                                            src={item}
                                            alt="generated image"
                                            className="object-cover rounded-lg"
                                        />
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

export default ImagePage;
