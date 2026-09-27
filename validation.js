export function isValidCookTime(cook_time) {
  return Number.isFinite(cook_time) && cook_time >= 0;
}
