"use client";

import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import axios from "axios";

if (typeof window !== "undefined") {
  Modal.setAppElement(document.body);
}

const API_KEY = process.env.REACT_APP_WEATHER_API_KEY;

type WeatherProps = {
  city: string;
  isOpen: boolean;
  onRequestClose: () => void;
};

type DailyForecast = {
  day: string;
  temp: number;
  condition: string;
};

const getEmoji = (cond: string) => {
  cond = cond.toLowerCase();
  if (cond.includes("rain") || cond.includes("yağmur")) return "🌧️";
  if (cond.includes("cloud") || cond.includes("bulut")) return "☁️";
  if (cond.includes("clear") || cond.includes("açık") || cond.includes("güneş")) return "☀️";
  if (cond.includes("snow") || cond.includes("kar")) return "❄️";
  if (cond.includes("thunder") || cond.includes("gök")) return "⛈️";
  if (cond.includes("fog") || cond.includes("sis")) return "🌫️";
  return "🌤️";
};

const getBg = (cond: string) => {
  cond = cond.toLowerCase();
  if (cond.includes("rain") || cond.includes("yağmur")) return "linear-gradient(135deg, #4b6cb7 0%, #182848 100%)";
  if (cond.includes("cloud") || cond.includes("bulut")) return "linear-gradient(135deg, #757F9A 0%, #D7DDE8 100%)";
  if (cond.includes("clear") || cond.includes("açık") || cond.includes("güneş")) return "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)";
  if (cond.includes("snow") || cond.includes("kar")) return "linear-gradient(135deg, #83a4d4 0%, #b6fbff 100%)";
  if (cond.includes("thunder") || cond.includes("gök")) return "linear-gradient(135deg, #232526 0%, #414345 100%)";
  if (cond.includes("fog") || cond.includes("sis")) return "linear-gradient(135deg, #606c88 0%, #3f4c6b 100%)";
  return "linear-gradient(135deg, #2980b9 0%, #6dd5fa 100%)";
};

const getTextColor = (cond: string) => {
  cond = cond.toLowerCase();
  if (cond.includes("cloud") || cond.includes("bulut")) return "#2d3748";
  if (cond.includes("clear") || cond.includes("açık") || cond.includes("güneş")) return "#7c4a00";
  if (cond.includes("snow") || cond.includes("kar")) return "#1a365d";
  return "#ffffff";
};

export default function WeatherModal({ city, isOpen, onRequestClose }: WeatherProps) {
  const [current, setCurrent] = useState<{ temp: number; feels_like: number; humidity: number; wind: number; condition: string } | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !city) return;

    setLoading(true);
    setError(null);
    setCurrent(null);
    setForecast([]);

    axios
      .get(`https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)},TR&limit=1&appid=${API_KEY}`)
      .then((geoRes) => {
        const geoData = geoRes.data;
        if (!geoData || geoData.length === 0) {
          setError("Şehir bulunamadı.");
          setLoading(false);
          return Promise.reject("no_city");
        }
        const { lat, lon } = geoData[0];
        return axios.get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=tr&appid=${API_KEY}`
        );
      })
      .then((res) => {
        if (!res) return;
        const data = res.data;

        setCurrent({
          temp: data.list[0].main.temp,
          feels_like: data.list[0].main.feels_like,
          humidity: data.list[0].main.humidity,
          wind: data.list[0].wind.speed,
          condition: data.list[0].weather[0].description,
        });

        const seen = new Set<string>();
        const daily: DailyForecast[] = [];
        const dayNames = ["Paz", "Pts", "Sal", "Çar", "Per", "Cum", "Cts"];

        data.list.forEach((item: any) => {
          const date = new Date(item.dt * 1000);
          const dateStr = date.toISOString().split("T")[0];
          if (!seen.has(dateStr) && daily.length < 5) {
            seen.add(dateStr);
            daily.push({
              day: dayNames[date.getDay()],
              temp: item.main.temp,
              condition: item.weather[0].description,
            });
          }
        });

        setForecast(daily);
        setLoading(false);
      })
      .catch((err) => {
        if (err !== "no_city") {
          console.error(err);
          setError("Hava durumu alınamadı.");
        }
        setLoading(false);
      });
  }, [city, isOpen]);

  const bg = current ? getBg(current.condition) : "linear-gradient(135deg, #2980b9 0%, #6dd5fa 100%)";
  const textColor = current ? getTextColor(current.condition) : "#ffffff";
  const isLight = textColor !== "#ffffff";

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Weather Modal"
      style={{
        overlay: {
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
          padding: "1rem",
          backdropFilter: "blur(6px)",
        },
        content: {
          position: "relative",
          inset: "unset",
          border: "none",
          borderRadius: "1.5rem",
          padding: 0,
          width: "100%",
          maxWidth: "min(560px, 95vw)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.35)",
          background: "transparent",
          overflow: "hidden",
        },
      }}
    >
      <div style={{ background: bg, padding: "2rem 1.75rem 1.5rem", color: textColor }}>
        <button
          onClick={onRequestClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            width: "2rem",
            height: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "50%",
            background: isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)",
            border: "none",
            cursor: "pointer",
            fontSize: "13px",
            color: textColor,
          }}
        >
          ✕
        </button>

        {loading && (
          <div style={{ textAlign: "center", padding: "2rem 0", opacity: 0.8 }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⏳</div>
            <p style={{ fontSize: "14px" }}>Yükleniyor...</p>
          </div>
        )}

        {error && (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚠️</div>
            <p style={{ fontSize: "14px" }}>{error}</p>
          </div>
        )}

        {!loading && !error && current && (
          <>
            <p style={{ fontSize: "13px", opacity: 0.75, marginBottom: "0.25rem", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Türkiye
            </p>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 700, margin: "0 0 1.25rem" }}>{city}</h2>

            <div style={{ display: "flex", alignItems: "flex-end", gap: "1rem" }}>
              <span style={{ fontSize: "5rem", lineHeight: 1 }}>{getEmoji(current.condition)}</span>
              <div>
                <div style={{ fontSize: "3.5rem", fontWeight: 800, lineHeight: 1 }}>
                  {Math.round(current.temp)}°
                </div>
                <div style={{ fontSize: "14px", opacity: 0.8, marginTop: "0.25rem", textTransform: "capitalize" }}>
                  {current.condition}
                </div>
              </div>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "0.75rem",
              marginTop: "1.5rem",
              background: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.15)",
              borderRadius: "1rem",
              padding: "1rem",
            }}>
              {[
                { label: "Hissedilen", value: `${Math.round(current.feels_like)}°` },
                { label: "Nem", value: `${current.humidity}%` },
                { label: "Rüzgar", value: `${current.wind.toFixed(1)} m/s` },
              ].map((stat) => (
                <div key={stat.label} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700 }}>{stat.value}</div>
                  <div style={{ fontSize: "11px", opacity: 0.7, marginTop: "2px" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {!loading && !error && forecast.length > 0 && (
        <div style={{ background: "#fff", padding: "1.25rem 1.75rem 1.5rem" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
            5 Günlük Tahmin
          </p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {forecast.map((f, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  background: "#f8fafc",
                  borderRadius: "0.875rem",
                  padding: "0.75rem 0.25rem",
                  border: "1px solid #e2e8f0",
                }}
              >
                <span style={{ fontSize: "11px", fontWeight: 600, color: "#64748b" }}>{f.day}</span>
                <span style={{ fontSize: "1.4rem", margin: "0.4rem 0" }}>{getEmoji(f.condition)}</span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#1e293b" }}>{Math.round(f.temp)}°</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  );
}