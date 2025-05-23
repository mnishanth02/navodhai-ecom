import { cn } from "@/lib/utils";
import type { ReactElement } from "react";

interface IconButtonProps {
  onClick?: () => void;
  icon?: ReactElement;
  className?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, icon, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center justify-center rounded-full border bg-white p-2 shadow-md transition hover:scale-110",
        className,
      )}
    >
      {icon}
    </button>
  );
};

export default IconButton;
