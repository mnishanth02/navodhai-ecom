import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "../ui/sidebar";
import { BreadCrumTitle } from "./breadcrum-title";

interface HeaderProps {
  className?: string;
  storeName?: string;
}

export function Header({ storeName }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/admin">{storeName}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadCrumTitle />
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
