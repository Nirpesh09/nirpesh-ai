import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWeatherByCoordinates, LocationData } from "@/lib/weather";
import { CurrentWeather } from "@/components/weather/CurrentWeather";
import { WeatherForecast } from "@/components/weather/WeatherForecast";
import { HourlyChart } from "@/components/weather/HourlyChart";
import { LocationSearch } from "@/components/weather/LocationSearch";
import { motion } from "framer-motion";
import { MapPin, AlertCircle, Loader } from "lucide-react";

const DEFAULT_LOCATION: LocationData = {
  name: "San Francisco",
  latitude: 37.7749,
  longitude: -122.4194,
  country: "United States",
  timezone: "America/Los_Angeles",
};

export function WeatherDashboard() {
  const [location, setLocation] = useState<LocationData>(DEFAULT_LOCATION);
  const [savedLocations, setSavedLocations] = useState<LocationData[]>([DEFAULT_LOCATION]);

  useEffect(() => {
    const saved = localStorage.getItem("weather_locations");
    if (saved) {
      try {
        setSavedLocations(JSON.parse(saved));
      } catch {
        setSavedLocations([DEFAULT_LOCATION]);
      }
    }
  }, []);

  const handleLocationSelect = (selectedLocation: LocationData) => {
    setLocation(selectedLocation);
    const updated = [
      selectedLocation,
      ...savedLocations.filter(
        (l) =>
          l.latitude !== selectedLocation.latitude ||
          l.longitude !== selectedLocation.longitude
      ),
    ].slice(0, 5);
    setSavedLocations(updated);
    localStorage.setItem("weather_locations", JSON.stringify(updated));
  };

  const { data: weatherData, isLoading, error } = useQuery({
    queryKey: ["weather", location.latitude, location.longitude],
    queryFn: () =>
      fetchWeatherByCoordinates(location.latitude, location.longitude),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-900 to-slate-950 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold">⛅</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Weather Dashboard</h1>
          </div>

          <LocationSearch onSelect={handleLocationSelect} currentLocation={location.name} />

          {/* Saved Locations */}
          {savedLocations.length > 1 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {savedLocations.map((loc) => (
                <button
                  key={`${loc.latitude}-${loc.longitude}`}
                  onClick={() => handleLocationSelect(loc)}
                  className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 ${
                    location.latitude === loc.latitude &&
                    location.longitude === loc.longitude
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50"
                      : "bg-slate-800/50 text-slate-300 border border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  {loc.name}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-20"
          >
            <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
          </motion.div>
        )}

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-300 font-medium">Failed to load weather</p>
              <p className="text-red-200/70 text-sm">
                Please try again or check your internet connection.
              </p>
            </div>
          </motion.div>
        )}

        {/* Weather Data */}
        {weatherData && !isLoading && (
          <div className="space-y-6">
            <CurrentWeather data={weatherData} location={location.name} />
            <WeatherForecast data={weatherData} />
            <HourlyChart data={weatherData} />
          </div>
        )}
      </div>
    </div>
  );
}