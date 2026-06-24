"use client";

import "leaflet/dist/leaflet.css";

import Link from "next/link";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

import { AQI_COLORS } from "@/constants/airsense";
import type { Station } from "@/types/airsense";

interface AQIMapProps {
  stations: Station[];
  className?: string;
  minHeight?: string;
}

export function AQIMap({
  stations,
  className,
  minHeight = "520px",
}: AQIMapProps) {
  if (stations.length === 0) {
    return (
      <div
        className="bg-muted/50 flex items-center justify-center"
        style={{ minHeight }}
      >
        <p className="text-muted-foreground text-sm">No station data available</p>
      </div>
    );
  }

  return (
    <MapContainer
      center={[3.139, 101.687]}
      zoom={10}
      className={className ?? "w-full"}
      style={{ minHeight }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {stations.map((station) => {
        const reading = station.latest_reading;
        const color = reading
          ? AQI_COLORS[reading.color_class] ?? "#94a3b8"
          : "#94a3b8";

        return (
          <CircleMarker
            key={station.id}
            center={[station.lat, station.lng]}
            radius={14}
            pathOptions={{
              color: "#fff",
              weight: 2,
              fillColor: color,
              fillOpacity: 0.92,
            }}
          >
            <Popup>
              <div className="space-y-2 p-1 text-sm">
                <p className="text-base font-semibold">{station.name}</p>
                <p
                  className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium text-white"
                  style={{ backgroundColor: color }}
                >
                  AQI {reading?.aqi ?? "N/A"} · {reading?.category ?? "Unknown"}
                </p>
                <Link
                  href={`/stations/${station.id}`}
                  className="text-primary block font-medium underline"
                >
                  View station details →
                </Link>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}
