"use client";

import * as z from "zod";
import Heading from "@/components/custom/Heading";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { User } from "lucide-react";
import { Empty } from "./empty";
import Loader from "@/components/custom/Loader";
import ReactMarkdown from "react-markdown";


interface geminiChat {
  role: "user" | "model";
  parts: { text: string }[];
}

const ConversationPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<geminiChat[]>([]);

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

      const response = await axios.post("/api/conversation", {
        messages: newMessages,
      });

      const modelResponse: geminiChat = {
        role: "model",
        parts: [{ text: response.data.text }],
      };

      setMessages([...newMessages, modelResponse]);

      form.reset();
    } catch (error: any) {
      // TODO: Open Pro Modal
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Conversation"
        description="Our most advanced conversation model"
        icon={MessageSquare}
        iconColor="text-violet-500"
        bgColor="bg-violet-500/10"
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
                        placeholder="How do I get hard boil eggs?"
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
          {messages.length === 0 && (
            <div>
              <Empty label="No conversations started" />
            </div>
          )}
          <div
            className="flex flex-col-reverse gap-y-4 w-full"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  message.role === "user" ? "bg-blue-100" : "bg-gray-100",
                  "rounded-lg p-4 border border-black/10",
                  index === messages.length - 1 ? "snap-end" : ""
                )}
              >
                {message.role === "user" ? <User /> : <Sparkles />}
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

export default ConversationPage;
