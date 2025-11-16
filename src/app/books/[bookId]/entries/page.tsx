import { Suspense } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { EntriesHeader } from "./EntriesHeader";
import { EntriesClient } from "./EntriesClient";
import { entriesServerService } from "@/lib/api/server-services";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

interface EntriesPageProps {
  params: Promise<{
    bookId: string;
  }>;
}

async function EntriesContent({ bookId }: { bookId: string }) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["getEntries", { bookId }],
    queryFn: async () => {
      return entriesServerService.getAll({ bookId });
    },
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <EntriesHeader bookId={bookId} />
      <EntriesClient bookId={bookId} />
    </HydrationBoundary>
  );
}

function EntriesLoading() {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
  );
}

export default async function EntriesPage({ params }: EntriesPageProps) {
  const { bookId } = await params;

  return (
    <MainLayout>
      <div className="container mx-auto px-8 py-12">
        <Suspense fallback={<EntriesLoading />}>
          <EntriesContent bookId={bookId} />
        </Suspense>
      </div>
    </MainLayout>
  );
}
