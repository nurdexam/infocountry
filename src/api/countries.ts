import axios from "axios";

export interface Country {
  names: {
    common: string;
    official: string;
  };
  flag: {
    svg: string;
    png: string;
  };
  capitals: string[];
  region: string;
  population: number;
}

interface CountriesResponse {
  data: {
    objects: Country[];
    meta: {
      total: number;
      count: number;
      limit: number;
      offset: number;
      more: boolean;
    };
  };
}

const apiKey = import.meta.env.API_KEY;

export const getCountries = async (): Promise<Country[]> => {
  try {
    const response = await axios.get<CountriesResponse>(
      "https://api.restcountries.com/countries/v5",
      {
        params: {
          limit: 100,
        },
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return response.data.data.objects;
  } catch (error) {
    console.error("API error:", error);

    throw error;
  }
};