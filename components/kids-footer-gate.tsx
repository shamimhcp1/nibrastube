"use client";

import { ParentalGateWrapper } from "./parental-gate-wrapper";
import { Button } from "./ui/button";
import { unlockParentPortal, unlockKidsMode } from "@/app/actions/safety";
import { LockOpen } from "@phosphor-icons/react";

interface KidsFooterGateProps {
  correctPin: string;
  target?: "/parent/dashboard" | "/kids";
  trigger?: React.ReactNode;
}

export function KidsFooterGate({ correctPin, target = "/parent/dashboard", trigger }: KidsFooterGateProps) {
  return (
    <ParentalGateWrapper 
      correctPin={correctPin}
      onVerified={async () => {
         if (target === "/kids") {
            await unlockKidsMode();
         } else {
            await unlockParentPortal();
         }
      }}
    >
      {trigger || (
        <Button variant="ghost" className="text-slate-400 hover:text-primary gap-2">
          <LockOpen size={20} /> Parent Settings
        </Button>
      )}
    </ParentalGateWrapper>
  );
}
