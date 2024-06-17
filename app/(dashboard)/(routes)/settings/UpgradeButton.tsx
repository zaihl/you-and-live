"use client";

import { Button } from "@/components/ui/button";
import { useProModal } from "@/hooks/useProModal";

const UpgradeButton = () => {
    const proModal = useProModal()
  return (
    <>
      <h1 className="font-bold">Upgrade</h1>
      <p className="text-muted-foreground">
        Get the pro subscription to enjoy unlimited prompts
      </p>
      <Button className="w-1/4 my-2" variant={"premium"} onClick={proModal.onOpen}>
        Upgrade
      </Button>
      <hr className="border-t-2" />
    </>
  );
};

export default UpgradeButton;
