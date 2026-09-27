# Smart Recipe Finder

Browse recipes, save your own, search by ingredient or cook time, pull in real recipes from Spoonacular, and get an AI-generated recipe idea from ingredients you have on hand.

## What it does

- Browse and save your own recipes (name, ingredients, cook time), stored in Supabase
- Search saved recipes by ingredient keyword and/or maximum cook time
- Recipes with a cook time of 30 minutes or less get a "Quick Meal" badge
- Search real recipes via the Spoonacular API
- "Suggest something for me" — type in a few ingredients and get one AI-generated recipe idea (name + description)

## Tech stack

- **Frontend:** vanilla HTML/CSS/JavaScript (no framework, no build step)
- **Database:** [Supabase](https://supabase.com) (Postgres) for saved recipes
- **Recipe search:** [Spoonacular API](https://spoonacular.com/food-api)
- **AI recipe suggestions:** NVIDIA's OpenAI-compatible API, model `openai/gpt-oss-20b`
- **Backend:** [Netlify Functions](https://www.netlify.com/products/functions/) (serverless), so API keys stay server-side and are never exposed to the browser

## Running it locally

1. Install dependencies:
   ```
   npm install
   ```
2. Create a `.env` file in the project root (see [Environment variables](#environment-variables) below).
3. Start the app with the Netlify CLI, which serves the static site and runs the serverless functions together:
   ```
   netlify dev
   ```
4. Open the URL it prints (typically `http://localhost:8888`).

> Note: opening `index.html` directly or serving it with a plain static server (e.g. `python -m http.server`) will **not** work — the Spoonacular and AI-suggestion features depend on the Netlify functions, which only run under `netlify dev` (or once deployed to Netlify).

## Environment variables

Set these in a `.env` file in the project root (never committed — see `.gitignore`):

| Variable | Used for |
|---|---|
| `SPOONACULAR_API_KEY` | Spoonacular recipe search, called server-side from `netlify/functions/search.js` |
| `NVIDIA_API_KEY` | AI recipe suggestions via `openai/gpt-oss-20b`, called server-side from `netlify/functions/suggest.js` |

The Supabase Project URL and public/anon key are not secrets and are set directly in `db.js`.

## Live URL

_TBD — will be added after deployment (Module 9)._
