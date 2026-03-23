"use client";

import React, { useState, useCallback, useRef } from "react";
import { ComposableMap, Geographies, Geography, Annotation } from "react-simple-maps";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { geoCentroid } from "d3-geo";
import turkeyGeoData from "../data/turkey.json";
import WeatherModal from "./WeatherModal";

const COLORED_CITIES = new Set([
  "istanbul",
  "i\u0307stanbul",
  "ankara",
  "izmir",
  "i\u0307zmir",
]);

const getCityColor = (cityName: string): string => {
  const city = cityName.toLocaleLowerCase("tr").normalize("NFC");
  if (COLORED_CITIES.has(city)) return "#403aff";
  return "#cbc4c4";
};

export default function TurkeyMap() {
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback((cityName: string) => {
    setSelectedCity(cityName);
    setModalOpen(true);
  }, []);

  const handleMouseEnter = useCallback(
    (cityName: string, e: React.MouseEvent<SVGPathElement>) => {
      setHoveredCity(cityName);
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setTooltipPos({
          x: e.clientX - rect.left + 14,
          y: e.clientY - rect.top - 36,
        });
      }
    },
    []
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGPathElement>, cityName: string) => {
      if (hoveredCity !== cityName) return;
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setTooltipPos({
          x: e.clientX - rect.left + 14,
          y: e.clientY - rect.top - 36,
        });
      }
    },
    [hoveredCity]
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredCity(null);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full min-h-screen flex flex-col">

      <div className="flex items-center justify-center py-5 px-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 tracking-tight text-center">
          Türkiye Hava Durumu
        </h1>
      </div>

      <div className="w-full flex-1 px-2 sm:px-4 pb-4">
        <div className="w-full h-[260px] sm:h-[380px] md:h-[480px] lg:h-[560px] bg-slate-50 rounded-xl overflow-hidden shadow-inner border border-slate-200">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 2000, center: [35, 39] }}
            width={900}
            height={560}
            style={{ width: "100%", height: "100%" }}
          >
            <Geographies geography={turkeyGeoData}>
              {({ geographies }: { geographies: any[] }) =>
                geographies.map((geo: any) => {
                  const cityName: string = geo.properties.name;
                  if (["istanbul", "ankara", "izmir"].includes(cityName.toLowerCase())) {
                    console.log("CITY MATCH CHECK:", JSON.stringify(cityName));
                  }
                  const fillColor = getCityColor(cityName);
                  const centroid = geoCentroid(geo);

                  return (
                    <g key={geo.rsmKey}>
                      <Geography
                        geography={geo}
                        onClick={() => handleClick(cityName)}
                        onMouseEnter={(e: React.MouseEvent<SVGPathElement>) =>
                          handleMouseEnter(cityName, e)
                        }
                        onMouseMove={(e: React.MouseEvent<SVGPathElement>) =>
                          handleMouseMove(e, cityName)
                        }
                        onMouseLeave={handleMouseLeave}
                        style={{
                          default: {
                            fill: fillColor,
                            stroke: "#94a3b8",
                            strokeWidth: 0.5,
                            outline: "none",
                          },
                          hover: {
                            fill: fillColor,
                            stroke: "#64748b",
                            strokeWidth: 0.8,
                            opacity: 0.75,
                            cursor: "pointer",
                            outline: "none",
                          },
                          pressed: {
                            fill: fillColor,
                            outline: "none",
                            opacity: 0.6,
                          },
                        }}
                      />
                      <Annotation
                        subject={centroid}
                        dx={0}
                        dy={0}
                        connectorProps={{ stroke: "none" }}
                      >
                        <text
                          textAnchor="middle"
                          dominantBaseline="middle"
                          style={{
                            fontSize: "6px",
                            fontFamily: "sans-serif",
                            fill: "#1e293b",
                            pointerEvents: "none",
                            userSelect: "none",
                            fontWeight: 500,
                          }}
                        >
                          {cityName}
                        </text>
                      </Annotation>
                    </g>
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        </div>
      </div>

      {hoveredCity && (
        <div
          className="absolute z-30 pointer-events-none px-2.5 py-1 rounded-md text-sm font-medium shadow-md hidden sm:block"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y,
            background: "rgba(191, 191, 191, 0.88)",
            color: "#f8fafc",
            backdropFilter: "blur(4px)",
            whiteSpace: "nowrap",
            transform: "translateY(-4px)",
          }}
        >
        </div>
      )}

      {selectedCity && (
        <WeatherModal
          city={selectedCity}
          isOpen={modalOpen}
          onRequestClose={handleCloseModal}
        />
      )}
    </div>
  );
}