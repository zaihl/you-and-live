import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";
import { Settings } from "lucide-react";
import UpgradeButton from "./UpgradeButton";
import DeleteButton from "./DeleteButton";

const SettingsPage = () => {
  return (
    <>
      <div className="h-full w-full p-4 flex gap-2">
        <div className="bg-gray-300 p-3 rounded-lg">
          <Settings className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage account settings.</p>
        </div>
      </div>
      <div className="px-4 py-8 flex flex-col">
        <UpgradeButton />
      </div>
      <div className="px-4 py-8 flex flex-col">
        <h1 className="font-bold">Sign Out</h1>
        <p className="text-muted-foreground">Going already? Have a nice day</p>
        <Button className="w-1/4 my-2 bg-muted-foreground">
          <SignOutButton redirectUrl="/" />
        </Button>
        <hr className="border-t-2" />
      </div>
      <div className="px-4 py-8 flex flex-col">
        <DeleteButton />
      </div>
    </>
  );
};

export default SettingsPage;
