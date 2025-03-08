'use client'

import { usePathname } from "next/navigation";
import { BreadcrumbItem, BreadcrumbPage } from "@ui/breadcrumb";
import { BreadcrumbSeparator } from "@ui/breadcrumb";

export const BreadCrumTitle = () => {
    const pathname = usePathname();

    const getPageTitle = () => {
        if (!pathname) return "";

        // Split the pathname by '/'
        const segments = pathname.split('/').filter(Boolean);

        // If we only have the storeId, we're on the Overview page
        if (segments.length === 1) return "Overview";

        // Otherwise, get the last segment and capitalize it
        const lastSegment = segments[segments.length - 1];

        // Handle special cases for nested routes
        if (segments.length > 2) {
            // For routes like /{storeId}/products/categories
            if (segments[1] === "products" && lastSegment === "categories") return "Categories";
            if (segments[1] === "products" && lastSegment === "inventory") return "Inventory";
            if (segments[1] === "orders" && lastSegment === "abandoned") return "Abandoned Carts";
            if (segments[1] === "customers" && lastSegment === "groups") return "Customer Groups";
            if (segments[1] === "settings" && lastSegment === "advanced") return "Advanced Settings";
            if (segments[1] === "settings" && lastSegment === "payments") return "Payments";
            if (segments[1] === "settings" && lastSegment === "shipping") return "Shipping";
            if (segments[1] === "settings" && lastSegment === "taxes") return "Taxes";
        }

        // Default: capitalize the last segment
        return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
    };

    const pageTitle = getPageTitle();

    return (
        <>
            { pageTitle && (
                <>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{ pageTitle }</BreadcrumbPage>
                    </BreadcrumbItem>
                </>
            ) }
        </>
    )
}
