// lib/trefle.js
const BASE_URL = 'https://trefle.io/api/v1';
const TOKEN = 'cXCgtqCml7frJnLmp7Hk7z25KLag66tDuLiySODbROU';

/**
 * Search for plants by name.
 * @param {string} query - Plant name to search.
 * @returns {Promise<object>} - The search results from Trefle.
 */
export async function searchPlants(query) {
  try {
    const res = await fetch(`${BASE_URL}/plants/search?token=${TOKEN}&q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error(`Trefle error: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Failed to search plants:', error);
    return null;
  }
}

/**
 * Get detailed plant info by ID.
 * @param {string} id - Plant ID from Trefle.
 * @returns {Promise<object>} - The plant details.
 */
export async function getPlantById(id) {
  try {
    const res = await fetch(`${BASE_URL}/plants/${id}?token=${TOKEN}`);
    if (!res.ok) throw new Error(`Trefle error: ${res.status}`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch plant by ID:', error);
    return null;
  }
}
