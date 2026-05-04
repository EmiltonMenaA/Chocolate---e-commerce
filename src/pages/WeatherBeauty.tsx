import { useState, useEffect } from 'react'

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────
interface WeatherData {
  temperature: number
  humidity: number
  uvIndex: number
  weatherCode: number
  windspeed: number
  apparentTemperature: number
}

interface BeautyRecommendation {
  emoji: string
  title: string
  reason: string
  products: string[]
  tip: string
  urgency: 'alta' | 'media' | 'baja'
}

// ─────────────────────────────────────────────
// Helpers: decodificar WMO weather code
// ─────────────────────────────────────────────
function getWeatherLabel(code: number): { label: string; icon: string } {
  if (code === 0) return { label: 'Despejado', icon: '☀️' }
  if (code <= 2) return { label: 'Parcialmente nublado', icon: '⛅' }
  if (code <= 3) return { label: 'Nublado', icon: '☁️' }
  if (code <= 49) return { label: 'Niebla', icon: '🌫️' }
  if (code <= 67) return { label: 'Lluvia', icon: '🌧️' }
  if (code <= 77) return { label: 'Nieve', icon: '❄️' }
  if (code <= 82) return { label: 'Chubascos', icon: '🌦️' }
  return { label: 'Tormenta', icon: '⛈️' }
}

// ─────────────────────────────────────────────
// Lógica de recomendaciones de belleza
// ─────────────────────────────────────────────
function getBeautyRecommendations(weather: WeatherData): BeautyRecommendation[] {
  const recs: BeautyRecommendation[] = []

  // UV alto → Protector solar urgente
  if (weather.uvIndex >= 6) {
    recs.push({
      emoji: '🌞',
      title: 'Protección Solar Máxima',
      reason: `Índice UV de ${weather.uvIndex} — exposición muy alta al sol.`,
      products: ['Protector Solar SPF 50+', 'Serum Vitamina C Antioxidante', 'Crema con Color SPF'],
      tip: 'Aplica protector 20 min antes de salir y reaplica cada 2 horas.',
      urgency: 'alta',
    })
  } else if (weather.uvIndex >= 3) {
    recs.push({
      emoji: '🌤️',
      title: 'Protección Solar Moderada',
      reason: `Índice UV de ${weather.uvIndex} — siempre protege tu piel.`,
      products: ['Protector Solar SPF 30', 'BB Cream con SPF', 'Labial con FPS'],
      tip: 'Incluso en días nublados el UV penetra las nubes.',
      urgency: 'media',
    })
  }

  // Baja humedad → Hidratación intensa
  if (weather.humidity < 40) {
    recs.push({
      emoji: '💧',
      title: 'Hidratación Intensiva',
      reason: `Humedad del ${weather.humidity}% — el ambiente está muy seco.`,
      products: ['Crema Hidratante de Chocolate', 'Sérum Hialurónico', 'Aceite Facial Nutritivo'],
      tip: 'El ácido hialurónico necesita piel húmeda para actuar; aplícalo sobre piel levemente mojada.',
      urgency: 'alta',
    })
  } else if (weather.humidity >= 40 && weather.humidity < 60) {
    recs.push({
      emoji: '🌿',
      title: 'Hidratación de Mantenimiento',
      reason: `Humedad del ${weather.humidity}% — condiciones moderadas.`,
      products: ['Loción Hidratante Ligera', 'Tónico Equilibrante', 'Gel Hidratante'],
      tip: 'Una hidratación ligera es suficiente; no sobre-hidrates la piel grasa.',
      urgency: 'baja',
    })
  }

  // Alta humedad → Control de brillo / poros
  if (weather.humidity >= 75) {
    recs.push({
      emoji: '✨',
      title: 'Control de Brillo y Poros',
      reason: `Humedad del ${weather.humidity}% — el exceso de humedad puede generar brillo.`,
      products: ['Primer Matificante', 'Polvo Compacto Traslúcido', 'Limpiador Facial Suave'],
      tip: 'Opta por fórmulas oil-free y evita productos muy oclusivos en días húmedos.',
      urgency: 'media',
    })
  }

  // Temperatura baja → Nutrición / barrera lipídica
  if (weather.temperature < 15) {
    recs.push({
      emoji: '🍫',
      title: 'Nutrición Profunda para el Frío',
      reason: `${weather.temperature}°C — el frío reseca y debilita la barrera cutánea.`,
      products: ['Crema Hidratante de Chocolate', 'Aceite Corporal Aromático', 'Bálsamo Labial Nutritivo'],
      tip: 'Las cremas más ricas con ceramidas son ideales para reconstruir la barrera lipídica.',
      urgency: 'alta',
    })
  }

  // Temperatura alta → Frescura y ligereza
  if (weather.temperature > 28) {
    recs.push({
      emoji: '🌺',
      title: 'Rutina Ligera y Refrescante',
      reason: `${weather.temperature}°C — el calor aumenta la producción de sebo.`,
      products: ['Sérum Facial Ligero', 'Bruma Facial Refrescante', 'Limpiador Micelar'],
      tip: 'Simplifica tu rutina en días calurosos: menos capas, más eficiencia.',
      urgency: 'media',
    })
  }

  // Viento → Protección extra
  if (weather.windspeed > 25) {
    recs.push({
      emoji: '🌬️',
      title: 'Escudo contra el Viento',
      reason: `Viento a ${weather.windspeed} km/h — el viento deshidrata y irrita la piel.`,
      products: ['Crema Barrera Protectora', 'Bálsamo Labial Nutritivo', 'Aceite Facial Sellador'],
      tip: 'Finaliza tu rutina con un aceite o bálsamo que selle la humedad frente al viento.',
      urgency: 'media',
    })
  }

  // Si no hay condiciones extremas, dar recomendación general
  if (recs.length === 0) {
    recs.push({
      emoji: '🌸',
      title: 'Rutina Diaria Equilibrada',
      reason: 'Las condiciones climáticas hoy son ideales para tu piel.',
      products: ['Sérum Facial Premium', 'Crema Hidratante de Chocolate', 'Máscara Facial Detox'],
      tip: 'Aprovecha las condiciones perfectas para una mascarilla facial esta noche.',
      urgency: 'baja',
    })
  }

  return recs
}

// ─────────────────────────────────────────────
// Color por urgencia
// ─────────────────────────────────────────────
function urgencyColor(urgency: 'alta' | 'media' | 'baja') {
  if (urgency === 'alta') return { border: '#da0b43', bg: '#fff5f7', badge: '#da0b43' }
  if (urgency === 'media') return { border: '#d97706', bg: '#fffbeb', badge: '#d97706' }
  return { border: '#6F4E37', bg: '#fdf8f6', badge: '#6F4E37' }
}

// ─────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────
export default function WeatherBeauty() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [city, setCity] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [locationGranted, setLocationGranted] = useState(false)

  // Coordenadas de Bogotá como fallback
  const BOGOTA = { lat: 4.711, lon: -74.0721, name: 'Bogotá, Colombia' }

  async function fetchWeather(lat: number, lon: number, name: string) {
    setLoading(true)
    setError(null)
    try {
      // API gratuita de Open-Meteo — sin API key
      const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,apparent_temperature,relative_humidity_2m,` +
        `wind_speed_10m,weather_code,uv_index` +
        `&timezone=auto`

      const res = await fetch(url)
      if (!res.ok) throw new Error('No se pudo obtener el clima')
      const json = await res.json()
      const c = json.current

      setWeather({
        temperature: Math.round(c.temperature_2m),
        apparentTemperature: Math.round(c.apparent_temperature),
        humidity: Math.round(c.relative_humidity_2m),
        uvIndex: Math.round(c.uv_index ?? 0),
        windspeed: Math.round(c.wind_speed_10m),
        weatherCode: c.weather_code,
      })
      setCity(name)
      setLocationGranted(true)
    } catch (err) {
      setError('No se pudo obtener el clima. Mostrando datos de Bogotá.')
      // fallback silencioso
      await fetchWeather(BOGOTA.lat, BOGOTA.lon, BOGOTA.name)
    } finally {
      setLoading(false)
    }
  }

  async function getLocation() {
    setLoading(true)
    if (!navigator.geolocation) {
      fetchWeather(BOGOTA.lat, BOGOTA.lon, BOGOTA.name)
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        // Reverse geocoding gratuito con Open-Meteo Geocoding
        const { latitude, longitude } = pos.coords
        try {
          const geoRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
          const geoJson = await geoRes.json()
          const name =
            geoJson.address?.city ||
            geoJson.address?.town ||
            geoJson.address?.state ||
            'Tu ubicación'
          fetchWeather(latitude, longitude, name)
        } catch {
          fetchWeather(latitude, longitude, 'Tu ubicación')
        }
      },
      () => {
        fetchWeather(BOGOTA.lat, BOGOTA.lon, BOGOTA.name)
      }
    )
  }

  useEffect(() => {
    fetchWeather(BOGOTA.lat, BOGOTA.lon, BOGOTA.name)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ─── Render ───
  const weatherLabel = weather ? getWeatherLabel(weather.weatherCode) : null
  const recommendations = weather ? getBeautyRecommendations(weather) : []

  return (
    <div style={{ minHeight: '100vh', background: '#fdf8f6', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* ── Header ── */}
      <div style={{
        background: 'linear-gradient(135deg, #221015 0%, #432a22 50%, #6F4E37 100%)',
        padding: '48px 24px 64px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute', top: -60, right: -60, width: 200, height: 200,
          borderRadius: '50%', background: 'rgba(218,11,67,0.15)',
        }} />
        <div style={{
          position: 'absolute', bottom: -40, left: -40, width: 150, height: 150,
          borderRadius: '50%', background: 'rgba(111,78,55,0.3)',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <span style={{
            display: 'inline-block', background: 'rgba(218,11,67,0.2)',
            color: '#f2a7b8', fontSize: 12, fontWeight: 700, letterSpacing: 2,
            textTransform: 'uppercase', padding: '6px 16px', borderRadius: 999,
            marginBottom: 16, border: '1px solid rgba(218,11,67,0.3)',
          }}>
            🌐 Servicio Externo · Open-Meteo API
          </span>

          <h1 style={{ color: '#fff', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, margin: '0 0 12px' }}>
            Belleza Según el Clima 🌤️
          </h1>
          <p style={{ color: '#d2bab0', fontSize: 17, maxWidth: 520, margin: '0 auto 28px' }}>
            Detectamos las condiciones climáticas de tu ciudad en tiempo real
            para recomendarte los productos perfectos de hoy.
          </p>

          {!locationGranted && (
            <button
              onClick={getLocation}
              style={{
                background: '#da0b43', color: '#fff', border: 'none',
                padding: '12px 28px', borderRadius: 999, fontWeight: 700,
                fontSize: 15, cursor: 'pointer', transition: 'opacity .2s',
              }}
              onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseOut={e => (e.currentTarget.style.opacity = '1')}
            >
              📍 Usar mi ubicación actual
            </button>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 20px 60px' }}>

        {/* ── Weather Card ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{
              width: 56, height: 56, border: '4px solid #eaddd7',
              borderTopColor: '#da0b43', borderRadius: '50%',
              animation: 'spin 1s linear infinite', margin: '0 auto 16px',
            }} />
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            <p style={{ color: '#846358' }}>Consultando clima en tiempo real...</p>
          </div>
        ) : weather && weatherLabel ? (
          <>
            {/* Weather summary */}
            <div style={{
              background: '#fff', borderRadius: 20, padding: '32px',
              marginTop: -24, boxShadow: '0 8px 40px rgba(34,16,21,0.12)',
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 20, marginBottom: 32,
            }}>
              {/* Ciudad */}
              <div style={{ gridColumn: '1 / -1', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 28 }}>{weatherLabel.icon}</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: 22, color: '#221015' }}>
                      {city}
                    </p>
                    <p style={{ margin: 0, color: '#846358', fontSize: 14 }}>
                      {weatherLabel.label} · Datos en tiempo real vía{' '}
                      <a href="https://open-meteo.com" target="_blank" rel="noreferrer"
                        style={{ color: '#da0b43', textDecoration: 'none' }}>
                        Open-Meteo
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              {[
                { label: 'Temperatura', value: `${weather.temperature}°C`, sub: `Sensación ${weather.apparentTemperature}°C`, icon: '🌡️' },
                { label: 'Humedad', value: `${weather.humidity}%`, sub: weather.humidity < 40 ? 'Ambiente seco' : weather.humidity > 70 ? 'Ambiente húmedo' : 'Moderada', icon: '💧' },
                { label: 'Índice UV', value: weather.uvIndex, sub: weather.uvIndex < 3 ? 'Bajo' : weather.uvIndex < 6 ? 'Moderado' : weather.uvIndex < 8 ? 'Alto' : 'Muy alto', icon: '☀️' },
                { label: 'Viento', value: `${weather.windspeed} km/h`, sub: weather.windspeed > 25 ? 'Fuerte' : 'Moderado', icon: '🌬️' },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: '#fdf8f6', borderRadius: 14, padding: '16px 18px',
                }}>
                  <span style={{ fontSize: 24 }}>{stat.icon}</span>
                  <p style={{ margin: '8px 0 2px', fontWeight: 800, fontSize: 22, color: '#221015' }}>
                    {stat.value}
                  </p>
                  <p style={{ margin: 0, fontSize: 12, color: '#846358' }}>{stat.label}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#a18072' }}>{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* ── Recommendations ── */}
            <h2 style={{ fontWeight: 800, fontSize: 22, color: '#221015', marginBottom: 20 }}>
              🍫 Recomendaciones Personalizadas para Hoy
            </h2>

            <div style={{ display: 'grid', gap: 20 }}>
              {recommendations.map((rec, i) => {
                const colors = urgencyColor(rec.urgency)
                return (
                  <div key={i} style={{
                    background: colors.bg, border: `2px solid ${colors.border}`,
                    borderRadius: 18, padding: '24px 28px',
                    animation: `fadeUp .4s ease ${i * 0.1}s both`,
                  }}>
                    <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`}</style>

                    <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                      <h3 style={{ margin: 0, fontWeight: 800, fontSize: 19, color: '#221015' }}>
                        {rec.emoji} {rec.title}
                      </h3>
                      <span style={{
                        background: colors.badge, color: '#fff', fontSize: 11,
                        fontWeight: 700, padding: '3px 12px', borderRadius: 999,
                        textTransform: 'uppercase', letterSpacing: 1, alignSelf: 'center',
                      }}>
                        {rec.urgency === 'alta' ? '⚠️ Urgente' : rec.urgency === 'media' ? '💛 Recomendado' : '✅ Sugerido'}
                      </span>
                    </div>

                    <p style={{ margin: '0 0 16px', color: '#432a22', fontSize: 14 }}>
                      {rec.reason}
                    </p>

                    {/* Products */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
                      {rec.products.map(p => (
                        <span key={p} style={{
                          background: '#fff', border: '1.5px solid #eaddd7',
                          borderRadius: 999, padding: '6px 14px', fontSize: 13,
                          fontWeight: 600, color: '#432a22', cursor: 'pointer',
                          transition: 'all .15s',
                        }}
                          onMouseOver={e => {
                            e.currentTarget.style.background = colors.badge
                            e.currentTarget.style.color = '#fff'
                            e.currentTarget.style.borderColor = colors.badge
                          }}
                          onMouseOut={e => {
                            e.currentTarget.style.background = '#fff'
                            e.currentTarget.style.color = '#432a22'
                            e.currentTarget.style.borderColor = '#eaddd7'
                          }}
                        >
                          {p}
                        </span>
                      ))}
                    </div>

                    {/* Tip */}
                    <div style={{
                      background: 'rgba(255,255,255,0.7)', borderRadius: 10,
                      padding: '10px 14px', display: 'flex', gap: 8, alignItems: 'flex-start',
                    }}>
                      <span>💡</span>
                      <p style={{ margin: 0, fontSize: 13, color: '#6F4E37', fontStyle: 'italic' }}>
                        <strong>Tip experta:</strong> {rec.tip}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* CTA */}
            <div style={{
              textAlign: 'center', marginTop: 40, padding: '32px 24px',
              background: 'linear-gradient(135deg, #221015, #432a22)',
              borderRadius: 20, boxShadow: '0 8px 32px rgba(34,16,21,0.2)',
            }}>
              <p style={{ color: '#d2bab0', margin: '0 0 20px', fontSize: 16 }}>
                ¿Lista para cuidar tu piel hoy?
              </p>
              <a href="/catalog" style={{
                display: 'inline-block', background: '#da0b43', color: '#fff',
                textDecoration: 'none', padding: '14px 36px', borderRadius: 999,
                fontWeight: 800, fontSize: 16,
              }}>
                Ver Catálogo de Productos →
              </a>
            </div>

            {/* Refresh */}
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <button
                onClick={getLocation}
                style={{
                  background: 'none', border: '2px solid #eaddd7', color: '#846358',
                  padding: '10px 22px', borderRadius: 999, fontWeight: 600,
                  fontSize: 13, cursor: 'pointer',
                }}
              >
                🔄 Actualizar con mi ubicación
              </button>
            </div>
          </>
        ) : (
          <p style={{ textAlign: 'center', color: '#846358', padding: 40 }}>
            {error || 'No se pudo cargar el clima.'}
          </p>
        )}
      </div>
    </div>
  )
}
