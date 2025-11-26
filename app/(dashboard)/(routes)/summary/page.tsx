"use client";

import * as z from "zod";
import Heading from "@/components/custom/Heading";
import { FileText } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Loader from "@/components/custom/Loader";
import ReactMarkdown from "react-markdown";
import { useProModal } from "@/hooks/useProModal";

const formSchema = z.object({
    text: z
        .string()
        .min(10, "Please enter at least 10 characters to summarize."),
});

const SummaryPage = () => {
    const proModal = useProModal();
    const router = useRouter();
    const [summary, setSummary] = useState<string>("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { text: "" },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await fetch("/api/summary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                if (response.status === 403) proModal.onOpen();
                else throw new Error("Summary failed");
                return;
            }

            const data = await response.json();
            setSummary(data.summary);
        } catch (error) {
            console.error(error);
        } finally {
            router.refresh();
        }
    };

    return (
        <div>
            <Heading
                title="Summarizer"
                description="Summarize long text instantly."
                icon={FileText}
                iconColor="text-cyan-600"
                bgColor="bg-cyan-600/10"
            />
            <div className="px-4 lg:px-8">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 w-full"
                    >
                        <FormField
                            name="text"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <textarea
                                            className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            disabled={isLoading}
                                            placeholder="Paste your text here..."
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button className="w-full" disabled={isLoading}>
                            Summarize
                        </Button>
                    </form>
                </Form>
                <div className="space-y-4 mt-8">
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full bg-muted flex justify-center">
                            <Loader />
                        </div>
                    )}
                    {summary && !isLoading && (
                        <div className="rounded-lg p-4 border border-black/10 bg-cyan-50">
                            <ReactMarkdown className="prose max-w-none">
                                {summary}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SummaryPage;
