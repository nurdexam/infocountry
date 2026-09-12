import { useEffect, useState } from "react";
import { getCountries } from "./api/countries";
import type { Country } from "./api/countries";

function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCountries()
      .then((data) => {
        setCountries(data);
      })
      .catch((error) => {
        console.error(error);
        setError(error instanceof Error ? error.message : "Unknown error");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <main>Loading...</main>;
  }

  if (error) {
    return <main>Error: {error}</main>;
  }

  return (
    <main>
      <h1>Countries</h1>

      <p>Total: {countries.length}</p>

      {countries.map((country) => (
        <div key={country.names.common}>
          {country.names.common}
        </div>
      ))}
    </main>
  );
}

export default App;