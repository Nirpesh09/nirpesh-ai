import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Redirecting to Nirpesh AI..." },
    ],
  }),
  component: RedirectPage,
});

function RedirectPage() {
  useEffect(() => {
    window.location.replace("https://nirdesh-max-motion--Nirpesh09.replit.app");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" />
        <p className="text-gray-400">Redirecting to Nirpesh AI...</p>
      </div>
    </div>
  );
}
