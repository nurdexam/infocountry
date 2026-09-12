import { useEffect, useState } from "react";
import { getCountries } from "./api/countries";
import type { Country } from "./api/countries";
import { MorphingInfinity } from "./../@/components/loading-ui/morphing-infinity";

export default function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [, setLoadTime] = useState<number | null>(null);

  useEffect(() => {
    const startTime = performance.now();

    Promise.all([
      getCountries(),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ])
      .then(([data]) => {
        setCountries(data);
      })
      .catch((error) => {
        console.error(error);
        setError(error instanceof Error ? error.message : "Unknown error");
      })
      .finally(() => {
        setLoadTime(Math.round(performance.now() - startTime));
        setLoading(false);
      });
  }, []);


 return (<main className="h-screen w-full flex items-center justify-center bg-zinc-600/80">
 { loading ? (<div className="h-screen w-full flex items-center justify-center bg-zinc-600/80"><MorphingInfinity className="size-32 text-white" /></div>) : 
 (<div className="h-screen w-full flex items-center justify-center text-white bg-zinc-600/80"> 
      <div className="flex flex-col items-center justify-center gap-3 p-6">
        {countries.map((country) => (
          <div
            className="grid w-full max-w-md grid-cols-3 items-center justify-center rounded-md bg-zinc-700/60 px-4 py-3 text-lg text-white shadow-sm"
            key={country.names.common}
          >
            {country.names.common}
          </div>
        ))}
      </div>
      </div>)}
 </main>);
}
