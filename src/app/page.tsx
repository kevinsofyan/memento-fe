import { Suspense } from "react";
import { MainLayout } from "@/components/layouts/MainLayout";
import { HomeClient } from "./HomeClient";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

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
          <HomeClient />
        </Suspense>
      </div>
    </MainLayout>
  );
}
