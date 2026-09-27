const OpenAI = require("openai");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed. Use POST." }),
    };
  }

  const apiKey = process.env.NVIDIA_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server is missing NVIDIA_API_KEY." }),
    };
  }

  let ingredients;
  try {
    const parsed = JSON.parse(event.body || "{}");
    ingredients = parsed.ingredients;
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid JSON body." }),
    };
  }

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Body must include a non-empty 'ingredients' array." }),
    };
  }

  const client = new OpenAI({
    apiKey,
    baseURL: "https://integrate.api.nvidia.com/v1",
  });

  try {
    const completion = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      temperature: 0.7,
      messages: [
        {
          role: "system",
          content:
            'You are a recipe idea generator. Given a list of ingredients, respond with exactly one JSON object with two fields: "name" (a short recipe title) and "description" (a one- or two-sentence description of the dish). Respond with only the JSON object and nothing else.',
        },
        {
          role: "user",
          content: `Ingredients: ${ingredients.join(", ")}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content?.trim() || "";

    let idea;
    try {
      idea = JSON.parse(raw);
    } catch (err) {
      return {
        statusCode: 502,
        body: JSON.stringify({ error: "Model returned an unparseable response.", raw }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(idea),
    };
  } catch (err) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: "Failed to reach NVIDIA API.", detail: err.message }),
    };
  }
};
