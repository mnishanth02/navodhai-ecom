import CartSummary from "@/components/root/checkout/cart-summary";
import CheckoutClient from "@/components/root/checkout/checkout-client";
import ProductList from "@/components/root/product-list";
import { Separator } from "@/components/ui/separator";
import { getProducts } from "@/data/actions/ui-store.actions";
import type { Metadata } from "next";

// Set revalidation time to 1 hour for recommended products
export const revalidate = 3600;

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "Checkout | Navodhai Store",
  description: "Complete your purchase securely.",
  robots: {
    index: false, // Don't index checkout pages
    follow: false,
  },
};

async function CheckoutPage() {
  // Fetch recommended products
  const recommendedProducts = await getProducts({
    isFeatured: true,
  });

  return (
    <div className="wrapper">
      <div className="flex flex-col gap-8 pb-10">
        <div className="flex flex-col gap-4">
          <h1 className="font-bold text-3xl">Checkout</h1>
          <Separator />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Product List and Form Section */}
          <div className="lg:col-span-7">
            <CheckoutClient />
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-5">
            <CartSummary />
          </div>
        </div>

        {/* Recommended Products Section */}
        <div className="mt-16">
          <ProductList title="Recommended Products" items={recommendedProducts} />
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
