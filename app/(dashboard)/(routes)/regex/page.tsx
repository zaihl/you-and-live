"use client";
import * as z from "zod";
import Heading from "@/components/custom/Heading";
import { Terminal } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Loader from "@/components/custom/Loader";
import ReactMarkdown from "react-markdown";
import { useProModal } from "@/hooks/useProModal";

const formSchema = z.object({
    pattern: z.string().min(1, "Pattern required"),
});

const RegexPage = () => {
    const proModal = useProModal();
    const [result, setResult] = useState("");
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { pattern: "" },
    });
    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await fetch("/api/regex", {
                method: "POST",
                body: JSON.stringify(values),
            });
            if (response.status === 403) proModal.onOpen();
            const data = await response.json();
            setResult(data.regex);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            <Heading
                title="Regex Generator"
                description="Generate complex Regex patterns."
                icon={Terminal}
                iconColor="text-slate-700"
                bgColor="bg-slate-700/10"
            />
            <div className="px-4 lg:px-8">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="rounded-lg border w-full p-4 px-3 md:px-6 grid grid-cols-12 gap-2"
                    >
                        <FormField
                            name="pattern"
                            render={({ field }) => (
                                <FormItem className="col-span-12 lg:col-span-10">
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            placeholder="e.g., validate email address"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button
                            className="col-span-12 lg:col-span-2"
                            disabled={isLoading}
                        >
                            Generate
                        </Button>
                    </form>
                </Form>
                <div className="mt-4">
                    {isLoading ? (
                        <Loader />
                    ) : (
                        result && (
                            <div className="p-4 border rounded-lg bg-slate-100">
                                <ReactMarkdown>{result}</ReactMarkdown>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};
export default RegexPage;
