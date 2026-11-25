import { Skeleton } from "@/components/ui/skeleton";

export const ContactTabsSkeleton = () => {
  return (
    <div className="w-full space-y-8">
      {/* Tabs List Skeleton */}
      <div className="flex justify-center">
        <div className="p-1 bg-white/80 rounded-full border border-border/60">
          <div className="flex h-10 gap-1">
            <Skeleton className="w-36 h-full rounded-full" />
            <Skeleton className="w-36 h-full rounded-full" />
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="w-full max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-[560px] w-full rounded-2xl" />
      </div>
    </div>
  );
};
