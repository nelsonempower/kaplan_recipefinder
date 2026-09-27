# Smart Recipe Finder — Requirements (v1)

## 1. Core features for v1

- Browse a list of preloaded recipes
- Search/filter recipes by ingredient keyword
- Search/filter recipes by max cook time
- Add a new recipe (save your own)
- Delete a recipe you added

## 2. User stories

1. As a home cook, I want to browse a list of recipes, so that I can get inspiration for what to make.
2. As a home cook, I want to search recipes by an ingredient I have on hand, so that I can find something to cook without a grocery run.
3. As a busy cook, I want to filter recipes by maximum cook time, so that I can find something that fits my schedule.
4. As a home cook, I want to save my own recipe, so that it's available alongside the built-in ones next time I search or browse.
5. As a home cook, I want to delete a recipe I added, so that I can remove one I no longer want saved.

## 3. Acceptance criteria

### 1. Browse recipes
- Given the app is open, when the page loads, then all available recipes (built-in + saved) are displayed with at least name and cook time visible.
- Each recipe can be expanded to show its full ingredient list and instructions.

### 2. Search by ingredient
- Given a search term is entered, when it matches any ingredient in a recipe (case-insensitive, partial match), then that recipe appears in results.
- Given no recipe matches, then an empty-state message is shown instead of a blank list.
- Clearing the search term restores the full recipe list.

### 3. Filter by cook time
- Given a maximum cook time is entered, when a recipe's cook_time is less than or equal to that value, then it appears in results.
- Ingredient search and cook-time filter can be combined (AND logic).
- An invalid or empty time value is treated as "no time filter."

### 4. Save a recipe
- Given the add-recipe form, when required fields (name, ingredients, cook_time) are filled in and submitted, then the recipe is saved and appears immediately in the browse list.
- The recipe persists after a page refresh (e.g. via local storage).
- An id is generated automatically — the user never enters one.
- Submitting with a missing required field does not save anything, and the form does not silently fail (the user gets an indication something's wrong).

### 5. Delete a saved recipe
- Given a recipe the user added, when they click delete, then it's removed from the list and from storage.
- Built-in recipes cannot be deleted (no delete option shown for them).
- Deletion is immediate, no confirmation dialog required for v1.

## 4. Recipe data fields

| Field | Description |
|---|---|
| `id` | Unique identifier, generated automatically when a recipe is saved |
| `name` | Recipe title (string) |
| `ingredients` | List of ingredients (array of strings) |
| `cook_time` | Cook time in minutes (integer) |
