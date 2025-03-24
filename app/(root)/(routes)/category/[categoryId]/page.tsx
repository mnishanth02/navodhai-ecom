import { ErrorBoundary } from "@/components/common/error-boundary";
import Loader from "@/components/common/loader";
import Billboard from "@/components/root/billboard";
import Filter from "@/components/root/category/filter";
import MobileFilters from "@/components/root/category/mobile-filters";
import NoResults from "@/components/root/no-results";
import ProductCard from "@/components/root/product-card";
import { getCategory, getColors, getProducts, getSizes } from "@/data/actions/ui-store.actions";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Cache for 1 hour

interface CategoryPageProps {
  params: Promise<{ categoryId: string }>;
  searchParams: Promise<{
    colorId?: string;
    sizeId?: string;
  }>;
}

// Metadata generation for SEO
export async function generateMetadata({ params }: CategoryPageProps) {
  const { categoryId } = await params;
  const category = await getCategory(categoryId);

  return {
    title: `${category?.name || "Category"} | Navodhai Store`,
    description: "Browse our collection",
  };
}

// Separate data fetching for better error handling and parallel loading
async function fetchCategoryData(categoryId: string) {
  const [category, sizes, colors] = await Promise.all([
    getCategory(categoryId),
    getSizes(),
    getColors(),
  ]);
  return { category, sizes, colors };
}

const CategoryPage: React.FC<CategoryPageProps> = async ({ params, searchParams }) => {
  const { categoryId } = await params;
  const { colorId, sizeId } = await searchParams;

  // Parallel data fetching
  const { category, sizes, colors } = await fetchCategoryData(categoryId);
  const products = await getProducts({ categoryId, colorId, sizeId });

  return (
    <div className="wrapper">
      <ErrorBoundary
        fallback={
          <div className="flex items-center justify-center p-4 text-red-500">
            Something went wrong loading the category
          </div>
        }
      >
        <Suspense fallback={<Loader />}>
          {category?.billboard && <Billboard data={category.billboard} />}
        </Suspense>

        <div className="px-4 pb-24 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-5 lg:gap-x-8">
            {/* Mobile Filters */}
            <Suspense fallback={<Loader />}>
              {sizes && colors && <MobileFilters sizes={sizes} colors={colors} />}
            </Suspense>

            {/* Desktop Filters */}
            <div className="hidden lg:block">
              <Suspense fallback={<Loader />}>
                <div className="space-y-6">
                  {sizes && <Filter valueKey="sizeId" name="Sizes" data={sizes} />}
                  {colors && <Filter valueKey="colorId" name="Colors" data={colors} />}
                </div>
              </Suspense>
            </div>

            {/* Products Grid */}
            <div className="mt-6 lg:col-span-4 lg:mt-0">
              <Suspense
                fallback={
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="h-[350px] animate-pulse rounded-xl bg-neutral-200" />
                    ))}
                  </div>
                }
              >
                {products.length === 0 ? (
                  <NoResults />
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {products.map((item) => (
                      <ProductCard key={item.id} data={item} />
                    ))}
                  </div>
                )}
              </Suspense>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </div>
  );
};

export default CategoryPage;
