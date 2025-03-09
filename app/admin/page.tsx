import { validateUserStore } from "@/data/helper/store-helper";
import StoreCheck from "./components/store-check";
import { Suspense } from "react";
import Loader from "@/components/common/loader";

const SetupPage = async () => {
  const { store } = await validateUserStore();

  return (
    <>
      <Suspense fallback={ <Loader /> }>
        <StoreCheck store={ store } />;
      </Suspense>
    </>
  )

};

export default SetupPage;