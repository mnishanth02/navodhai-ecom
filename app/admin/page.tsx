import Loader from "@/components/common/loader";
import { validateUserStore } from "@/data/helper/store-helper";
import { Suspense } from "react";
import StoreCheck from "./components/store-check";

const SetupPage = async () => {
  const { store } = await validateUserStore();

  return (
    <>
      <Suspense fallback={<Loader />}>
        <StoreCheck store={store} />
      </Suspense>
    </>
  );
};

export default SetupPage;
