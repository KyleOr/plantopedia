"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./searchcomponent.module.css";

const dummySuggestions = [
  "Aloe Vera",
  "Basil",
  "Cactus",
  "Dandelion",
  "Fern",
  "Lavender",
  "Mint",
  "Snake Plant",
  "Spider Plant",
  "Tomato",
];

type PlantSuggestion = {
  id: number;
  common_name?: string;
  scientific_name?: string;
  other_name?: string;
};

export default function SearchComponent() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<PlantSuggestion[]>([]);
  const [placeholder, setPlaceholder] = useState("");
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  // Typewriter animation for cycling dummySuggestions
  useEffect(() => {
    let currentCharIndex = 0;
    let interval: NodeJS.Timeout;

    const typeNextSuggestion = () => {
      const suggestion = `Search for ${dummySuggestions[suggestionIndex]}...`;
      setPlaceholder("");

      interval = setInterval(() => {
        currentCharIndex++;
        setPlaceholder(suggestion.slice(0, currentCharIndex));

        if (currentCharIndex >= suggestion.length) {
          clearInterval(interval);
          setTimeout(() => {
            setSuggestionIndex((prev) => (prev + 1) % dummySuggestions.length);
          }, 3000);
        }
      }, 80);
    };

    typeNextSuggestion();
    return () => clearInterval(interval);
  }, [suggestionIndex]);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setQuery(input);

    if (!input) {
      setFiltered([]);
      return;
    }

    try {
      const res = await fetch(
        `/api/search-plants?q=${encodeURIComponent(input)}`
      );
      const data = await res.json();

      if (data && Array.isArray(data.data)) {
        const suggestions = (data.data as PlantSuggestion[]).filter((plant) => {
          const name = (
            plant.common_name ||
            plant.scientific_name ||
            plant.other_name ||
            ""
          ).toLowerCase();
          return name.startsWith(input.toLowerCase());
        });

        setFiltered(suggestions);
      } else {
        setFiltered([]);
      }
    } catch (error) {
      console.error("Error fetching plant suggestions:", error);
      setFiltered([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && filtered.length > 0) {
      router.push(`/plant/${filtered[0].id}`);
      setFiltered([]);
    }
  };

  const handleSelect = (plant: PlantSuggestion) => {
    setQuery(
      plant.common_name || plant.scientific_name || plant.other_name || ""
    );
    setFiltered([]);
    router.push(`/plant/${plant.id}`);
  };

  return (
    <div className={styles.searchWrapper}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={styles.searchInput}
        placeholder={placeholder}
        autoComplete="off"
      />

      <AnimatePresence>
        {filtered.length > 0 && (
          <motion.ul
            className={styles.dropdown}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {filtered.map((plant, idx) => (
              <li
                key={plant.id}
                onClick={() => handleSelect(plant)}
                className={styles.suggestion}
              >
                {plant.common_name || plant.scientific_name || plant.other_name}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
