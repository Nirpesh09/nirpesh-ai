import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function DefaultErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground grid place-items-center">
      <section className="w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold tracking-tight">This page recovered safely</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Nirpesh stopped a temporary error before it could leave the app blank.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/dashboard"
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            Dashboard
          </a>
        </div>
      </section>
    </main>
  );
}

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultErrorComponent,
  });

  return router;
};
