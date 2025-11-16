import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";
import {
  authServerService,
  booksServerService,
  entriesServerService,
} from "@/lib/api/server-services";
import { MainLayoutClient } from "./MainLayoutClient";
import { IUser } from "@/types/user";

interface MainLayoutProps {
  children: React.ReactNode;
}

export async function MainLayout({ children }: MainLayoutProps) {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["userServer"],
      queryFn: authServerService.me,
    }),
    queryClient.prefetchQuery({
      queryKey: ["booksServer", { limit: 100 }],
      queryFn: () => booksServerService.getAll({ limit: 100 }),
    }),
    queryClient.prefetchQuery({
      queryKey: ["entriesServer", { limit: 100 }],
      queryFn: () => entriesServerService.getAll({ limit: 100 }),
    }),
  ]);

  const user = queryClient.getQueryData<IUser>(["userServer"]);

  if (!user) {
    redirect("/login");
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <MainLayoutClient>{children}</MainLayoutClient>
    </HydrationBoundary>
  );
}
