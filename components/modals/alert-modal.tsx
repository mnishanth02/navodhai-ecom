"use client";

import { Button } from "../ui/button";
import { Modal } from "../ui/modal";
import { useMounted } from "@/hooks/use-mounted";
import { Loader2 } from "lucide-react";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
}

export const AlertModal = ({ isOpen, onClose, onConfirm, loading }: AlertModalProps) => {
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <Modal title="Are you sure?" description="This action cannot be undone." isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center justify-end gap-2 pt-6">
        <Button variant="outline" disabled={loading} onClick={onClose}>
          Cancel
        </Button>
        <Button variant="destructive" disabled={loading} onClick={onConfirm}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Confirm"}
        </Button>
      </div>
    </Modal>
  );
};
