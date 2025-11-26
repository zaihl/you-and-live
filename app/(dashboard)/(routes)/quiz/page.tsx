"use client";
import * as z from "zod";
import Heading from "@/components/custom/Heading";
import { HelpCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Loader from "@/components/custom/Loader";
import { useProModal } from "@/hooks/useProModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
    topic: z.string().min(1, "Topic is required"),
});

interface Question {
    question_number: number;
    question_text: string;
    options: { [key: string]: string };
    correct_answer: string;
}

interface QuizData {
    quiz_title: string;
    questions: Question[];
}

const QuizPage = () => {
    const proModal = useProModal();
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [showAnswers, setShowAnswers] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { topic: "" },
    });
    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setShowAnswers(false);
        setQuizData(null);
        try {
            const response = await fetch("/api/quiz", {
                method: "POST",
                body: JSON.stringify(values),
            });
            if (!response.ok) {
                if (response.status === 403) proModal.onOpen();
                return;
            }
            const data = await response.json();
            // The API returns a stringified JSON in data.quiz, we need to parse it
            // Handle potential Markdown code block wrapping
            let cleanJson = data.quiz
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();
            const parsedData: QuizData = JSON.parse(cleanJson);
            console.log(parsedData)
            setQuizData(parsedData);
        } catch (e) {
            console.error(e);
            // Fallback or error state could be added here
        }
    };

    return (
        <div>
            <Heading
                title="AI Quiz Generator"
                description="Generate quizzes on any topic."
                icon={HelpCircle}
                iconColor="text-yellow-500"
                bgColor="bg-yellow-500/10"
            />
            <div className="px-4 lg:px-8">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="rounded-lg border w-full p-4 px-3 md:px-6 grid grid-cols-12 gap-2 mb-8"
                    >
                        <FormField
                            name="topic"
                            render={({ field }) => (
                                <FormItem className="col-span-12 lg:col-span-10">
                                    <FormControl>
                                        <Input
                                            disabled={isLoading}
                                            placeholder="e.g., Ancient Rome"
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
                            Generate Quiz
                        </Button>
                    </form>
                </Form>

                <div className="space-y-4">
                    {isLoading && (
                        <div className="p-8 rounded-lg w-full bg-muted flex justify-center">
                            <Loader />
                        </div>
                    )}

                    {!isLoading && quizData && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-center mb-6">
                                {quizData.quiz_title}
                            </h2>
                            {quizData.questions.map((q, index) => (
                                <Card
                                    key={index}
                                    className="border border-black/10"
                                >
                                    <CardHeader>
                                        <CardTitle className="text-lg font-medium">
                                            {q.question_number}.{" "}
                                            {q.question_text}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <RadioGroup>
                                            {Object.entries(q.options).map(
                                                ([key, value]) => (
                                                    <div
                                                        key={key}
                                                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-100"
                                                    >
                                                        <RadioGroupItem
                                                            value={key}
                                                            id={`q${q.question_number}-${key}`}
                                                        />
                                                        <Label
                                                            htmlFor={`q${q.question_number}-${key}`}
                                                            className="flex-1 cursor-pointer"
                                                        >
                                                            <span className="font-bold mr-2">
                                                                {key}.
                                                            </span>{" "}
                                                            {value}
                                                        </Label>
                                                    </div>
                                                )
                                            )}
                                        </RadioGroup>
                                        {showAnswers && (
                                            <div className="mt-4 p-3 bg-green-100 text-green-800 rounded-md font-medium">
                                                Correct Answer:{" "}
                                                {q.correct_answer}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                            <div className="flex justify-center pt-4 pb-10">
                                <Button
                                    onClick={() => setShowAnswers(!showAnswers)}
                                    variant="secondary"
                                    size="lg"
                                >
                                    {showAnswers
                                        ? "Hide Answers"
                                        : "Show Answers"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
export default QuizPage;
