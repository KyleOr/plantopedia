"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import styles from "../plantpage.module.css";

type PlantDetail = {
  common_name?: string;
  scientific_name?: string;
  description?: string;
  default_image?: {
    original_url?: string;
    regular_url?: string;
    medium_url?: string;
    small_url?: string;
    thumbnail?: string;
  };
};

export default function PlantPage() {
  const params = useParams();
  const router = useRouter();
  const plantIdRaw = params.plantId;
  const plantId = Array.isArray(plantIdRaw) ? plantIdRaw[0] : plantIdRaw;

  const [plant, setPlant] = useState<PlantDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!plantId || typeof plantId !== "string") {
      router.push("/404"); // redirect if invalid ID
      return;
    }

    async function fetchPlant() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`/api/plant-details?id=${plantId}`);

        if (res.status === 404 || res.status === 429) {
          router.push("/404");
          return;
        }

        if (!res.ok) {
          throw new Error(`Failed to fetch plant data: ${res.status}`);
        }

        const data = await res.json();

        if (!data) {
          router.push("/404"); // fallback if data is unexpectedly null
          return;
        }

        setPlant(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error");
        }
        setPlant(null);
      } finally {
        setLoading(false);
      }
    }

    fetchPlant();
  }, [plantId, router]);

  if (loading) return <p>Loading plant details...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!plant) return <p>No data found.</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>
        {plant.common_name || plant.scientific_name}
      </h1>
      <p className={styles.subheading}>
        <i>{plant.scientific_name}</i>
      </p>
      {plant.default_image?.original_url && (
        <img
          src={plant.default_image.original_url}
          alt={plant.common_name || plant.scientific_name}
          className={styles.image}
        />
      )}
      {plant.description && (
        <p className={styles.description}>{plant.description}</p>
      )}
    </div>
  );
}
