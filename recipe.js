import { isValidCookTime } from "./validation.js";

let recipes = [];
let supabase = null;

function showError(message) {
  const banner = document.getElementById("errorBanner");
  banner.textContent = message;
  banner.hidden = false;
}

function clearError() {
  document.getElementById("errorBanner").hidden = true;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function matchesSearch(recipe, ingredientQuery, maxTime) {
  const ing = ingredientQuery.trim().toLowerCase();
  if (ing && !recipe.ingredients.some(i => i.toLowerCase().includes(ing))) {
    return false;
  }
  if (maxTime !== null && !Number.isNaN(maxTime) && recipe.cook_time > maxTime) {
    return false;
  }
  return true;
}

function renderRecipes(list, gridId = "grid", emptyMsgId = "emptyMsg") {
  const grid = document.getElementById(gridId);
  const emptyMsg = document.getElementById(emptyMsgId);
  grid.innerHTML = "";

  emptyMsg.hidden = list.length > 0;

  for (const recipe of list) {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${escapeHtml(recipe.name)}</h3>
      <div class="meta">
        <span class="time-badge">${recipe.cook_time} min</span>
        ${recipe.cook_time <= 30 ? '<span class="quick-badge">Quick Meal</span>' : ""}
      </div>
      <p class="ingredients">${recipe.ingredients.map(escapeHtml).join(", ")}</p>
    `;
    grid.appendChild(card);
  }
}

function applyFilters() {
  const ingredientQuery = document.getElementById("ingredientSearch").value;
  const maxTimeRaw = document.getElementById("maxTime").value;
  const maxTime = maxTimeRaw === "" ? null : Number(maxTimeRaw);

  const filtered = recipes.filter(r => matchesSearch(r, ingredientQuery, maxTime));
  renderRecipes(filtered);
}

function initSearchControls() {
  document.getElementById("ingredientSearch").addEventListener("input", applyFilters);
  document.getElementById("maxTime").addEventListener("input", applyFilters);
  document.getElementById("clearSearch").addEventListener("click", () => {
    document.getElementById("ingredientSearch").value = "";
    document.getElementById("maxTime").value = "";
    applyFilters();
  });
}

async function loadRecipes() {
  try {
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .order("id");

    if (error) throw error;

    clearError();
    recipes = data;
    applyFilters();
  } catch (err) {
    console.error("Failed to load recipes from Supabase", err);
    showError("We couldn't load recipes right now. Please check your connection and try again later.");
  }
}

async function saveRecipe(recipe) {
  try {
    const { error } = await supabase.from("recipes").insert([recipe]);
    if (error) throw error;

    clearError();
    return true;
  } catch (err) {
    console.error("Failed to save recipe to Supabase", err);
    showError("We couldn't save your recipe right now. Please try again in a moment.");
    return false;
  }
}

function initSpoonacularSearch() {
  const form = document.getElementById("spoonacularForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const query = document.getElementById("spoonacularQuery").value.trim();
    if (!query) return;

    try {
      const res = await fetch(`/.netlify/functions/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Search failed.");

      clearError();
      renderRecipes(data, "spoonacularGrid", "spoonacularEmptyMsg");
    } catch (err) {
      console.error("Failed to search Spoonacular", err);
      showError("We couldn't search recipes right now. Please try again in a moment.");
    }
  });
}

function initSuggest() {
  const form = document.getElementById("suggestForm");
  const resultBox = document.getElementById("suggestResult");
  const nameEl = document.getElementById("suggestName");
  const descEl = document.getElementById("suggestDescription");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const ingredients = document.getElementById("suggestIngredients").value
      .split(",").map(s => s.trim()).filter(Boolean);

    if (ingredients.length === 0) return;

    resultBox.hidden = true;

    try {
      const res = await fetch("/.netlify/functions/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Suggestion failed.");

      clearError();
      nameEl.textContent = data.name;
      descEl.textContent = data.description;
      resultBox.hidden = false;
    } catch (err) {
      console.error("Failed to get a suggestion", err);
      showError("We couldn't get a suggestion right now. Please try again in a moment.");
    }
  });
}

function initAddForm() {
  const form = document.getElementById("addForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("rName").value.trim();
    const ingredients = document.getElementById("rIngredients").value
      .split(",").map(s => s.trim()).filter(Boolean);
    const cook_time = Number(document.getElementById("rCookTime").value);

    if (!name || ingredients.length === 0 || !cook_time) return;

    if (!isValidCookTime(cook_time)) {
      alert("Cook time can't be negative.");
      return;
    }

    const saved = await saveRecipe({ name, ingredients, cook_time });
    if (saved) {
      form.reset();
      await loadRecipes();
    }
  });
}

async function init() {
  initSearchControls();
  initAddForm();
  initSpoonacularSearch();
  initSuggest();

  try {
    ({ supabase } = await import("./db.js"));
  } catch (err) {
    console.error("Failed to initialize the database connection", err);
    showError("The recipe database is unavailable right now. Please try again later.");
    return;
  }

  await loadRecipes();
}

init();
