"use client";
import * as z from "zod";
import Heading from "@/components/custom/Heading";
import { Utensils } from "lucide-react";
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
    ingredients: z.string().min(1, "Ingredients required"),
});

const RecipePage = () => {
    const proModal = useProModal();
    const [result, setResult] = useState("");
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { ingredients: "" },
    });
    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await fetch("/api/recipe", {
                method: "POST",
                body: JSON.stringify(values),
            });
            if (response.status === 403) proModal.onOpen();
            const data = await response.json();
            setResult(data.recipe);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            <Heading
                title="Recipe Generator"
                description="Cook something new with what you have."
                icon={Utensils}
                iconColor="text-orange-500"
                bgColor="bg-orange-500/10"
            />
            <div className="px-4 lg:px-8">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="rounded-lg border w-full p-4 px-3 md:px-6 grid grid-cols-12 gap-2"
                    >
                        <FormField
                            name="ingredients"
                            render={({ field }) => (
                                <FormItem className="col-span-12 lg:col-span-10">
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            placeholder="e.g., chicken, rice, broccoli"
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
                            <div className="p-4 border rounded-lg bg-orange-50">
                                <ReactMarkdown>{result}</ReactMarkdown>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};
export default RecipePage;
