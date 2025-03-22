// import Info from "@/components/info";
import Gallery from "@/components/root/gallery/index";
import Info from "@/components/root/info";
import ProductList from "@/components/root/product-list";
import { getProduct, getProducts } from "@/data/actions/ui-store.actions";
import { redirect } from "next/navigation";

interface ProductPagesProps {
  params: Promise<{ productId: string }>;
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
