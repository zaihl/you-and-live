"use client";

import * as z from "zod";
import Heading from "@/components/custom/Heading";
import { Languages } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Loader from "@/components/custom/Loader";
import { useProModal } from "@/hooks/useProModal";

const formSchema = z.object({
    text: z.string().min(1, "Text is required"),
    targetLanguage: z.string().min(1, "Language is required"),
});

const languages = [
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Italian", label: "Italian" },
    { value: "Portuguese", label: "Portuguese" },
    { value: "Russian", label: "Russian" },
    { value: "Japanese", label: "Japanese" },
    { value: "Chinese", label: "Chinese" },
    { value: "Hindi", label: "Hindi" },
    { value: "Arabic", label: "Arabic" },
];

const TranslatePage = () => {
    const proModal = useProModal();
    const router = useRouter();
    const [translation, setTranslation] = useState<string>("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { text: "", targetLanguage: "Spanish" },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                if (response.status === 403) proModal.onOpen();
                else throw new Error("Translation failed");
                return;
            }

            const data = await response.json();
            setTranslation(data.translation);
        } catch (error) {
            console.error(error);
        } finally {
            router.refresh();
        }
    };

    return (
        <div>
            <Heading
                title="Translator"
                description="Translate text into any language."
                icon={Languages}
                iconColor="text-blue-600"
                bgColor="bg-blue-600/10"
            />
            <div className="px-4 lg:px-8">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid grid-cols-12 gap-2 rounded-lg border p-4 px-3 md:px-6 w-full"
                    >
                        <FormField
                            name="text"
                            render={({ field }) => (
                                <FormItem className="col-span-12 lg:col-span-8">
                                    <FormControl>
                                        <Input
                                            className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                            disabled={isLoading}
                                            placeholder="Hello, how are you?"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="targetLanguage"
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
                                                    defaultValue={field.value}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {languages.map((l) => (
                                                <SelectItem
                                                    key={l.value}
                                                    value={l.value}
                                                >
                                                    {l.label}
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
                            Translate
                        </Button>
                    </form>
                </Form>
                <div className="space-y-4 mt-8">
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full bg-muted flex justify-center">
                            <Loader />
                        </div>
                    )}
                    {translation && !isLoading && (
                        <div className="rounded-lg p-4 border border-black/10 bg-blue-50">
                            <p className="text-lg">{translation}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TranslatePage;
