import { promises as fs } from "fs";
import path from "path";

const BASE_URL = 'https://perenual.com/api/v2/species/details/';
const API_KEY = 'sk-6AmR682b43f7aac6910542';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(JSON.stringify({ error: "Missing plant id" }), { status: 400 });
    }

    // Serve mock data for test ID "9999"
    if (id === "9999") {
      const filePath = path.join(process.cwd(), "mock", "mockPlant.json");
      const fileContents = await fs.readFile(filePath, "utf8");
      const mockData = JSON.parse(fileContents);

      return new Response(JSON.stringify(mockData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fallback to live API
    const url = `${BASE_URL}${id}?key=${API_KEY}`;
    const res = await fetch(url);

    if (!res.ok) {
      const text = await res.text();
      console.error(`Perenual API detail error ${res.status}:`, text);
      return new Response(JSON.stringify({ error: "Perenual API error", details: text }), { status: res.status });
    }

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error fetching plant details:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
