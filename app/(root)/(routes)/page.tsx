import Billboard from "@/components/root/billboard";
import ProductList from "@/components/root/product-list";
import { getBillboard, getProducts } from "@/data/actions/ui-store.actions";

// export const revalidate = 0;

const HomePage = async () => {
  const products = await getProducts({ isFeatured: true });
  const billboard = await getBillboard("9da2ad01-d285-47ed-9b4b-0000c10fa594");

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
