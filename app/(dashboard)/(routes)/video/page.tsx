"use client";

import * as z from "zod";
import Heading from "@/components/custom/Heading";
import { Video } from "lucide-react";
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


const VideoPage = () => {
  const router = useRouter();
  
  const [videoHistory, setVideoHistory] = useState<string[]>([]);
  const [promptHistory, setPromptHistory] = useState<string[]>([]);

  const promptAndVideo = []
  for (let i = 0; i < videoHistory.length; i++) {
    promptAndVideo.push(promptHistory[i], videoHistory[i])
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
      const response = await axios.post("/api/video", {
        prompt: values.prompt,
      });

      setVideoHistory([...videoHistory, response.data[0]]);
      setPromptHistory([...promptHistory, values.prompt]);

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
        title="Video Generation"
        description="Turn text to Video!"
        icon={Video}
        iconColor="text-orange-700"
        bgColor="bg-orange-700/10"
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
                        placeholder="Crisp fire crackles in the night..."
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
          {videoHistory.length === 0 && (
            <div>
              <Empty label="No Videos here!" />
            </div>
          )}
          <div className="flex flex-col-reverse gap-y-4 w-full p-2">
            {promptAndVideo.map((item, i) => (
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
                    <video controls className="w-full aspect-video rounded-lg border border-black/10">
                      <source src={item} />
                    </video>
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

export default VideoPage;
