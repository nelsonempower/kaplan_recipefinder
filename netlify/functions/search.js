exports.handler = async (event) => {
  const apiKey = process.env.SPOONACULAR_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server is missing SPOONACULAR_API_KEY." }),
    };
  }

  const query = event.queryStringParameters && event.queryStringParameters.q;

  if (!query || !query.trim()) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing search term (query param 'q')." }),
    };
  }

  const url = new URL("https://api.spoonacular.com/recipes/complexSearch");
  url.searchParams.set("apiKey", apiKey);
  url.searchParams.set("query", query.trim());
  url.searchParams.set("addRecipeInformation", "true");
  url.searchParams.set("fillIngredients", "true");
  url.searchParams.set("number", "10");

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const detail = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Spoonacular request failed.", detail }),
      };
    }

    const data = await response.json();
    const results = (data.results || []).map((r) => ({
      id: `sp-${r.id}`,
      name: r.title,
      ingredients: (r.extendedIngredients || []).map((i) => i.name || i.original),
      cook_time: r.readyInMinutes ?? null,
    }));

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(results),
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: "Failed to reach Spoonacular.", detail: err.message }),
    };
  }
};
