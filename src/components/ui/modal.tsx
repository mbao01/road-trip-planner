"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

export type ModalProps = React.ComponentProps<typeof DialogContent> & {
  title: string;
  description?: string;
  trigger?: React.ReactNode;
  footer?: React.ReactNode | ((args: { closeModal: () => void }) => React.ReactNode);
};

export const Modal = ({ children, description, footer, title, trigger, ...props }: ModalProps) => {
  const [open, setOpen] = useState(false);

  const closeModal = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!trigger) {
      setOpen(true);
    }
  }, [trigger]);

  return (
    <Dialog open={open} onOpenChange={(o) => setOpen(o)}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent {...props}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        {children}
        {footer ? (
          <DialogFooter>
            {typeof footer === "function" ? footer({ closeModal }) : footer}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
