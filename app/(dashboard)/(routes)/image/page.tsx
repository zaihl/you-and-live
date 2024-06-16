"use client";

import * as z from "zod";
import Heading from "@/components/custom/Heading";
import { ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { styleOptions, formSchema, resolutionOptions } from "./constants";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { generateImage } from "./action";


const ImagePage = () => {

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
      style: "anime",
      resolution: "1024x1024",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log("here")
      const src = await generateImage(values);
      setImages([...images, src]);
      setPrompts([...prompts, values.prompt])
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
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {styleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                name="resolution"
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
                          <SelectValue defaultValue={field.value} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {resolutionOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
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
          {images.length === 0 && (
            <div>
              <Empty label="No Images generated" />
            </div>
          )}
          <div className="flex flex-col-reverse gap-y-4 w-full p-2">
            {imagesAndPrompts.map((item, i) => (
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
                    <Image
                      width={512}
                      height={512}
                      src={item}
                      alt="generated image"
                      className="object-cover shadow-lg"
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
