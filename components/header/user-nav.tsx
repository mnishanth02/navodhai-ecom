"use client";

import SignInButton from "../auth/signin-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { siteConfig } from "@/lib/config/site";
import { DEFAULT_SIGNIN_REDIRECT } from "@/lib/routes";
import { LogOut, Settings, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { JSX } from "react";

interface NavItem {
  title: string;
  href: string;
  icon: JSX.Element;
  shortcut?: string;
}

const navItems: NavItem[] = [
  {
    title: "Admin",
    href: "/admin",
    icon: <User className="mr-2 h-4 w-4" />,
    shortcut: "⌘A",
  },
  {
    title: "Profile",
    href: "/profile",
    icon: <User className="mr-2 h-4 w-4" />,
    shortcut: "⌘P",
  },
  {
    title: "Settings",
    href: "/settings",
    icon: <Settings className="mr-2 h-4 w-4" />,
    shortcut: "⌘S",
  },
];

export function UserNav() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  if (!session?.user) {
    return (
      <SignInButton asChild mode="modal">
        <Button variant="secondary" size="sm" className="h-8">
          Sign in
        </Button>
      </SignInButton>
    );
  }

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: DEFAULT_SIGNIN_REDIRECT });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={ session.user.image || "" } alt={ session.user.name || siteConfig.name } />
            <AvatarFallback className="bg-primary/10">
              { session.user.name?.charAt(0).toUpperCase() || "Z" }
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{ session.user.name }</p>
            <p className="text-muted-foreground text-xs leading-none">{ session.user.email }</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          { navItems.map((item) => (
            <DropdownMenuItem key={ item.href } onClick={ () => router.push(item.href) } className="cursor-pointer">
              { item.icon }
              <span>{ item.title }</span>
              { item.shortcut && (
                <span className="text-muted-foreground ml-auto text-xs tracking-widest">{ item.shortcut }</span>
              ) }
            </DropdownMenuItem>
          )) }
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={ handleSignOut } className="text-destructive focus:text-destructive cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <span className="text-muted-foreground ml-auto text-xs tracking-widest">⇧⌘Q</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
