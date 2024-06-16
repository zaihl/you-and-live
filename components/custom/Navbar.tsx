import { Button } from "@/components/ui/button"
import { UserButton } from "@clerk/nextjs"
import MobileSidebar from "./Mobile-sidebar"

const Navbar = ({ apiLimitCount = 0 }: { apiLimitCount: number }) => {
  return (
    <div className="flex items-center p-4">
      <MobileSidebar apiLimitCount={apiLimitCount} />
      <div className="flex w-full justify-end">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
};

export default Navbar