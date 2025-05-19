"use client";

import { useState } from "react";
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

export default function SearchComponent() {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setQuery(input);

    const matches = dummySuggestions.filter((plant) =>
      plant.toLowerCase().includes(input.toLowerCase())
    );
    setFiltered(input ? matches : []);
  };

  const handleSelect = (suggestion: string) => {
    setQuery(suggestion);
    setFiltered([]);
  };

  return (
    <div className={styles.searchWrapper}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        className={styles.searchInput}
        placeholder="Search for a plant..."
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
            {filtered.map((suggestion, idx) => (
              <li
                key={idx}
                onClick={() => handleSelect(suggestion)}
                className={styles.suggestion}
              >
                {suggestion}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
