import { motion } from "framer-motion";
import { Cloud, Droplets, Wind, Eye, Gauge } from "lucide-react";
import { WeatherData, getWeatherIcon } from "@/lib/weather";

interface CurrentWeatherProps {
  data: WeatherData;
  location: string;
}

export function CurrentWeather({ data, location }: CurrentWeatherProps) {
  const icon = getWeatherIcon(data.current.weather_code);
  const feelsLike = Math.round(
    data.current.temperature -
      (data.current.wind_speed * 0.2 + (100 - data.current.humidity) * 0.1)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 backdrop-blur-md p-8"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 opacity-50" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-slate-300 text-sm mb-2">{location}</p>
            <p className="text-slate-400 text-xs">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-6xl"
          >
            {icon}
          </motion.div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-6xl font-bold text-white mb-2">
              {Math.round(data.current.temperature)}°C
            </p>
            <p className="text-cyan-300 text-sm font-medium">
              {data.current.weather_description}
            </p>
            <p className="text-slate-400 text-xs mt-1">
              Feels like {feelsLike}°C
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
              <Droplets className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-xs text-slate-400">Humidity</p>
                <p className="text-sm font-semibold text-white">
                  {data.current.humidity}%
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50">
              <Wind className="w-5 h-5 text-teal-400" />
              <div>
                <p className="text-xs text-slate-400">Wind Speed</p>
                <p className="text-sm font-semibold text-white">
                  {Math.round(data.current.wind_speed)} km/h
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}