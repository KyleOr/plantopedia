const BASE_URL = 'https://perenual.com/api/species-list';
const API_KEY = 'sk-6AmR682b43f7aac6910542';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Missing query param' }),
        { status: 400 }
      );
    }

    // Construct Perenual API URL
    const url = `${BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(query)}`;

    const res = await fetch(url);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Perenual API error ${res.status}:`, errorText);
      return new Response(
        JSON.stringify({ error: `Perenual API error: ${res.status}` }),
        { status: res.status }
      );
    }

    const data = await res.json();

    // Return the full data or you can filter down here if you want
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Perenual API fetch failed:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}
