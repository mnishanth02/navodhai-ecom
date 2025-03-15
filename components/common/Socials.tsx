import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Facebook, Instagram, Youtube } from "lucide-react";
import Link from "next/link";
import type { JSX } from "react";

interface SocialLink {
  path: string;
  name: string;
  icon: JSX.Element;
  label: string;
}

interface SocialsProps {
  containerStyle?: string;
  iconStyle?: string;
}

const socialLinks: SocialLink[] = [
  {
    path: "https://youtube.com/@zealer",
    name: "YouTube",
    icon: <Youtube className="h-4 w-4" />,
    label: "Follow us on YouTube",
  },
  {
    path: "https://instagram.com/zealer",
    name: "Instagram",
    icon: <Instagram className="h-4 w-4" />,
    label: "Follow us on Instagram",
  },
  {
    path: "https://facebook.com/zealer",
    name: "Facebook",
    icon: <Facebook className="h-4 w-4" />,
    label: "Follow us on Facebook",
  },
];

export function Socials({ containerStyle, iconStyle }: SocialsProps) {
  return (
    <div className={cn("flex items-center gap-4", containerStyle)}>
      <TooltipProvider>
        {socialLinks.map((social) => (
          <Tooltip key={social.path}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8 rounded-full", iconStyle)}
                asChild
              >
                <Link
                  href={social.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                >
                  {social.icon}
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{social.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
}
