import { MainLayout } from "@/components/layouts/MainLayout";
import { EntryEditor } from "@/components/journal/EntryEditor";

interface NewEntryPageProps {
  params: Promise<{
    bookId: string;
  }>;
}

export default async function NewEntryPage({ params }: NewEntryPageProps) {
  const { bookId } = await params;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-8 py-12 max-w-7xl">
        <EntryEditor bookId={bookId} />
      </div>
    </MainLayout>
  );
}

