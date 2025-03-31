import Gallery from "@/components/root/gallery/index";
import Info from "@/components/root/info";
import ProductList from "@/components/root/product-list";
import { getProduct, getProducts } from "@/data/actions/ui-store.actions";
import { getAllProductsByStoreIdQuery } from "@/data/data-access/products.queries";
import { env } from "@/data/env/server-env";
import { redirect } from "next/navigation";

// Set revalidation time to 24 hours since product details rarely change
export const revalidate = 86400;

interface ProductPagesProps {
  params: Promise<{ productId: string }>;
}

// Generate static paths for all products
export async function generateStaticParams() {
  try {
    const productsResponse = await getAllProductsByStoreIdQuery(env.DEFAULT_STORE_ID);

    if (!productsResponse.success || (productsResponse.success && !productsResponse.data)) {
      console.error("Failed to fetch products for static generation:");
      return [];
    }

    const validProducts = productsResponse.data
      ? productsResponse.data.filter(
          (product): product is NonNullable<typeof product> =>
            product != null &&
            typeof product === "object" &&
            "id" in product &&
            typeof product.id !== "undefined" &&
            typeof product.id === "string",
        )
      : [];

    if (validProducts.length === 0) {
      console.warn("No valid products found for static generation");
    }

    return validProducts.map((product) => ({
      productId: product.id,
    }));
  } catch (error) {
    console.error("Error during static generation:", error);
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPagesProps) {
  const { productId } = await params;

  try {
    const product = await getProduct(productId);

    if (!product) {
      console.warn(`Product not found during metadata generation: ${productId}`);
      return {
        title: "Product Not Found | Navodhai Store",
        description: "The requested product could not be found.",
        robots: "noindex",
      };
    }

    return {
      title: `${product.name} | Navodhai Store`,
      description: product.description || "View product details and make a purchase.",
      openGraph: {
        title: product.name,
        description: product.description || "View product details and make a purchase.",
        images: product.images?.[0]?.url ? [{ url: product.images[0].url }] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Error | Navodhai Store",
      description: "An error occurred while loading the product.",
      robots: "noindex",
    };
  }
}

const ProductPage: React.FC<ProductPagesProps> = async ({ params }) => {
  const { productId } = await params;
  const product = await getProduct(productId);

  if (!product) {
    console.warn(`Product not found during page render: ${productId}`);
    redirect("/products");
  }

  // Get suggested products based on category if available, otherwise get featured products
  const suggestedProducts = await getProducts({
    ...(product.category?.id ? { categoryId: product.category.id } : { isFeatured: true }),
  }).catch((error) => {
    console.error("Error fetching suggested products:", error);
    return [];
  });

  // Ensure product.images is always an array and validate image URLs
  const productImages = (product.images || []).filter(
    (image) => image && typeof image.url === "string" && image.url.length > 0,
  );

  return (
    <div className="wrapper">
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          <Gallery images={productImages} />
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <Info data={product} />
          </div>
        </div>
        <hr className="my-6" />
        <ProductList title="Related Items" items={suggestedProducts} />
      </div>
    </div>
  );
};

export default ProductPage;
