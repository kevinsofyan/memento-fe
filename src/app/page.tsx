import { Suspense } from 'react';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { MainLayout } from '@/components/layouts/MainLayout';
import { HomeClient } from './HomeClient';
import { authServerService, booksServerService, entriesServerService } from '@/lib/api/server-services';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { redirect } from 'next/navigation';

async function HomeContent() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['user'],
      queryFn: authServerService.me,
    }),
    queryClient.prefetchQuery({
      queryKey: ['books'],
      queryFn: booksServerService.getAll,
    }),
    // queryClient.prefetchQuery({
    //   queryKey: ['entries'],
    //   queryFn: () => entriesServerService.getAll(),
    // }),
  ]);

  const user = queryClient.getQueryData(['user']);
  if (!user) {
    redirect('/login');
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <HomeClient />
    </HydrationBoundary>
  );
}

function HomeLoading() {
  return (
    <>
      <div className="mb-12">
        <div className="h-12 w-96 bg-muted animate-pulse rounded mb-3" />
        <div className="h-6 w-64 bg-muted animate-pulse rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="h-20 bg-muted animate-pulse" />
            <CardContent className="h-16 bg-muted/50 animate-pulse mt-4" />
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader className="h-24 bg-muted animate-pulse" />
            <CardContent className="h-64 bg-muted/50 animate-pulse mt-4" />
          </Card>
        ))}
      </div>
    </>
  );
}

export default function HomePage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-8 py-12">
        <Suspense fallback={<HomeLoading />}>
          <HomeContent />
        </Suspense>
      </div>
    </MainLayout>
  );
}
