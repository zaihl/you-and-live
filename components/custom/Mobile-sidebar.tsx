"use client"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { getApiLimitCount } from "@/lib/apiLimit";

const MobileSidebar = ({ apiLimitCount = 0 }: { apiLimitCount: number }) => {
  const [isMounted, setIsMounded] = useState(false);
  useEffect(() => {
    setIsMounded(true);
  }, []);
  if (!isMounted) {
    return null;
  }
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
         <Sidebar apiLimitCount={apiLimitCount} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar