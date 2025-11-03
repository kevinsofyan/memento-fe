import { Suspense } from 'react';
import { MainLayout } from '@/components/layouts/MainLayout';
import { BooksHeader } from './BooksHeader';
import { booksServerService } from '@/lib/api/server-services';
import { BookOpen } from 'lucide-react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { BooksContentClient } from './BooksContentClient';

async function BooksContent() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['books'],
    queryFn: booksServerService.getAll,
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <BooksContentClient/>
    </HydrationBoundary>
  );
}

function BooksLoading() {
  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
      ))}
    </div>
  );
}

export default function BooksPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-8 py-12">
        <BooksHeader />
        <Suspense fallback={<BooksLoading />}>
          <BooksContent />
        </Suspense>
      </div>
    </MainLayout>
  );
}
