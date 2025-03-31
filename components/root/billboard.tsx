import type { BillboardType } from "@/drizzle/schema/store";
import { cn } from "@/lib/utils";

interface BillboardProps {
  data: BillboardType;
  className?: string;
  loading?: boolean;
}

const Billboard: React.FC<BillboardProps> = ({ data, className, loading }) => {
  if (loading) {
    return (
      <div className="animate-pulse overflow-hidden rounded-xl p-4 sm:p-6">
        <div className="aspect-square md:aspect-[2.4/1]" />
      </div>
    );
  }

  if (!data || !data.primaryImageUrl) {
    return null;
  }

  return (
    <div className={cn("overflow-hidden rounded-xl p-4 sm:p-6", className)}>
      <div
        className="group relative aspect-square overflow-hidden rounded-xl bg-cover md:aspect-[2.4/1]"
        style={{ backgroundImage: `url(${data.primaryImageUrl})` }}
      >
        {/* <div className="absolute inset-0 transition-opacity" /> */}
      </div>
    </div>
  );
};

export default Billboard;
