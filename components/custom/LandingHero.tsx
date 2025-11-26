"use client";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import TypewriteComponent from "typewriter-effect";
import { Button } from "../ui/button";

const LandingHero = () => {
    const { isSignedIn } = useAuth();
    return (
        <div className="text-white font-bold py-36 text-center space-y-5">
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
                <h1>The Best AI Utilities</h1>
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                    <TypewriteComponent
                        options={{
                            strings: [
                                "Chatbot",
                                "Photo Generation",
                                // Removed Music/Video strings
                                "Code Generation",
                            ],
                            autoStart: true,
                            loop: true,
                        }}
                    />
                </div>
            </div>
            <div className="text-sm md:text-xl font-light text-zinc-400">
                Create Content Using AI 10x Faster.
            </div>
            <div>
                <Link href={isSignedIn ? "/dashboard" : "/dashboard"}>
                    {/* Changed redirect to dashboard regardless of signin, since guests are allowed */}
                    <Button
                        variant={"premium"}
                        className="md:text-lg p-4 md:p-6 rounded-full"
                    >
                        Start Generating for Free!
                    </Button>
                </Link>
            </div>
            <div className="text-zinc-400 text-xs md:text-sm font-normal">
                No Credit Card Required.
            </div>
        </div>
    );
};

export default LandingHero;
