import { createFileRoute } from "@tanstack/react-router";
import { WeatherDashboard } from "@/components/weather/WeatherDashboard";

export const Route = createFileRoute("/weather")({
  head: () => ({
    meta: [
      { title: "Weather Dashboard — Nirpesh AI" },
      { name: "description", content: "Real-time weather data with forecasts" },
    ],
  }),
  component: WeatherDashboard,
});