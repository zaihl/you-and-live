'use client'

import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

const testimonials = [
    {
        name: "Alex Johnson",
        avatar: "A",
        title: "Software Engineer",
        description: "This platform has significantly improved my productivity. Highly recommend it!"
    },
    {
        name: "Maria Rodriguez",
        avatar: "M",
        title: "Graphic Designer",
        description: "The user interface is so intuitive and easy to navigate. I love it!"
    },
    {
        name: "John Doe",
        avatar: "J",
        title: "Project Manager",
        description: "Managing projects has never been easier. This tool is a game-changer."
    },
    {
        name: "Emily Clark",
        avatar: "E",
        title: "Freelance Writer",
        description: "This website has everything I need to stay organized and on top of my work."
    },
];


export const LandingContent = () => {
  return (
    <div className="px-10 pb-20">
      <h2 className="text-center text-4xl text-white font-extrabold mb-10">
        Testimonials
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testimonials.map((item) => (
          <Card
            key={item.description}
            className="bg-[#192340] border-none text-white"
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-x-2">
                <div>
                  <p className="text-lg">{item.name}</p>
                  <p className="text-sm text-zinc-400">{item.title}</p>
                </div>
                <div className="bg-[#11182781] flex items-center justify-center rounded-full w-12 h-12">{item.avatar}</div>
              </CardTitle>
              <CardContent className="pt-4 px-0">
                {item.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
