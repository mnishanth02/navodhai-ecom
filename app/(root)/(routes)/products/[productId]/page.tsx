// import Info from "@/components/info";
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
  const productsResponse = await getAllProductsByStoreIdQuery(env.DEFAULT_STORE_ID);

  if (!productsResponse.success || !productsResponse.data) {
    return [];
  }

  return productsResponse.data.map((product) => ({
    productId: product.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPagesProps) {
  const { productId } = await params;
  const product = await getProduct(productId);

  if (!product) {
    return {
      title: "Product Not Found | Navodhai Store",
      description: "The requested product could not be found.",
    };
  }

  return {
    title: `${product.name} | Navodhai Store`,
    description: product.description || "View product details and make a purchase.",
  };
}

const ProductPage: React.FC<ProductPagesProps> = async ({ params }) => {
  const { productId } = await params;
  const product = await getProduct(productId);

  if (!product) {
    redirect("/products");
  }

  const suggestedProducts = await getProducts({
    categoryId: product?.category?.id,
  });

  return (
    <div className="wrapper">
      <div className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          <Gallery images={product.images} />

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
