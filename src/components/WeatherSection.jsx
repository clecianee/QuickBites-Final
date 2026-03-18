function WeatherSection({ weather, title, children }) {
  if (!weather) return null;

  return (
    <section>
      <p>
        Current temperature in {weather.city}: {weather.temperature}°F
      </p>
      <p>{title}</p>
      {children}
    </section>
  );
}

export default WeatherSection;