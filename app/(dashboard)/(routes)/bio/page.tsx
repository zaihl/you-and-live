"use client";
import * as z from "zod";
import Heading from "@/components/custom/Heading";
import { Smile } from "lucide-react";
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
    keywords: z.string().min(1, "Keywords required"),
});

const BioPage = () => {
    const proModal = useProModal();
    const [result, setResult] = useState("");
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { keywords: "" },
    });
    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await fetch("/api/bio", {
                method: "POST",
                body: JSON.stringify(values),
            });
            if (response.status === 403) proModal.onOpen();
            const data = await response.json();
            setResult(data.bios);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            <Heading
                title="Bio Generator"
                description="Create catchy social media bios."
                icon={Smile}
                iconColor="text-pink-500"
                bgColor="bg-pink-500/10"
            />
            <div className="px-4 lg:px-8">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="rounded-lg border w-full p-4 px-3 md:px-6 grid grid-cols-12 gap-2"
                    >
                        <FormField
                            name="keywords"
                            render={({ field }) => (
                                <FormItem className="col-span-12 lg:col-span-10">
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            placeholder="e.g., traveler, foodie, dream big"
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
                            <div className="p-4 border rounded-lg bg-pink-50">
                                <ReactMarkdown>{result}</ReactMarkdown>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};
export default BioPage;
