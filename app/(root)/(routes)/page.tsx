import Billboard from "@/components/root/billboard";
import ProductList from "@/components/root/product-list";
import { getProducts } from "@/data/actions/ui-store.actions";
import { getAllBillBoardByStoreIdQuery } from "@/data/data-access/billboard.queries";
import { env } from "@/data/env/server-env";
import type { Metadata } from "next";

// Set to false for static generation
export const revalidate = false;

// Generate metadata for SEO
export const metadata: Metadata = {
  title: "Navodhai Store | Home",
  description: "Discover our featured products and latest collections.",
  openGraph: {
    title: "Navodhai Store | Home",
    description: "Discover our featured products and latest collections.",
    type: "website",
  },
};

const HomePage = async () => {
  // Get featured products
  const products = await getProducts({ isFeatured: true });

  // Get the first active billboard from the store
  const billboardsResponse = await getAllBillBoardByStoreIdQuery(env.DEFAULT_STORE_ID);
  const billboard =
    billboardsResponse.success && billboardsResponse.data?.[0] ? billboardsResponse.data[0] : null;

  return (
    <div className="wrapper">
      <div className="space-y-10 pb-10">
        {billboard && <Billboard data={billboard} />}

        <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
          <ProductList title="Featured Products" items={products} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
