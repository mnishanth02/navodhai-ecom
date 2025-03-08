import BillboardForm from "./components/billboard-form";
import { getBillboardByIdQuery } from "@/data/data-access/billboard.queries";

interface BillboardPageProps {
    params: Promise<{ billboardId: string }>
}

const BillboardPage = async ({ params }: BillboardPageProps) => {

    const { billboardId } = await params;

    console.log(`billboardId: ${billboardId}`);
    const billboard = await getBillboardByIdQuery(billboardId);
    console.log(billboard);

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">

            <BillboardForm initialData={ billboard?.success ? billboard.data : null } />
        </div>
    )
}

export default BillboardPage;