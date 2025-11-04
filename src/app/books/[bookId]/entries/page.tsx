import { Suspense } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { EntriesHeader } from './EntriesHeader';
import { EntriesClient } from './EntriesClient';
import { CreateEntryDialog } from '@/components/journal/CreateEntryDialog';
import { booksServerService, entriesServerService } from '@/lib/api/server-services';
import { redirect } from 'next/navigation';
import { Book } from '@/types/journal';
interface EntriesPageProps {
  params: {
    bookId: string;
  };    
}

async function EntriesContent({ bookId }: { bookId: string }) {
  const [book, entriesResponse] = await Promise.all([
    booksServerService.getById(bookId), 
    entriesServerService.getAll({ bookId })
  ]);

  return (
    <>
      <EntriesHeader book={book} />
      <EntriesClient initialEntries={entriesResponse.data} />
      <CreateEntryDialog bookId={bookId} />
    </>
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

export default function EntriesPage({ params }: EntriesPageProps) {
  return (
    <MainLayout>
      <div className="container mx-auto px-8 py-12">
        <Suspense fallback={<EntriesLoading />}>
          <EntriesContent bookId={params.bookId} />
        </Suspense>
      </div>
    </MainLayout>
  );
}
