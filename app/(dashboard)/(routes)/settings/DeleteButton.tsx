'use client'
import { Button } from "@/components/ui/button";
import React, { Suspense } from "react";
import { deleteAccount } from './actions'

const DeleteButton = () => {
  return (
    <>
      <h1 className="font-bold">Delete Account</h1>
      <p className="text-muted-foreground">
        Procees with caution, there is no going back
      </p>
      <Suspense fallback="Deleting...">
        <Button
          className="w-1/4 my-2"
          variant={"destructive"}
          onClick={async () => {
            const res = await deleteAccount();
            const ok = "test";
          }}
        >
          Delete Account
        </Button>
      </Suspense>
      <hr className="border-t-2" />
    </>
  );
};

export default DeleteButton;
