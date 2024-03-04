"use client"
import { useState, FormEvent } from "react";

type ResultType = {
  age: string | number;
  gender: string;
  country: string;
} | null;

export default function Home() {
  const [name, setName] = useState<string>("");
  const [result, setResult] = useState<ResultType>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const ageResponse = await fetch(`https://api.agify.io?name=${name}`);
      const ageData = ageResponse.ok
        ? await ageResponse.json()
        : { age: "Unknown" };

      const genderResponse = await fetch(
        `https://api.genderize.io?name=${name}`
      );
      const genderData = genderResponse.ok
        ? await genderResponse.json()
        : { gender: "Unknown" };

      const countryResponse = await fetch(
        `https://api.nationalize.io?name=${name}`
      );
      const countryData = countryResponse.ok
        ? await countryResponse.json()
        : { country: [{ country_id: "Unknown" }] };

      setResult({
        age: ageData.age,
        gender: genderData.gender,
        country: countryData.country[0]?.country_id,
      });
    } catch (error: any) {
      setError(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <label htmlFor="name" className="font-semibold">
            Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Guess
          </button>
        </form>
        {loading && <p className="mt-4">Loading...</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}
        {result && (
          <div className="mt-4">
            <p className="text-lg">
              Age: <span className="font-semibold">{result.age}</span>
            </p>
            <p className="text-lg">
              Gender: <span className="font-semibold">{result.gender}</span>
            </p>
            <p className="text-lg">
              Country: <span className="font-semibold">{result.country}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
