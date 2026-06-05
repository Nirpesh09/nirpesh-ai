import { Component, useEffect, useState, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { installGlobalErrorReporter, reportError } from "@/lib/error-reporter";

type BoundaryState = {
  error: Error | null;
};

function normalizeError(error: unknown): Error {
  if (error instanceof Error) return error;
  if (typeof error === "string") return new Error(error);
  return new Error("Unexpected runtime error");
}

function FriendlyFallback({ error, onReset }: { error: Error | null; onReset: () => void }) {
  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground grid place-items-center">
      <section className="w-full max-w-md text-center">
        <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Nirpesh recovered safely</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          A temporary app error was stopped before it could blank the screen. Refresh this view or return to the dashboard.
        </p>
        {error?.message && (
          <p className="mt-4 rounded-lg border border-border bg-muted px-3 py-2 text-left text-xs text-muted-foreground">
            {error.message}
          </p>
        )}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </button>
          <a
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </a>
        </div>
      </section>
    </main>
  );
}

class ReactErrorBoundary extends Component<
  { children: ReactNode; resetKey: number; onError: (error: Error) => void },
  BoundaryState
> {
  state: BoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): BoundaryState {
    return { error: normalizeError(error) };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info);
    reportError(error, "react-boundary");
    this.props.onError(error);
  }

  componentDidUpdate(prevProps: { resetKey: number }) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return <FriendlyFallback error={this.state.error} onReset={() => window.location.reload()} />;
    }
    return this.props.children;
  }
}

export function GlobalErrorBoundary({ children }: { children: ReactNode }) {
  const [globalError, setGlobalError] = useState<Error | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    installGlobalErrorReporter();
    const onError = (event: ErrorEvent) => {
      event.preventDefault();
      const err = normalizeError(event.error ?? event.message);
      reportError(err, "window.onerror");
      setGlobalError(err);
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      const err = normalizeError(event.reason);
      reportError(err, "unhandledrejection");
      setGlobalError(err);
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  if (globalError) {
    return (
      <FriendlyFallback
        error={globalError}
        onReset={() => {
          setGlobalError(null);
          setResetKey((key) => key + 1);
        }}
      />
    );
  }

  return (
    <ReactErrorBoundary resetKey={resetKey} onError={setGlobalError}>
      {children}
    </ReactErrorBoundary>
  );
}