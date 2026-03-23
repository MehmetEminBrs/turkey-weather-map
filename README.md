# Türkiye Hava Durumu Haritası 

Bu proje, Türkiye haritası üzerinde şehir seçerek anlık ve 5 günlük hava durumu tahminlerini görebileceğiniz interaktif bir web uygulamasıdır.  
React + TypeScript + React Simple Maps + OpenWeather API kullanılarak geliştirilmiştir.

---

## Özellikler 

- Türkiye haritası üzerinde şehir seçebilme
- Hava durumu modal’ı ile anlık ve 5 günlük tahmin
- Hava durumuna göre emoji ve renkli gradyan arka plan
- Responsive tasarım (PC ve mobil uyumlu)
- OpenWeather API entegrasyonu

---

## Teknolojiler 

- [React 19]
- [TypeScript]
- [React Simple Maps]
- [Axios]
- [React Modal]
- [OpenWeather API](https://openweathermap.org/api)
- CSS (Tailwind + custom styling)

---
## Proje Yapısı :

```text
weather-map-app/
├─ frontend/
│ ├─ src/
│ ├─ public/
│ ├─ .env ← buraya yazın
│ └─ package.json
└─ screenshot/
```


## Kurulum 
```bash
cd weather-map-app/frontend
npm install
.env dosyasını oluşturun ve API anahtarınızı ekleyin:
REACT_APP_WEATHER_API_KEY=SİZE AİT ANAHTARI YAZINIZ
npm start
```



## API key almak için:

OpenWeather(https://openweathermap.org/api) sitesine gidin.
Hesap oluşturun veya giriş yapın.
“API keys” bölümünden yeni bir key oluşturun.
Yukarıdaki .env dosyasına bu key’i yapıştırın.
