import { Skeleton } from "@/components/ui/skeleton";

export const ContactTabsSkeleton = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="flex flex-col items-center gap-16">
        {/* Tabs List Skeleton */}
        <div className="flex justify-center">
          <div className="p-1.5 bg-muted/20 backdrop-blur-md rounded-2xl border border-border/40">
            <div className="flex h-11 gap-1">
              <Skeleton className="w-32 h-full rounded-xl" />
              <Skeleton className="w-32 h-full rounded-xl" />
            </div>
          </div>
        </div>

        {/* Content Area Skeleton */}
        <div className="w-full bg-card/40 backdrop-blur-md rounded-[2.5rem] border border-border/40 p-10 md:p-14">
          <div className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-8 w-1/3 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>

            <Skeleton className="h-14 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
