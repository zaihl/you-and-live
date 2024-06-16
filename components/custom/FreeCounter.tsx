"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "../ui/card"
import { MAX_FREE_COUNTS } from "@/contants"
import { Progress } from "../ui/progress"
import { Button } from "../ui/button"
import { Zap } from "lucide-react"


const FreeCounter = ({apiLimitCount=0}: {apiLimitCount: number}) => {

    const [mounted, setMounted] = useState(false)

    
    useEffect(() => {
        setMounted(true);
    }, [])
    
    if (!mounted) {
        return null;
    }

    return (
      <div className="px-3">
        <Card className="bg-white/10 border-0 outline-none">
          <CardContent className="py-4 flex flex-col gap-3 align-center justify-center">
            <div className="text-center text-sm text-white">
              <p>
                (
                <b>
                  {apiLimitCount} / {MAX_FREE_COUNTS}
                </b>
                ) Free Generations
              </p>
              <Progress
                className="h-3 mt-2 border-0 outline-none outine-0"
                value={(apiLimitCount / MAX_FREE_COUNTS) * 100}
              />
            </div>
            <Button variant="premium" >
              <b>Upgrade</b>
              <Zap className="h-4 w-4 ml-2 fill-white" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
}

export default FreeCounter