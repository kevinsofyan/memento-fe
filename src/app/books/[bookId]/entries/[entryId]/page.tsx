import { MainLayout } from "@/components/layouts/MainLayout";
import { EntryEditor } from "@/components/journal/EntryEditor";
import { entriesServerService } from "@/lib/api/server-services";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { IEntry } from "@/types/journal";
import { redirect } from "next/navigation";

interface EditEntryPageProps {
  params: Promise<{
    bookId: string;
    entryId: string;
  }>;
}

export default async function EditEntryPage({ params }: EditEntryPageProps) {
  const { bookId, entryId } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["getEntry", entryId],
    queryFn: () => entriesServerService.getById(entryId),
  });

  const entry = queryClient.getQueryData<IEntry>(["getEntry", entryId]);

  if (!entry) redirect(`/books/${bookId}/entries`);

  const dehydratedState = dehydrate(queryClient);

  return (
    <MainLayout>
      <HydrationBoundary state={dehydratedState}>
        <div className="container mx-auto px-4 sm:px-8 py-12 max-w-7xl">
          <EntryEditor bookId={bookId} entry={entry} />
        </div>
      </HydrationBoundary>
    </MainLayout>
  );
}
