import { useEffect, useMemo, useState } from "react";
import { getCountries } from "./api/countries";
import type { Country } from "./api/countries";
import { MorphingInfinity } from "./../@/components/loading-ui/morphing-infinity";
import styles from "./App.module.scss";

const REGIONS = [
  "Africa",
  "Americas",
  "Asia",
  "Europe",
  "Oceania",
] as const;

type Region = (typeof REGIONS)[number];

export default function App() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [region, setRegion] = useState<Region | "">("");
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getCountries();

        const sortedCountries = [...data].sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );

        setCountries(sortedCountries);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Не удалось загрузить список стран"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  const filteredCountries = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return countries.filter((country) => {
      const matchesSearch = country.name.common
        .toLowerCase()
        .includes(normalizedSearch);

      const matchesRegion =
        region === "" || country.region === region;

      return matchesSearch && matchesRegion;
    });
  }, [countries, search, region]);

  const resetFilters = () => {
    setSearch("");
    setRegion("");
  };

  if (loading) {
    return (
      <main className={styles.loading}>
        <MorphingInfinity className="size-32 text-white" />
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.error}>
        <div className={styles.errorContent}>
          <h1>Ошибка загрузки</h1>

          <p>{error}</p>

          <button onClick={() => window.location.reload()}>
            Попробовать снова
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1>Countries</h1>

            <p>
              Найдено стран:{" "}
              <strong>{filteredCountries.length}</strong>
            </p>
          </div>

          <button
            className={styles.resetButton}
            onClick={resetFilters}
            disabled={!search && !region}
          >
            Сбросить
          </button>
        </header>

        <section className={styles.filters}>
          <input
            type="search"
            placeholder="Поиск страны..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className={styles.regions}>
            {REGIONS.map((item) => (
              <button
                key={item}
                className={region === item ? styles.activeRegion : ""}
                onClick={() => setRegion(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {filteredCountries.length === 0 ? (
          <div className={styles.empty}>
            <h2>Страны не найдены</h2>

            <p>
              Попробуйте изменить запрос или фильтр.
            </p>
          </div>
        ) : (
          <section className={styles.grid}>
            {filteredCountries.map((country) => (
              <button
                key={country.name.common}
                className={styles.card}
                onClick={() => setSelectedCountry(country)}
              >
                <img
                  src={country.flags.svg || country.flags.png}
                  alt={`Флаг ${country.name.common}`}
                />

                <span>{country.name.common}</span>
              </button>
            ))}
          </section>
        )}
      </div>

      {selectedCountry && (
        <div
          className={styles.overlay}
          onClick={() => setSelectedCountry(null)}
        >
          <div
            className={styles.modal}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className={styles.close}
              onClick={() => setSelectedCountry(null)}
              aria-label="Закрыть"
            >
              ×
            </button>

            <img
              className={styles.modalFlag}
              src={
                selectedCountry.flags.svg ||
                selectedCountry.flags.png
              }
              alt={`Флаг ${selectedCountry.name.common}`}
            />

            <h2>{selectedCountry.name.common}</h2>

            <div className={styles.details}>
              <div>
                <span>Столица</span>

                <strong>
                  {selectedCountry.capital?.join(", ") ||
                    "Нет данных"}
                </strong>
              </div>

              <div>
                <span>Регион</span>

                <strong>{selectedCountry.region}</strong>
              </div>

              <div>
                <span>Население</span>

                <strong>
                  {selectedCountry.population.toLocaleString(
                    "ru-RU"
                  )}
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}